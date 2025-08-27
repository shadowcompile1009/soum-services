import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { CustomException } from '@src/custom-exception';
import { ProductProducerService } from '@src/kafka/product.producer';
import { VaultInstance } from '@src/utils/vault.util';
import * as moment from 'moment';
import { CommissionSummaryResponse } from '../grpc/proto/commission.pb';
import { GetUserResponse } from '../grpc/proto/v2.pb';
import { V2Service } from '../v2/v2.service';
import { CreateProductDTO } from './dto/createProduct.dto';
import { kafkaProductDto } from './dto/kafakProduct.dto';
import { Product, StatusSummary } from './entity/product.entity';
import { CategoryType } from './enum/categoryType.enum';
import { CustomCodeErrors } from './enum/customErrorCodes.enum';
import { ListingSource } from './enum/listingSource.enum';
import { ProductActionsEnum } from './enum/productActions.enum';
import { ProductSellType } from './enum/productSellType.enum';
import { ProductStatus } from './enum/productStatus.enum';
import { ProductCommissionService } from './product.commission.service';
import { ProductImageService } from './productImageSec.service';
import { SettingService } from './setting.service';
import { InspectionService } from '../inspection/inspection.service';

@Injectable()
export class CreateProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    private readonly productCommissionService: ProductCommissionService,
    private readonly settingService: SettingService,
    private readonly v2Service: V2Service,
    private readonly productProducerService: ProductProducerService,
    private readonly productImageService: ProductImageService,
    @Inject(forwardRef(() => InspectionService))
    private readonly inspectionService: InspectionService,
    private readonly vaultInstance: VaultInstance,
  ) {}
  async addNewProduct(createProductDto: CreateProductDTO, userId: string) {
    const productSetting = await this.settingService.getSettings();
    if (createProductDto.listingGroupId) {
      // get model images
      createProductDto.listingSource = ListingSource.MERCHANT;
    }
    // temp solution by meshal
    // add defualt condition for some categories
    createProductDto.categories =
      await this.ensureConditionCategory(createProductDto);
    let productDoc: Product = {
      id: null,
      description: createProductDto.description,
      categories: createProductDto.categories,
      // productImageSections: createProductDto.productImageSections,
      productSetting: productSetting,
      score: createProductDto.score,
      sellPrice: createProductDto.sellPrice,
      listingSellPrice: createProductDto.sellPrice,
      status: ProductStatus.ACTIVE,
      sellType: createProductDto.productSellType,
      sellerPromoCodeId: createProductDto.sellerPromoCodeId,
      userId: userId,
      createdAt: new Date(),
      groupListingId: createProductDto.listingGroupId,
      listingSource: createProductDto.listingSource || ListingSource.CONSUMER,
      listingAddress: createProductDto.listingAddress || {},
      // all false for now
      statusSummary: {
        isApproved: true,
        isExpired: false,
        isDeleted: false,
        isReported: false,
        isVerifiedByAdmin: false,
        isFraudDetected: false,
        isSearchSync: false,
      } as StatusSummary,
      recommendedPrice: createProductDto.recommendedPrice || null,
      // ProductActions: []
    };

    // get product commission
    const { commissionSummaries } =
      await this.productCommissionService.calculateSummaryCommission({
        product: productDoc,
        allPayments: false,
        isCommissionForBuyer: false,
        settings: productSetting,
        promoCodeId: createProductDto.sellerPromoCodeId,
      });
    const commissionSummaryToCheck = commissionSummaries.length
      ? commissionSummaries[0]
      : null;
    if (!commissionSummaryToCheck)
      throw new CustomException(CustomCodeErrors.NULL_COMMISSION);

    // get user if needed for trade in validation
    const user = await this.v2Service.getUser({
      id: userId,
    });

    await this.validateProduct(
      createProductDto,
      user,
      commissionSummaryToCheck.withPromo ||
        commissionSummaryToCheck.withoutPromo,
    );
    if ((productSetting?.delayListingTime || 0) > 0) {
      productDoc.status = ProductStatus.ON_HOLD;
      productDoc.statusSummary.isApproved = false;
      //add auto approve event
      // auto_approve_at.getTime() + settings.delay_listing_time * 60 * 1000
    }
    productDoc = this.productRepository.create(productDoc);
    await this.productRepository.getEntityManager().persistAndFlush(productDoc);

    productDoc.productImageSections =
      await this.productImageService.createListForProduct(
        createProductDto.productImageSections,
        productDoc.id,
        productDoc.categories.find(
          (elem) => elem.categoryType === CategoryType.CATEGORY,
        )?.categoryId,
      );
    await this.productCommissionService.createSummaryCommission({
      product: productDoc,
      allPayments: false,
      isCommissionForBuyer: false,
      settings: productSetting,
    });
    productDoc.listingAddress =
      Object.keys(productDoc.listingAddress).length !== 0
        ? productDoc.listingAddress
        : null;
    await this.postCreateProductEvents(productDoc);
    return productDoc;
  }

  async postCreateProductEvents(product: Product) {
    await this.productProducerService.produce({
      action: ProductActionsEnum.CREATED,
      data: {
        id: product.id,
        description: product.description,
        userId: product.userId,
        score: product.score,
        sellPrice: product.sellPrice,
        imagesUrl: product.productImageSections
          ?.reduce((acc, curr) => acc.concat(curr.urls), [])
          .map((elem) => `${elem.base}/${elem.relativePath}`),
        status: product.status,
        sellerPromoCodeId: product.sellerPromoCodeId,
        sellType: product.sellType,
        listingSource: product.listingSource,
        categories: product.categories,
        statusSummary: product.statusSummary,
        listingAddress: product.listingAddress,
        recommended_price: product.recommendedPrice,
      } as kafkaProductDto,
    });

    const shouldCreateInspection =
      await this.inspectionService.shouldCreateInspectionWhenProductCreated(
        product?.userId?.toString(),
      );
    if (shouldCreateInspection)
      await this.inspectionService.createInspection(product, null);
  }

  async validateProduct(
    createProductDto: CreateProductDTO,
    user: GetUserResponse,
    commissionSummary: CommissionSummaryResponse,
  ) {
    // validate contain all category tree
    const containAllTree = [
      CategoryType.CATEGORY,
      CategoryType.BRAND,
      CategoryType.MODEL,
      CategoryType.VARIANT,
    ]
      .map((categoryType) => {
        const res = createProductDto.categories.find(
          (category) => categoryType == category.categoryType,
        );
        return !!res;
      })
      .reduce((acc, curr) => acc && curr, true);
    if (!containAllTree)
      throw new CustomException(CustomCodeErrors.INCORRECT_CATEGORY_HIERARCHY);
    // validate last created product for same user
    await this.validateLastProductCreation(user.id, createProductDto.listingSource);
    // validate sellPrice vs model sellPrice
    if (commissionSummary.grandTotal <= 0 || createProductDto.sellPrice <= 0)
      throw new CustomException(CustomCodeErrors.INCORRECT_GT_SELL_PRICE);
    // validate if trade in and user does not have address
    if (
      ProductSellType.TRADE_IN !== createProductDto.productSellType &&
      !user.address
    ) {
      throw new CustomException(CustomCodeErrors.MISSING_ADDRESS);
    }
    // validate score not less 75
    if (createProductDto.score < 75)
      throw new CustomException(CustomCodeErrors.INCORRECT_SCORE);

    // const conditionId = createProductDto.categories.find(
    //   (elem) => elem.categoryType === CategoryType.CONDITION,
    // )?.categoryId;
    // if (conditionId && !isUuid(conditionId))
    //   throw new CustomException(CustomCodeErrors.INCORRECT_CONDITION_ID);
  }

    async validateLastProductCreation(
    userId: string,
    listingSource: ListingSource,
  ) {
    if (listingSource !== ListingSource.INSPECTOR_APP) {
      const product = await this.productRepository.findOne({
        userId: userId,
        status: ProductStatus.ACTIVE,
        createdAt: {
          $gte: moment(new Date()).subtract(10, 'seconds').toDate(),
        },
      });
      if (product)
        throw new CustomException(CustomCodeErrors.LISTING_WITHIN_SMALL_TIME);
    }
  }


  async ensureConditionCategory(createProductDto: CreateProductDTO) {
    const conditionCategory = createProductDto.categories.find(
      (elem) => elem.categoryType === CategoryType.CONDITION,
    );

    if (!conditionCategory || !conditionCategory?.categoryId) {
      const secretData = await this.vaultInstance.getSecretData('product');

      const defaultConditions = JSON.parse(
        secretData?.defaultConditions || '[]',
      );

      const categoryId = createProductDto.categories.find(
        (elem) => elem.categoryType === CategoryType.CATEGORY,
      )?.categoryId;

      const defaultConditionId = defaultConditions.find(
        (elem: any) => elem.categoryId === categoryId,
      )?.conditionId;

      if (defaultConditionId) {
        if (conditionCategory) {
          // Update existing condition category
          conditionCategory.categoryId = defaultConditionId;
        } else {
          // Add new condition category
          createProductDto.categories.push({
            categoryId: defaultConditionId,
            categoryType: CategoryType.CONDITION,
          });
        }
      }
    }
    return createProductDto.categories;
  }
}
