import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ProductProducerService } from '@src/kafka/product.producer';
import { WebEngageProducerService } from '@src/kafka/webEngage.producer';
import { VaultInstance } from '@src/utils/vault.util';
import * as moment from 'moment';
import { CategoryService } from '../category/category.service';
import { CommissionService } from '../commission/commission.service';
import { PromoCode } from '../grpc/proto/commission.pb';
import { ProductDeepLoad } from '../grpc/proto/product.pb';
import { ImageSectionService } from '../image-section/image-section.service';
import { InspectionService } from '../inspection/inspection.service';
import { ReviewService } from '../review/review.service';
import { V2Service } from '../v2/v2.service';
import { BestListingSettingsResponseDto } from './dto/bestListingSettings.dto';
import { DeepLoadReq } from './dto/deepLoadReq.dto';
import { kafkaProductDto } from './dto/kafakProduct.dto';
import { ProductDeepLoadDto } from './dto/productDeepLoad.dto';
import { ProductImageSectionDto } from './dto/productImages.dto';
import { ProductUpdateDto } from './dto/productUpdate.dto';
import { Category } from './entity/category.entity';
import { Product, StatusSummary } from './entity/product.entity';
import { ProductAction, SoldActionData } from './entity/productActions.entity';
import { ProductImageSection } from './entity/productImageSection.entity';
import { SoumUser } from './entity/user.entity';
import { CategoryType } from './enum/categoryType.enum';
import { ProductActionsEnum } from './enum/productActions.enum';
import { ProductSellType } from './enum/productSellType.enum';
import { ProductStatus } from './enum/productStatus.enum';
import { ProductCommissionService } from './product.commission.service';
import { ProductImageService } from './productImageSec.service';
import { SettingService } from './setting.service';
import { BullMQService, JobTypes } from './util/bullmq.util';

@Injectable()
export class ProductService {
  private readonly vaultInstance = new VaultInstance();
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    private readonly em: EntityManager,
    private readonly categoryService: CategoryService,
    private readonly productCommissionService: ProductCommissionService,
    private readonly v2Service: V2Service,
    private readonly commissionService: CommissionService,
    private readonly productImageService: ProductImageService,
    private readonly productProducerService: ProductProducerService,
    private readonly webEngageProducerService: WebEngageProducerService,
    private readonly bullMQService: BullMQService,
    private readonly reviewService: ReviewService,
    private readonly settingService: SettingService,
    private readonly imageSectionService: ImageSectionService,
    @Inject(forwardRef(() => InspectionService))
    private readonly inspectionService: InspectionService,
    @InjectRepository(SoumUser)
    private readonly soumUserRepo: EntityRepository<SoumUser>,
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
  ) {}

  async productDeepLoad(
    productId: string,
    product: Product,
    deepLoadReq: DeepLoadReq,
  ) {
    const deepLoad: ProductDeepLoadDto = new ProductDeepLoadDto();
    if (!product) {
      product = await this.productRepository.findOne({ id: productId });
    }
    // get user
    if (deepLoadReq.isGetseller) {
      // get user if needed for trade in validation
      const user = await this.v2Service.getUser({
        id: product.userId,
      });

      deepLoad.seller = {
        name: user.name,
        id: user.id,
        isKeySeller: user.isKeySeller,
        mobileNumber: user.phoneNumber,
      };
    }
    // get categories
    if (deepLoadReq.isGetCategories) {
      deepLoad.categories = [];
    }

    if (deepLoadReq.isGetImages) {
      const sections =
        await this.productImageService.getProductImages(productId);

      deepLoad.imageSections = ((sections as ProductImageSection[]) || []).map(
        (section) => {
          const secDto = {
            id: section.id,
            description: section.description,
            descriptionAr: section.descriptionAr,
            sectionType: section.sectionType,
            sectionTypeAr: section.sectionTypeAr,
            header: section.header,
            headerAr: section.headerAr,
            maxImageCount: section.maxImageCount,
            minImageCount: section.minImageCount,
            productId: section.productId,
            position: section.position,
            iconURL: section.iconURL,
            base: section.base,
            fullURL: `${section.base}/${section.iconURL}`,
            urls: section.urls.map((elem) => {
              return {
                base: elem.base,
                relativePath: elem.relativePath,
                fullURL: `${elem.base}/${elem.relativePath}`,
              };
            }),
          } as ProductImageSectionDto;
          return secDto;
        },
      );
    }

    if (deepLoadReq.isGetStockImages) {
      const modelId = product.categories.find(
        (elem) => CategoryType.MODEL === elem.categoryType,
      )?.categoryId;
      const paginatedDto = await this.imageSectionService.filterStockImages(
        modelId,
        100,
        0,
      );
      deepLoad.stockImages =
        paginatedDto?.items.map((section) => {
          const secDto = {
            id: section.id,
            description: '',
            descriptionAr: '',
            sectionType: '',
            sectionTypeAr: '',
            header: '',
            headerAr: '',
            maxImageCount: section.urls.length,
            minImageCount: 1,
            productId: '',
            position: 0,
            iconURL: '',
            base: '',
            fullURL: '',
            urls: section.urls.map((elem) => {
              return {
                base: '',
                relativePath: '',
                fullURL: elem,
              };
            }),
          } as ProductImageSectionDto;
          return secDto;
        }) || [];
    }
    return deepLoad;
  }

  async productDeepLoadInspection(ids: string[], deepLoadReq: DeepLoadReq) {
    const deepLoad: any = {};
    // Get all products in a single call
    const productsResults = await this.getProductsFromOldOrNew(ids);
    const products = productsResults
      .filter((result) => result.product !== null)
      .map((result) => result.product);

    let users = [];
    let categories = [];

    // get user
    if (deepLoadReq.isGetseller) {
      users = await this.soumUserRepo.find({
        id: products.map((elem) => elem.userId),
      });
    }

    // get categories
    if (deepLoadReq.isGetCategories) {
      categories = await this.categoryRepo.find({
        id: {
          $in: products.flatMap((p) => p.categories.map((c) => c.categoryId)),
        },
      });
      deepLoad.categories = categories;
    }

    if (deepLoadReq.isGetImages) {
      const sections =
        await this.productImageService.getListOfProductImagesSections(ids);

      deepLoad.images = ((sections as ProductImageSection[]) || []).reduce(
        (acc, section) => {
          const urls = section.urls.map(
            (elem) => `${elem.base}/${elem.relativePath}`,
          );
          if (!acc[section.productId]) {
            acc[section.productId] = [];
          }
          acc[section.productId].push(...urls);
          return acc;
        },
        {},
      );
    }

    // Map all products to their deep load data
    return products.map((product) => {
      const productDeepLoad: any = {};

      if (deepLoadReq.isGetseller) {
        const user = users.find((u) => u.id === product.userId);
        if (user) {
          productDeepLoad.seller = {
            id: user.id,
            name: user.name,
            mobileNumber: user.mobileNumber,
          };
        }
      }

      if (deepLoadReq.isGetCategories) {
        productDeepLoad.categories = product.categories.map((cat) => {
          const category = categories.find((c) => c.id === cat.categoryId);
          return {
            id: cat.categoryId,
            type: cat.categoryType,
            name: category?.name,
            nameAr: category?.nameAr,
          };
        });
      }

      if (deepLoadReq.isGetImages) {
        productDeepLoad.images = deepLoad.images[product.id] || [];
      }

      return {
        id: product.id,
        categories: product.categories,
        sellPrice: product.sellPrice,
        status: product.status,
        userId: product.userId,
        description: product.description,
        storageLocation: product.storageLocation || {
          BIN: null,
          storageNumber: null,
        },
        ...productDeepLoad,
      };
    });
  }

  async getProductFromOldOrNew(productId: string) {
    // First try to get from local DB
    let product = await this.productRepository.findOne({ id: productId });
    let isOldCollection = false;

    // Get V2 data regardless
    const res = await this.v2Service.getProductsAsProductService({
      productIds: [productId],
    });

    const v2Product = res?.products?.[0];
    if (!v2Product) {
      // If no V2 data and no local data, return null
      if (!product) {
        return {
          product: null,
          isOldCollection: false,
        };
      }
      // If only local data exists, return it
      return {
        product,
        isOldCollection: false,
      };
    }

    // If we have V2 data, use it to update or create the product
    const v2ProductData = {
      id: v2Product.id,
      description: v2Product.description,
      categories: v2Product.categories.map((elem) => ({
        categoryId: elem.id,
        categoryType: elem.type,
      })),
      score: Number(v2Product.score),
      sellPrice: v2Product.sellPrice,
      status: v2Product.status,
      userId: v2Product.userId,
      createdAt: new Date(),
      statusSummary: {
        isApproved: v2Product.statusSummary.isApproved,
        isExpired: v2Product.statusSummary.isExpired,
        isDeleted: v2Product.statusSummary.isDeleted,
        isReported: v2Product.statusSummary.isReported,
        isVerifiedByAdmin: v2Product.statusSummary.isVerifiedByAdmin,
        isFraudDetected: v2Product.statusSummary.isFraudDetected,
        isSearchSync: v2Product.statusSummary.isSearchSync,
      } as StatusSummary,
    } as Product;

    if (product) {
      // Update existing product with V2 data
      Object.assign(product, v2ProductData);
      await this.em.persistAndFlush(product);
    } else {
      // If product not found in local DB, just return V2 data without saving
      product = v2ProductData;
      isOldCollection = true;
    }

    // Migrate images if needed
    await this.migrateOldImages(v2Product.imagesUrl, v2Product.id);

    return {
      product,
      isOldCollection,
    };
  }

  async getProductsFromOldOrNew(productIds: string[]) {
    // First try to get from local DB
    const localProducts = await this.productRepository.find({
      id: { $in: productIds },
    });
    const localProductsMap = new Map(localProducts.map((p) => [p.id, p]));

    // Get V2 data for all products
    const res = await this.v2Service.getProductsAsProductService({
      productIds: productIds,
    });

    const v2Products = res?.products || [];
    const v2ProductsMap = new Map(v2Products.map((p) => [p.id, p]));

    const results = await Promise.all(
      productIds.map(async (id) => {
        const v2Product = v2ProductsMap.get(id);
        const localProduct = localProductsMap.get(id);

        if (!v2Product) {
          // If no V2 data and no local data, return null
          if (!localProduct) {
            return {
              product: null,
              isOldCollection: false,
            };
          }
          // If only local data exists, return it
          return {
            product: localProduct,
            isOldCollection: false,
          };
        }

        // If we have V2 data, use it to update or create the product
        const v2ProductData = {
          id: v2Product.id,
          description: v2Product.description,
          categories: v2Product.categories.map((elem) => ({
            categoryId: elem.id,
            categoryType: elem.type,
          })),
          score: Number(v2Product.score),
          sellPrice: v2Product.sellPrice,
          status: v2Product.status,
          userId: v2Product.userId,
          createdAt: new Date(),
          statusSummary: {
            isApproved: v2Product.statusSummary.isApproved,
            isExpired: v2Product.statusSummary.isExpired,
            isDeleted: v2Product.statusSummary.isDeleted,
            isReported: v2Product.statusSummary.isReported,
            isVerifiedByAdmin: v2Product.statusSummary.isVerifiedByAdmin,
            isFraudDetected: v2Product.statusSummary.isFraudDetected,
            isSearchSync: v2Product.statusSummary.isSearchSync,
          } as StatusSummary,
        } as Product;

        if (localProduct) {
          // Update existing product with V2 data
          Object.assign(localProduct, v2ProductData);
          await this.em.persistAndFlush(localProduct);
          return {
            product: localProduct,
            isOldCollection: false,
          };
        } else {
          // If product not found in local DB, just return V2 data without saving
          return {
            product: v2ProductData,
            isOldCollection: true,
          };
        }
      }),
    );

    // Migrate images for all products that need it
    await Promise.all(
      v2Products.map((v2Product) =>
        this.migrateOldImages(v2Product.imagesUrl, v2Product.id),
      ),
    );

    return results;
  }

  async postUpdateProductEvents(
    product: Product,
    deepLoadProduct: ProductDeepLoadDto,
    updateAction: ProductAction,
    userId: string,
  ) {
    // there should be a tracker for post event status overall work
    if (ProductActionsEnum.ADMIN_APPROVE_UPDATE === updateAction.type) {
      await this.postApproveProductEvents(
        product,
        deepLoadProduct,
        updateAction,
      );
    } else if (
      ProductActionsEnum.USER_SELL_PRICE_UPDATE === updateAction.type ||
      ProductActionsEnum.ADMIN_SELL_PRICE_UPDATE === updateAction.type ||
      ProductActionsEnum.SYSTEM_SELL_PRICE_UPDATE === updateAction.type
    ) {
      await this.postSellPriceProductEvents(
        product,
        deepLoadProduct,
        updateAction,
      );
    } else if (
      ProductActionsEnum.USER_DESCRIPTION_UPDATE === updateAction.type
    ) {
      await this.postDescriptionUpdateEvents(
        product,
        deepLoadProduct,
        updateAction,
      );
    } else if (ProductActionsEnum.USER_IMAGE_UPDATE === updateAction.type) {
      await this.postImageUpdateEvents(product, deepLoadProduct, updateAction);
    } else if (ProductActionsEnum.SYSTEM_SOLD_UPDATE === updateAction.type) {
      await this.postSoldUpdateEvents(product, deepLoadProduct, updateAction);
    }
    let adminData = null;
    if (updateAction.type.match(/admin/g)) {
      adminData = { id: userId };
    }
    await this.productProducerService.produce({
      action: updateAction,
      data: {
        id: product.id,
        userId: product.userId,
        sellPrice: product.sellPrice,
        imagesUrl: product.productImageSections
          ?.reduce((acc, curr) => acc.concat(curr.urls), [])
          .map((elem) => `${elem.base}/${elem.relativePath}`),
        status: product.status,
        statusSummary: product.statusSummary,
        categories: product.categories,
        description: product.description,
        listingSource: product.listingSource,
        score: product.score,
        sellerPromoCodeId: product.sellerPromoCodeId,
        sellType: product.sellType,
      } as kafkaProductDto,
      admin: adminData,
    });
  }

  async postApproveProductEvents(
    product: Product,
    deepLoadProduct: ProductDeepLoadDto,
    adminUpdateAction: ProductAction,
  ) {
    const webEngageData = this.getWebEngageData(
      product,
      deepLoadProduct,
      adminUpdateAction,
    );
    await this.webEngageProducerService.produce({
      userId: product.userId,
      eventName: 'Listing got published',
      eventTime: `${new Date().toISOString().split('.')[0]}-0000`,
      eventData: webEngageData,
    });

    if (
      ProductStatus.ACTIVE === product.status &&
      !deepLoadProduct.seller.isKeySeller
    )
      await this.createSellerDeletionNudgeJob(product, deepLoadProduct);
  }

  async postImageUpdateEvents(
    product: Product,
    deepLoadProduct: ProductDeepLoadDto,
    updateAction: ProductAction,
  ) {
    const webEngageData = this.getWebEngageData(
      product,
      deepLoadProduct,
      updateAction,
    );
    await this.webEngageProducerService.produce({
      userId: product.userId,
      eventName: 'Edited Listing',
      eventTime: `${new Date().toISOString().split('.')[0]}-0000`,
      eventData: webEngageData,
    });
  }

  async postSoldUpdateEvents(
    product: Product,
    deepLoadProduct: ProductDeepLoadDto,
    updateAction: ProductAction,
  ) {
    if (ProductStatus.SOLD == product.status) {
      const shouldCreateInspection =
        await this.inspectionService.shouldCreateInspectionWhenOrderCreated(
          product?.userId?.toString(),
        );
      if (shouldCreateInspection)
        await this.inspectionService.createInspection(
          product,
          null,
          (updateAction.actionData as SoldActionData).orderNumber,
        );
    }
  }

  async postDescriptionUpdateEvents(
    product: Product,
    deepLoadProduct: ProductDeepLoadDto,
    updateAction: ProductAction,
  ) {
    const webEngageData = this.getWebEngageData(
      product,
      deepLoadProduct,
      updateAction,
    );
    await this.webEngageProducerService.produce({
      userId: product.userId,
      eventName: 'Edited Listing',
      eventTime: `${new Date().toISOString().split('.')[0]}-0000`,
      eventData: webEngageData,
    });
  }

  async postSellPriceProductEvents(
    product: Product,
    deepLoadProduct: ProductDeepLoadDto,
    updateAction: ProductAction,
  ) {
    const webEngageData = this.getWebEngageData(
      product,
      deepLoadProduct,
      updateAction,
    );
    await this.webEngageProducerService.produce({
      userId: product.userId,
      eventName:
        updateAction.type === ProductActionsEnum.SYSTEM_SELL_PRICE_UPDATE
          ? 'Price Reduction'
          : 'Edited Listing',
      eventTime: `${new Date().toISOString().split('.')[0]}-0000`,
      eventData: webEngageData,
    });
    const condition = await this.categoryService.getProductCondition({
      id: product.categories.find(
        (elem) => CategoryType.CONDITION === elem.categoryType,
      )?.categoryId,
      variantId: product.categories.find(
        (elem) => CategoryType.VARIANT === elem.categoryType,
      )?.categoryId,
      sellPrice: product.sellPrice,
    });
    const priceRange = condition?.priceQuality?.name || null;
    await this.commissionService.updateSellPriceCommissionSummary({
      product: {
        id: product.id,
        sellPrice: product.sellPrice,
        categoryId:
          product?.categories?.find(
            (elem) => CategoryType.CATEGORY === elem.categoryType,
          )?.categoryId || null,
        modelId:
          product?.categories?.find(
            (elem) => CategoryType.MODEL === elem.categoryType,
          )?.categoryId || null,
        priceRange: priceRange,
        source: null,
        varientId: '',
        conditionId: '',
      },
    });
  }

  async createSellerDeletionNudgeJob(
    product: Product,
    deepLoad: ProductDeepLoadDto,
  ) {
    const modelId =
      product?.categories?.find(
        (elem) => CategoryType.MODEL === elem.categoryType,
      )?.categoryId || null;

    const { countdownValInHours } = await this.v2Service.getCountdownValInHours(
      {
        modelId,
      },
    );
    const { isActiveSellerDetectionNudge } =
      await this.v2Service.validateSellerDetectionNudge({});

    if (!countdownValInHours || !isActiveSellerDetectionNudge) return;

    let countdownValInMS = countdownValInHours * 60 * 60 * 1000;
    countdownValInMS = countdownValInMS < 1 ? 30000 : countdownValInMS;
    this.bullMQService.addJob(
      {
        id: product.id,
        sellerPhone: deepLoad.seller.mobileNumber,
        type: JobTypes.SELLER_DELETION_NUDGE,
      },
      {
        delay: countdownValInMS,
        removeOnComplete: true,
      },
    );
  }

  getWebEngageData(
    product: Product,
    deepLoad: ProductDeepLoadDto,
    adminUpdateAction: ProductAction,
  ) {
    if (ProductActionsEnum.ADMIN_APPROVE_UPDATE === adminUpdateAction.type) {
      return {
        'Seller ID': deepLoad.seller.id,
        'Seller Name': deepLoad.seller.name,
        'Model Name': deepLoad.categories.find(
          (elem) => CategoryType.MODEL === elem.type,
        )?.name,
        Variants: deepLoad.categories.find(
          (elem) => CategoryType.VARIANT === elem.type,
        )?.name,
        'Product ID': product.id,
        'Created Time': product.createdAt,
        'Sell Price': product.sellPrice,
        'Category Name': deepLoad.categories.find(
          (elem) => CategoryType.CATEGORY === elem.type,
        )?.name,
        'Brand Name': deepLoad.categories.find(
          (elem) => CategoryType.BRAND === elem.type,
        )?.name,
        'Listing Condition': deepLoad.categories.find(
          (elem) => CategoryType.CONDITION === elem.type,
        )?.name,
        // 'Price Segment': priceRange,
        'Approval Source': 'Admin - Frontliner',
        'Listing type':
          ProductSellType.BIDDING === product.sellType ? 'Bid' : 'Direct',
        'Start Bid':
          ProductSellType.BIDDING === product.sellType ? product.sellPrice : 0,
      };
    } else if (
      ProductActionsEnum.USER_IMAGE_UPDATE === adminUpdateAction.type
    ) {
      return {
        'Seller ID': deepLoad.seller.id,
        'Seller Name': deepLoad.seller.name,
        'Product ID': product.id,
        'Action type': adminUpdateAction.type,
      };
    } else if (
      ProductActionsEnum.USER_DESCRIPTION_UPDATE === adminUpdateAction.type
    ) {
      return {
        'Seller ID': deepLoad.seller.id,
        'Seller Name': deepLoad.seller.name,
        'Product ID': product.id,
        Description: product.description,
        'Action type': adminUpdateAction.type,
      };
    } else if (
      ProductActionsEnum.USER_SELL_PRICE_UPDATE === adminUpdateAction.type ||
      ProductActionsEnum.SYSTEM_SELL_PRICE_UPDATE === adminUpdateAction.type
    ) {
      return {
        'Seller ID': deepLoad.seller.id,
        'Seller Name': deepLoad.seller.name,
        'Product ID': product.id,
        'Sell Price': product.sellPrice,
        'Action type': adminUpdateAction.type,
      };
    }
    return null;
  }
  // migrate images as temp solution till Data team do full migration
  async migrateOldImages(imagesUrl: string[], productId: string) {
    const sections = await this.productImageService.getProductImages(productId);
    if (!sections?.length) {
      // migrate images as temp solution till Data team do full migration
      await this.productImageService.migrateProductImages(
        imagesUrl || [],
        productId,
      );
    }
  }

  validateDuration(activatedDate: string) {
    const start = moment(activatedDate);
    const end = moment();
    let duration = Math.floor(moment.duration(end.diff(start)).asMonths());
    let durationEn = '';
    let durationAr = '';
    switch (true) {
      case duration < 1:
        durationEn = 'Within weeks';
        durationAr = 'أقل من شهر';
        break;
      case duration === 1:
        durationEn = '1 month';
        durationAr = 'شهر واحد';
        break;
      case duration > 1 && duration < 12:
        durationEn = `${duration} months`;
        durationAr =
          duration === 2
            ? 'شهرين'
            : duration >= 3 && duration <= 10
              ? `${duration} أشهر`
              : `${duration} شهر`;
        break;
      case duration === 12:
        durationEn = '1 year';
        durationAr = 'سنة واحدة';
        break;
      default:
        duration = Math.floor(moment.duration(end.diff(start)).asYears());
        durationEn = `${duration}+ years`;
        durationAr = 'أكثر من سنة';
        if (duration > 2) {
          durationAr = 'أكثر من سنتين';
        }
        break;
    }
    return {
      durationEn,
      durationAr,
    };
  }

  async getSellerShowcase(sellerId: string) {
    const user = await this.v2Service.getUser({ id: sellerId });
    const { durationEn, durationAr } = this.validateDuration(
      user.activatedDate,
    );
    const rating = await this.reviewService.getRatingSeller({ sellerId });
    return {
      sellerId,
      isMerchant: user?.isMerchant,
      sellerName: user?.name,
      avatar: user?.avatar,
      city: user?.address?.city,
      stars: rating?.stars,
      bio: user?.bio,
      numberOfSoldProduct: user?.soldListings,
      numberOfActiveProduct: user?.activeListings,
      durationEn,
      durationAr,
    };
  }

  async GetCategoryModelsCountResponse() {
    const result = await this.v2Service.getCategoryModelsCount({
      categoryId: 'cars',
    });
    const priceFilters = {
      carsPrice: result?.carsPrice,
      carsMileage: result?.showMileageFilter,
      financingOffers: result?.showFinancingFilter,
      familyCars: false,
      newCars: false,
      shopGreatDeals: result?.shopGreatDeals,
      lT31: result?.showLT31,
      gT80: result?.showGT80,
      gT30AndLT60: result?.showGT30AndLT60,
      gT60AndLT80: result?.showGT60AndLT80,
    };
    return {
      result,
      filters: priceFilters,
    };
  }
  // this is temp mehtod till theo and dave finish
  // id , categories
  async getProductDataForFeeds(products: any[], promoCode: PromoCode) {
    // get all conditions ids
    const conditions = await this.getAllConditionsFromProducts(products);
    const setting = await this.settingService.getSettings();
    const users = await this.getAllUsersFromProducts(products);
    const commissionReqs = await Promise.all(
      products.map((product) => {
        const conditionId = product.categories.find(
          (elem) => CategoryType.CONDITION === elem.categoryType,
        )?.categoryId;
        const condition = conditionId
          ? conditions.find((cond) => cond.id == conditionId)
          : null;

        const user = users.find((user) => user.id === product.userId);
        return this.productCommissionService.productToCalculateCommissionSummaryRequest(
          product,
          condition,
          user,
          promoCode,
          setting,
        );
      }),
    );
    const commissions =
      await this.productCommissionService.calculateSummaryCommissionsFromProducts(
        commissionReqs,
      );
    // attributes & options should come here also

    return {
      products: products.map((product) => {
        const conditionId = product.categories.find(
          (elem) => CategoryType.CONDITION === elem.categoryType,
        )?.categoryId;
        const condition = conditionId
          ? conditions.find((cond) => cond.id == conditionId)
          : null;

        const commission = commissions.find(
          (commission) => commission.productId === product.id,
        );
        return {
          id: product.id,
          condition: condition
            ? {
                id: condition.id,
                name: condition.name,
                nameAr: condition.nameAr,
                labelColor: condition.labelColor,
                textColor: condition.textColor,
                banners: null,
              }
            : null,
          commissionSummary: commission.commissionSummaries[0],
        } as ProductDeepLoad;
      }),
    };
  }

  async getAllConditionsFromProducts(products: Product[]) {
    const conditionIds = products
      .map(
        (product: Product) =>
          product.categories.find(
            (elem) => CategoryType.CONDITION === elem.categoryType,
          )?.categoryId,
      )
      .filter(Boolean);
    const conditions = conditionIds?.length
      ? await this.categoryService.getConditions({
          ids: conditionIds,
        })
      : [];
    return conditions;
  }

  async getAllUsersFromProducts(products: Product[]) {
    const usersId = products.map((product: Product) => product.userId);
    let users = [];
    if (usersId?.length) {
      const result = await this.v2Service.getUsers({
        userIds: usersId,
        limitUsersWithBank: false,
      });
      users = result?.users;
    }
    return users || [];
  }

  async updateProduct(
    productId: string,
    updateProduct: ProductUpdateDto,
  ): Promise<boolean> {
    try {
      const result = await this.productRepository.nativeUpdate(
        { id: productId },
        updateProduct,
      );
      return result > 0;
    } catch (error) {
      console.error('Failed to update product:', error);
      return false;
    }
  }

  async getBestListingService(
    categoryId: string,
  ): Promise<BestListingSettingsResponseDto> {
    try {
      const secretData = await this.vaultInstance.getSecretData('product');
      const categoryBestListingVariant =
        JSON.parse(secretData?.categoryBestListingVariant) || [];
      const categorySettings = categoryBestListingVariant.find(
        (elem: BestListingSettingsResponseDto) =>
          elem.categoryId === categoryId,
      );

      if (!categorySettings) {
        return null;
      }

      return categorySettings;
    } catch (error) {
      this.logger.error(
        'Failed to get categoryBestListingVariant from vault:',
        error,
      );
      return null;
    }
  }
}
