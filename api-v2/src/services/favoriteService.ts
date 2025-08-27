import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { FavoriteDto } from '../dto/favorite/FavoriteDto';
import { PaginationDto } from '../dto/paginationDto';
import { ListFavoritesDto } from '../dto/product/ListFavoritesDto';
import { ProductOrderStatus, ProductStatus } from '../enums/ProductStatus.Enum';
import { AddFeedback, RemoveFeedback } from '../grpc/recommendation';
import { FavoriteDocument } from '../models/Favourite';
import { VariantDocument } from '../models/Variant';
import { AttributeRepository } from '../repositories/attributeRepository';
import { FavoriteRepository } from '../repositories/FavoriteRepository';
import { ProductRepository } from '../repositories/productRepository';
import { VariantRepository } from '../repositories/variantRepository';
import { isGreatDeal } from '../util/isGreatDeal';
import { ProductService } from './productService';
import { SettingService } from './settingService';
import { getConditions } from '../grpc/category';
import { UserService } from './userService';
import { ProductAccessSource } from '../enums/ProductAccessSource.Enum';
import { formatPriceInDecimalPoints } from '../util/common';
import { getDefaultPromoCode } from '../grpc/commission';
import { mapAttributes } from '../util/attributes';

@Service()
export class FavoriteService {
  @Inject()
  variantRepository: VariantRepository;
  @Inject()
  userService: UserService;
  constructor(
    public favoriteRepository: FavoriteRepository,
    public attributeRepository: AttributeRepository,
    public productRepository: ProductRepository,
    public settingService: SettingService,

    public productService: ProductService,
    public error: ErrorResponseDto
  ) {}

  async addToFavorites(
    createFavDto: FavoriteDto
  ): Promise<string | FavoriteDocument> {
    try {
      const favDocument: FavoriteDocument = this.mapToFavDocument(createFavDto);
      const [err, data] = await this.favoriteRepository.updateFavourite(
        favDocument
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      // We need this to push data to Recommendation service
      try {
        AddFeedback({
          userId: createFavDto.userId,
          itemId: createFavDto.productId,
          type: 'ADD_TO_FAVORITES',
        }).then((response: { status: boolean }) => {
          if (!response.status) {
            console.log(
              'Error while adding feedback to recommendation service'
            );
          }
        });
      } catch (error) {
        console.log(
          'Error while adding feedback to recommendation service: ',
          error
        );
      }
      return data.result as FavoriteDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_TO_FAV,
          exception.message
        );
      }
    }
  }
  async getUserFavorites(userId: string, page: number, size: number) {
    try {
      const [err, data] = await this.favoriteRepository.getUserFavorites(
        userId,
        page,
        size
      );
      if (err) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_GET_FAV;
        throw this.error;
      }

      const { docs, hasNextPage, totalDocs } =
        data.result as PaginationDto<FavoriteDocument>;
      const favorites = await this.mapFavoritesToProductsDto(
        userId,
        docs as any[]
      );
      return {
        docs: favorites || [],
        page: page,
        hasNextPage,
        totalDocs,
      } as PaginationDto<ListFavoritesDto>;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_FAV,
          exception.message
        );
    }
  }

  async removeFromFavorites(favoriteDto: FavoriteDto) {
    try {
      if (!favoriteDto) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_GET_INVOICE;
        this.error.message = 'favorite dto undefined';
        throw this.error;
      }
      // We need this to remove the feedback from Recommendation service
      try {
        RemoveFeedback({
          userId: favoriteDto.userId,
          itemId: favoriteDto.productId,
          type: 'ADD_TO_FAVORITES',
        }).then((response: { status: boolean }) => {
          if (!response.status) {
            console.log(
              'Error while adding feedback to recommendation service'
            );
          }
        });
      } catch (error) {
        console.log(
          'Error while adding feedback to recommendation service: ',
          error
        );
      }
      return await this.favoriteRepository.removeFromFavorites(favoriteDto);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REMOVE_FAV,
          exception.message
        );
      }
    }
  }
  mapToFavDocument(createFavDto: FavoriteDto): FavoriteDocument {
    if (!createFavDto) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_ADD_TO_FAV
      );
    }
    const favDocument = {
      productId: createFavDto.productId,
      userId: createFavDto.userId,
    } as FavoriteDocument;
    return favDocument;
  }
  async mapFavoritesToProductsDto(userId: string, products: any[]) {
    const conditionIds = products
      .map((elem: any) => elem.conditionId)
      .filter(Boolean);
    const conditions = conditionIds?.length
      ? await getConditions({
          ids: conditionIds,
        })
      : [];
    return Promise.all(
      products.map(async (elem: any) => {
        const [, variantRes] = await this.variantRepository.getById(
          elem.varient_id
        );
        const variant = variantRes.result as VariantDocument;
        const attributes = await mapAttributes(variant.attributes);
        let Year = '';
        for (const attribute of attributes) {
          if (attribute?.title?.enName === 'Year') {
            Year = attribute?.value?.enName;
            break;
          }
        }
        let isAvailable = true;
        if (
          elem.status !== ProductStatus.Active ||
          elem.sellStatus !== ProductOrderStatus.Available ||
          elem.expiryDate < new Date()
        ) {
          isAvailable = false;
        }
        let showSecurityBadge = false;
        try {
          const user = await this.userService.getUser(elem.sellerId);
          showSecurityBadge = user?.hasOptedForSF || false;
        } catch (err) {}
        let expressDeliveryBadge = false;

        if (elem.isConsignment) {
          expressDeliveryBadge = true;
        } else {
          expressDeliveryBadge =
            await this.productService.checkExpressDeliveryFlag({
              sellerId: elem.sellerId.toString(),
              productId: elem.productId?.toString(),
            });
        }
        const condition = elem.conditionId
          ? conditions.find(cond => cond.id == elem.conditionId)
          : null;

        const [errSettings, sysSettings] =
          await this.settingService.getSettingsObjectByKeys([
            'delivery_fee',
            'delivery_threshold',
            'apply_delivery_fee',
            'apply_referral_codes',
            'referral_discount_type',
            'referral_percentage',
            'referral_fixed_amount',
            'buyer_commission_percentage',
            'vat_percentage',
            'apply_delivery_fee_mpps',
            'apply_delivery_fee_spps',
            'price_quality_extra_commission',
            'Show_payouts_only_to_sellers',
          ]);
        if (errSettings) throw new Error('settings was not found');
        const promoCode = await getDefaultPromoCode();
        const commissionSummaries =
          await this.productService.calculateSummaryCommission({
            product: {
              id: elem.productId,
              sellPrice: elem.sellPrice,
              modelId: elem.model_id,
              varientId: elem.varientId,
              categoryId: elem.category_id,
              conditionId: elem.conditionId,
              grade: elem.grade,
            },
            promoCode: promoCode,
            sellerId: elem.sellerId,
            isCommissionForBuyer: true,
            source: ProductAccessSource.SPP,
            sysSettings,
            allPayments: false,
            // add reservation here
          });

        const deliveryFee = sysSettings?.delivery_fee;

        const commissionSummary =
          commissionSummaries[0]?.withPromo ||
          commissionSummaries[0]?.withoutPromo;

        const commissionAndVat =
          Number(commissionSummaries[0].withoutPromo.commission) +
          Number(commissionSummaries[0].withoutPromo.realEstateVat) +
          (sysSettings.apply_delivery_fee_spps
            ? Number(commissionSummaries[0].withoutPromo.totalVat)
            : Number(commissionSummaries[0].withoutPromo.commissionVat));

        const grandTotal = commissionSummary.grandTotal;

        const item = {
          productId: elem.productId,
          isAvailable: isAvailable,
          grade: elem.grade,
          arGrade: elem.arGrade,
          variantName: elem.variantName,
          arVariantName: elem.arVariantName,
          modelName: elem.modelName,
          arModelName: elem.arModelName,
          sellPrice: elem.sellPrice,
          grandTotal: grandTotal,
          extraFees: formatPriceInDecimalPoints(commissionAndVat) || 0,
          deliveryFee: deliveryFee || 0,
          originalPrice: elem.originalPrice,
          productImage: elem.productImages ? elem.productImages[0] : null,
          sellerId: elem.sellerId,
          categoryId: elem.category_id,
          isGreatDeal: elem.conditions
            ? isGreatDeal(elem.grade, elem.sellPrice, elem.conditions)
            : false,
          attributes: attributes || [],
          sellStatus: elem.sellStatus,
          showSecurityBadge,
          sellDate:
            elem?.sellStatus == ProductOrderStatus.Sold
              ? elem?.sellDate.toISOString()
              : '',
          condition: condition
            ? {
                id: condition.id,
                name: condition.name,
                nameAr: condition.nameAr,
                labelColor: condition.labelColor,
                textColor: condition.textColor,
              }
            : null,
          brand: {
            name: elem?.brand?.brand_name,
            nameAr: elem?.brand?.brand_name_ar,
          },
          category: {
            name: elem?.category?.category_name,
            nameAr: elem?.category?.category_name_ar,
          },
          expressDeliveryBadge,
          categoryName: elem?.category?.category_name,
          Year,
          Condition: condition?.name || '',
        } as any;
        if (elem?.isBiddingProduct && elem?.billingSettings?.activate_bidding) {
          item.activate_bidding = elem?.billingSettings?.activate_bidding;
          item.start_bid = elem?.billingSettings?.start_bid;
          item.highest_bid = elem?.billingSettings?.start_bid;
        }

        if (!item.categoryId) delete item.categoryId;
        return item;
      })
    );
  }
}
