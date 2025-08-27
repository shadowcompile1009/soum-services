import axios from 'axios';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import mongoose, { LeanDocument } from 'mongoose';
import Container, { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { PaginationDto } from '../dto/paginationDto';
import { BiddingProductDto } from '../dto/product/BiddingProductDto';
import { ExploreProductDto } from '../dto/product/ExploreProductDto';
import {
  FinancingRequestSummary,
  ProductCalculationSummaryDto,
  ProductPriceDiscountSummary,
  ProductSPriceSummary,
  ReservationSummary,
  promoCodeSummary,
} from '../dto/product/ProductCalculationSummaryDto';
import {
  FilteredProductsDto,
  ProductFilterDto,
} from '../dto/product/ProductFilterDto';
import { GetProductSummaryInputDto } from '../dto/product/ProductSummaryInputDto';
import { AttributeDto } from '../dto/variant/AttributeDto';
import { ProductOrderStatus, ProductStatus } from '../enums/ProductStatus.Enum';
import { sendMail } from '../libs/sendgrid';
import { sendSMSViaUnifonic } from '../libs/unifonic';
import { EditPriceProductInput } from '../models/AdminChangePriceHistory';
import { AttributeDocument } from '../models/Attribute';
import {
  ILegacyProductModel,
  LegacyProductInput,
  LegacyProductType,
  ProductListData,
  ProductQuestion,
} from '../models/LegacyProducts';
import { LegacyPromoCodeDocument } from '../models/LegacyPromoCode';
import { Tag, UserLegacyDocument } from '../models/LegacyUser';
import { SettingDocument } from '../models/Setting';
import { BaseRepository } from '../repositories/BaseRepository';
import { ActivityRepository } from '../repositories/activityRepository';
import { AdminChangePriceHistoryRepository } from '../repositories/adminChangePriceHistoryRepository';
import { AdminRepository } from '../repositories/adminRepository';
import { BidRepository } from '../repositories/bidRepository';
import { BrandRepository } from '../repositories/brandRepository';
import { CategoryRepository } from '../repositories/categoryRepository';
import { ColorRepository } from '../repositories/colorRepository';
import { ModelRepository } from '../repositories/modelRepository';
import {
  MerchantSoldCounts,
  OrderRepository,
} from '../repositories/orderRepository';
import { PaymentRepository } from '../repositories/paymentRepository';
import { ProductRepository } from '../repositories/productRepository';
import { QuestionnaireRepository } from '../repositories/questionnaireRepository';
import { UserRepository } from '../repositories/userRepository';
import { VariantRepository } from '../repositories/variantRepository';
import { ProductState } from '../states/ProductState/ProductState';
import { formatPriceInDecimalPoints, getParsedValue } from '../util/common';

import {
  AttributeVariantDocument,
  FeatureForProduct,
  VariantDocument,
  VariantForProduct,
} from '../models/Variant';
import { AddressRepository } from '../repositories/addressRepository';
import { AttributeRepository } from '../repositories/attributeRepository';
import { SettingRepository } from '../repositories/settingRepository';
import { DeltaMachineService } from '../services/deltaMachineService';
import { getActivityLogByOrderNumber } from '../util/activityLogs';

import config from 'config';
import { Types } from 'mongoose';
import {
  ProductUpdateBulkListingDto,
  ProductUpdateDto,
} from '../dto/product/ProductUpdateDto';
import { DeliveryRules } from '../dto/product/ProductViewDto';
import { ActivityLogAction, ActivityLogEvent } from '../enums/ActivityLog';
import { AddonType } from '../enums/AddonType';
import { CategoryType } from '../enums/CategoryType';
import { FeedType } from '../enums/FeedType';
import { ListingSource } from '../enums/ListingSource';
import { PaymentModuleName } from '../enums/PO-module-name.enum';
import { PriceNudgeCondition } from '../enums/PriceNudgeCondition';
import { ProductAccessSource } from '../enums/ProductAccessSource.Enum';
import { SettingValues } from '../enums/SettingValues';
import { ProductActions } from '../enums/productActions.enum';
import { ProductSellType } from '../enums/productSellType.enum';
import { getAddOns } from '../grpc/addon';
import { GetBidSettings, getOfferForProduct } from '../grpc/bid';
import { getConditions, getProductCondition } from '../grpc/category';
import {
  calculateProductCommissionSummary,
  createProductCommissionSummary,
  getDefaultPromoCode,
  getFeedPromo,
  getProductSummaryCommission,
  getPromoCodeDetails,
  migrateProductCommissionSummary,
  updateSellPriceInCommissionSummary,
  updateSellerCommission,
} from '../grpc/commission';
import { GetAddonsRequest } from '../grpc/proto/addon/GetAddonsRequest';
import { GetProductCatConRequest } from '../grpc/proto/category.pb';
import { AddOn } from '../grpc/proto/commission/AddOn';
import { BreakDownResponse } from '../grpc/proto/commission/BreakDownResponse';
import { CalculateCommissionSummaryRequest } from '../grpc/proto/commission/CalculateCommissionSummaryRequest';
import { CalculationSettings } from '../grpc/proto/commission/CalculationSettings';
import { CommissionFilters } from '../grpc/proto/commission/CommissionFilters';
import { CreateCommissionSummaryRequest } from '../grpc/proto/commission/CreateCommissionSummaryRequest';
import { DetailedPromoCode } from '../grpc/proto/commission/DetailedPromoCode';
import { MigrateCommissionSummaryRequest } from '../grpc/proto/commission/MigrateCommissionSummaryRequest';
import { MigrationCalculationSettings } from '../grpc/proto/commission/MigrationCalculationSettings';
import { Order } from '../grpc/proto/commission/Order';
import { Product } from '../grpc/proto/commission/Product';
import { PromoCode } from '../grpc/proto/commission/PromoCode';
import { SellerUserType } from '../grpc/proto/commission/sellerType.enum';
import { ProductForProductService } from '../grpc/proto/v2.pb';
import { AddFeedback } from '../grpc/recommendation';
import { getCache, setCache } from '../libs/redis';
import { getSecretData } from '../libs/vault';
import { AddressDocument } from '../models/Address';
import { CategoryDocument } from '../models/Category';
import { ConditionDocument } from '../models/Condition';
import { DeltaMachineStatusDocument } from '../models/DeltaMachineStatus';
import { DeltaMachineUserDocument } from '../models/DeltaMachineUsers';
import { DMStatusGroups, GetAllDMStatusGroup } from '../models/DmStatusGroup';
import { ListingGroupInput } from '../models/ListingGroup';
import { DeviceModelDocument } from '../models/Model';
import { ListingGroupRepository } from '../repositories';
import { FeedRepository } from '../repositories/FeedRepository';
import { DeltaMachineAuthenticationRepository } from '../repositories/deltaMachineAuthenticationRepository';
import { SellerDMOrder } from '../repositories/deltaMachineRepository';
import { InvoiceRepository } from '../repositories/invoiceRepository';
import { PriceNudgingHistoryRepository } from '../repositories/priceNudingHistoryRepository';
import { SubscriptionRepository } from '../repositories/subscriptionRepository';
import { mapAttributes } from '../util/attributes';
import {
  ConditionConsumerService,
  ProductConsumerService,
} from '../util/consumer';
import { generateMismatchReport } from '../util/excel';
import { isGreatDeal } from '../util/isGreatDeal';
import logger from '../util/logger';
import { productView } from '../util/productView';
import { returnedDataTemplate } from '../util/queryHelper';
import { sendEventData } from '../util/webEngageEvents';
import { AskSellerService } from './askSellerService';
import { DMSecurityFeeService } from './dmSecurityFeeService';
import { DmStatusGroupService } from './dmStatusGroupsService';
import { FreshchatService } from './freshchatService';
import { SearchService } from './searchService';
import { SettingService } from './settingService';
import { VariantService } from './variantService';
import { syncProduct } from '../grpc/productMicroService';

const categoryKafkaConfig: { [key: string]: string } =
  config.get('categoryKafka');

const productKafkaConfig: { [key: string]: string } = config.get('product');
@Service()
export class ProductService {
  @Inject()
  public searchService?: SearchService;

  @Inject()
  public askSellerService?: AskSellerService;
  public deltaMachineService: DeltaMachineService;
  constructor(
    // public deltaMachineService?: DeltaMachineService,
    public conditionConsumerService?: ConditionConsumerService,
    public productConsumerService?: ProductConsumerService,
    public dmStatusGroupService?: DmStatusGroupService,
    public VariantService?: VariantService,
    public error?: ErrorResponseDto,
    public productRepository?: ProductRepository,
    public modelRepository?: ModelRepository,
    public brandRepository?: BrandRepository,
    public categoryRepository?: CategoryRepository,
    public questionnaireRepository?: QuestionnaireRepository,
    public colorRepository?: ColorRepository,
    public orderRepository?: OrderRepository,
    public variantRepository?: VariantRepository,
    public userRepository?: UserRepository,
    public bidRepository?: BidRepository,
    public activityRepository?: ActivityRepository,
    public adminLogRepository?: AdminChangePriceHistoryRepository,
    public adminRepository?: AdminRepository,
    public settingRepository?: SettingRepository,
    public attributeRepository?: AttributeRepository,
    public addressRepository?: AddressRepository,
    public feedRepository?: FeedRepository,

    public paymentRepository?: PaymentRepository,
    public invoiceRepository?: InvoiceRepository,
    public subscriptionRepository?: SubscriptionRepository,
    public deltaMachineAuthenticationRepository?: DeltaMachineAuthenticationRepository,
    public priceNudgingHistoryRepository?: PriceNudgingHistoryRepository,
    public settingService?: SettingService,
    public listingGroupRepository?: ListingGroupRepository,
    public dmSecurityFeeService?: DMSecurityFeeService,
    public freshchatService?: FreshchatService
  ) {
    (async (): Promise<any> => {
      await this.setupConditionConsumer();
    })();

    (async (): Promise<any> => {
      await this.setupProductConsumer();
    })();
    this.deltaMachineService = Container.get(DeltaMachineService);
  }
  async testProductState(
    id: string,
    currentState: string,
    nextState: string,
    action: string
  ) {
    const productState = new ProductState(currentState);
    let result = false;
    switch (action) {
      case 'listing_success':
        result = productState.action.listingSuccessful(currentState, nextState);
        break;
      case 'listing_delete':
        result = productState.action.deleteListing(currentState, nextState);
        break;
      case 'republish':
        result = productState.action.republish(currentState, nextState);
        break;
      case 'exceed_duration':
        result = productState.action.exceedDuration(currentState, nextState);
        break;
      case 'renew':
        result = productState.action.renewListing(currentState, nextState);
        break;
      case 'delete':
        result = productState.action.delete(currentState, nextState);
        break;
      case 'proceed_payment':
        result = productState.action.proceedPayment(currentState, nextState);
        break;
      case 'payment_success':
        result = productState.action.paymentSuccessful(currentState, nextState);
        break;
      case 'dispute_accept':
        result = productState.action.disputeAccept(currentState, nextState);
        break;
      case 'fail_payment':
        result = productState.action.failPayment(currentState, nextState);
        break;
    }
    return result;
  }
  async setupConditionConsumer() {
    await this.conditionConsumerService.consume(
      {
        topics: [categoryKafkaConfig.prefix + '-condition-activity-log'],
      },
      {
        eachMessage: async ({ message }) => {
          try {
            const conditionEventLogRequest = JSON.parse(
              message?.value?.toString()
            );
            const condition = conditionEventLogRequest?.condition;
            if (condition) {
              await this.updateProductsCondition({
                categoryId: condition.categoryId,
                conditionId: condition.id,
                scoreRangeMax: condition.scoreRange.max,
                scoreRangeMin: condition.scoreRange.min,
              });
            }
          } catch (error) {
            console.log(error);
          }
        },
      },
      categoryKafkaConfig
    );
  }

  async setupProductConsumer() {
    await this.productConsumerService.consume(
      {
        topics: [productKafkaConfig.prefix + '-product-activity-log'],
      },
      {
        eachMessage: async ({ message }) => {
          try {
            const productEventLog = JSON.parse(message?.value?.toString());
            if (ProductActions.CREATED == productEventLog.action) {
              await this.handleCreatedProduct(productEventLog);
            } else if (
              ProductActions.ADMIN_APPROVE_UPDATE ==
              productEventLog?.action?.type
            ) {
              await this.handleAdminApproveProduct(productEventLog);
            } else if (
              ProductActions.ADMIN_REJECT_UPDATE ==
              productEventLog?.action?.type
            ) {
              await this.handleAdminRejectProduct(productEventLog);
            } else if (
              ProductActions.ADMIN_VERIFY_UPDATE ==
              productEventLog?.action?.type
            ) {
              await this.handleAdminVerifyProduct(productEventLog);
            } else if (
              ProductActions.ADMIN_DELETE_UPDATE ==
              productEventLog?.action?.type
            ) {
              await this.handleAdminDeleteProduct(productEventLog);
            } else if (
              ProductActions.ADMIN_REGA_URL_UPDATE ==
              productEventLog?.action?.type
            ) {
              await this.handleAdminREGAURLProduct(productEventLog);
            } else if (
              [
                ProductActions.ADMIN_IMAGE_UPDATE,
                ProductActions.USER_IMAGE_UPDATE,
              ].includes(productEventLog?.action?.type)
            ) {
              await this.handleAdminUpdateImageProduct(productEventLog);
            } else if (
              [
                ProductActions.ADMIN_SELL_PRICE_UPDATE,
                ProductActions.USER_SELL_PRICE_UPDATE,
                ProductActions.SYSTEM_SELL_PRICE_UPDATE,
              ].includes(productEventLog?.action?.type)
            ) {
              await this.handleUpdateSellPriceProduct(productEventLog);
            } else if (
              [
                ProductActions.USER_DESCRIPTION_UPDATE,
                ProductActions.ADMIN_DESCRIPTION_UPDATE,
              ].includes(productEventLog?.action?.type)
            ) {
              await this.handleUpdateDescriptionProduct(productEventLog);
            } else if (
              ProductActions.ADMIN_GUARANTEES_URL_UPDATE ==
              productEventLog?.action?.type
            ) {
              await this.handleAdminGuaranteesURLProduct(productEventLog);
            }
          } catch (error) {
            console.log('Error While consuming products', error);
          }
        },
      },
      productKafkaConfig
    );
  }

  // Handle product service events
  async handleCreatedProduct(productEventLog: any) {
    const listingProduct: LegacyProductInput = {
      _id: productEventLog.data.id,
      category_id:
        productEventLog.data.categories.find(
          (elem: any) => CategoryType.CATEGORY === elem.categoryType
        )?.categoryId || null,
      brand_id:
        productEventLog.data.categories.find(
          (elem: any) => CategoryType.BRAND === elem.categoryType
        )?.categoryId || null,
      model_id:
        productEventLog.data.categories.find(
          (elem: any) => CategoryType.MODEL === elem.categoryType
        )?.categoryId || null,
      varient_id:
        productEventLog.data.categories.find(
          (elem: any) => CategoryType.VARIANT === elem.categoryType
        )?.categoryId || null,
      condition_id:
        productEventLog.data.categories.find(
          (elem: any) => CategoryType.CONDITION === elem.categoryType
        )?.categoryId || null,
      product_images: productEventLog.data.imagesUrl || [],
      sell_price:
        formatPriceInDecimalPoints(productEventLog.data?.sellPrice) || 0,
      bid_price:
        formatPriceInDecimalPoints(productEventLog.data?.sellPrice) || 0,
      description: productEventLog.data?.description || '',
      // promocode: fullMessage.data?.sellerPromocodeId || '',
      score: Number(parseFloat(productEventLog.data.score).toFixed(2)),
      // attributes: fullMessage.data?.attributes?.split(',') || [],
      start_bid: productEventLog.data?.sellPrice || 0,
      listingSource:
        productEventLog.data?.listingSource || ListingSource.CONSUMER,
      listingGroupId: productEventLog.data?.groupListing?.id,
      status: productEventLog?.data?.status,
      isBiddingProduct:
        ProductSellType.BIDDING == productEventLog.data.sellType,
      trade_in: ProductSellType.TRADE_IN == productEventLog.data.sellType,
      isApproved: productEventLog.data?.statusSummary?.isApproved || false,
      sell_status: 'Available',
      // productEventLog doesn't have this info
      varient: 'Next',
      varient_ar: 'Next',
      body_cracks: 'no',
      answer_to_questions: '',
      answer_to_questions_ar: '',
      grade: 'Like New',
      grade_ar: 'Like New',
      previous_grade: '',
      previous_score: null,
      pick_up_address: '',
      isListedBefore: 'no',
      listingAddress: productEventLog.data.listingAddress,
      recommended_price: productEventLog.data.recommended_price,
      isConsignment:
        productEventLog.data.sellType === ProductSellType.CONSIGNMENT,
    };

    if (listingProduct.varient_id) {
      const [error, variant] = await this.VariantService.getShortVariantByID(
        listingProduct.varient_id
      );

      if (!error) {
        listingProduct.varient = (variant.result as VariantDocument)?.varient;
        listingProduct.varient_ar = (
          variant.result as VariantDocument
        )?.varient_ar;
      }
    }

    return await this.createProductForRevamp(
      listingProduct,
      productEventLog.data.userId
    );
  }

  async handleAdminApproveProduct(productEventLog: any) {
    const [errSettings, sysSettings] =
      await this.settingService.getSettingsObjectByKeys(['delay_listing_time']);
    let autoApproveAt = new Date();
    if (sysSettings.delay_listing_time && sysSettings.delay_listing_time > 0) {
      autoApproveAt = new Date(
        autoApproveAt.getTime() + sysSettings.delay_listing_time * 60 * 1000
      );
    }
    if (errSettings) throw new Error('settings was not found');
    const [err, data] = await this.productRepository.approveProduct(
      productEventLog?.data?.id,
      productEventLog?.data?.statusSummary?.isApproved,
      productEventLog?.data?.statusSummary?.isApproved
        ? new Date()
        : autoApproveAt
    );
    if (err) {
      throw err;
    }
    if (productEventLog?.data?.statusSummary?.isApproved === false) return data;

    await this.deltaMachineService.sendFirstPublishOutboundMsg(
      productEventLog?.data?.id
    );
    await this.userRepository.updateRatesScan(
      productEventLog.data.userId,
      false
    );

    const filter = {
      productIds: [productEventLog?.data?.id],
      size: 1,
    } as ProductFilterDto;
    productEventLog?.data?.statusSummary?.isApproved
      ? await this.searchService.getSyncData(filter)
      : await this.searchService.deleteOneOrManyProducts([
          productEventLog?.data?.id,
        ]);
  }

  async handleAdminRejectProduct(productEventLog: any) {
    const [err, rejectProductResult] =
      await this.productRepository.rejectProduct(
        productEventLog?.data?.id,
        productEventLog?.action?.actionData?.reason
      );

    if (err) {
      throw rejectProductResult;
    }
    // Re-calculate the rates
    await this.userRepository.updateRatesScan(
      productEventLog?.data?.userId?.toString(),
      false
    );
    await this.searchService.deleteOneOrManyProducts([
      productEventLog?.data?.id,
    ]);

    return rejectProductResult;
  }
  async handleAdminVerifyProduct(productEventLog: any) {
    await this.productRepository.verifyProduct(
      productEventLog?.data?.id,
      productEventLog?.admin?.id,
      productEventLog?.data?.statusSummary.isVerifiedByAdmin
    );
  }
  async handleAdminDeleteProduct(productEventLog: any) {
    await this.productRepository.deleteProduct(
      productEventLog?.data?.id,
      productEventLog?.action?.actionData?.reason
    );
    await this.searchService.deleteOneOrManyProducts([
      productEventLog?.data?.id,
    ]);
  }

  async handleAdminUpdateImageProduct(productEventLog: any) {
    await this.productRepository.updateProductImages(
      productEventLog?.data?.id,
      productEventLog?.data?.imagesUrl
    );
    if (productEventLog?.data?.listingSource == ListingSource.CONSUMER)
      await this.handleAdminApproveProduct(productEventLog);
    else {
      await this.searchService.addProducts([productEventLog?.data?.id]);
    }
  }

  async handleAdminREGAURLProduct(productEventLog: any) {
    await this.productRepository.updateProductDetails(
      productEventLog?.data?.id,
      {
        regaUrl: productEventLog?.action?.actionData?.regaUrl,
      }
    );
  }

  async handleUpdateSellPriceProduct(productEventLog: any) {
    await this.productRepository.updatePrice(
      productEventLog?.data?.id,
      productEventLog.data.userId,
      productEventLog?.data?.sellPrice
    );
    await this.addPriceNudgingHistory(
      productEventLog?.data?.id,
      productEventLog?.data?.sellPrice
    );
    await this.searchService.addProducts([productEventLog?.data?.id]);
  }

  async handleUpdateDescriptionProduct(productEventLog: any) {
    await this.productRepository.updateProductDetails(
      productEventLog?.data?.id,
      { description: productEventLog?.data?.description }
    );
    if (productEventLog?.data?.listingSource == ListingSource.CONSUMER)
      await this.handleAdminApproveProduct(productEventLog);
  }

  async handleAdminGuaranteesURLProduct(productEventLog: any) {
    await this.productRepository.updateProductDetails(
      productEventLog?.data?.id,
      {
        guaranteesUrl: productEventLog?.action?.actionData?.guaranteesUrl,
      }
    );
  }
  getDiscountValueOfPromoCode(
    promoCode: LegacyPromoCodeDocument,
    sellPrice: number,
    settingVat: number,
    commission: number,
    orderOf: string,
    settings?: { [key: string]: any }
  ) {
    let discountValue = 0;
    if (promoCode && promoCode.promoType) {
      if (promoCode.promoGenerator === 'Referral') {
        const referralDiscountType =
          settings['referral_discount_type'] || 'Fixed';
        if (referralDiscountType === 'Percentage') {
          let percentage: number = settings['referral_percentage'] || 10;
          if (percentage > 10) {
            percentage = 10;
          }

          const discountAmountByPercentage = (percentage * sellPrice) / 100;
          const fixedAmountOfReferral = settings['referral_fixed_amount'];
          discountValue =
            discountAmountByPercentage > fixedAmountOfReferral
              ? fixedAmountOfReferral
              : discountAmountByPercentage;
        } else {
          discountValue = settings['referral_fixed_amount'] || 0;
        }
      } else {
        if (promoCode.promoType === 'Fixed') {
          discountValue = promoCode.discount;
        } else {
          discountValue = (sellPrice * promoCode.percentage) / 100;
          discountValue =
            promoCode.discount > discountValue
              ? discountValue
              : promoCode.discount;
        }
      }
    }

    let commissionDiscount = discountValue;
    let remaining = 0;
    if (discountValue >= commission) {
      commissionDiscount = commission;
      if (orderOf === 'buyer') {
        remaining = formatPriceInDecimalPoints(discountValue - commission);
      }
    } else {
      remaining = 0;
    }

    commission =
      commission >= commissionDiscount ? commission - commissionDiscount : 0;
    const estimateVat = (commission * settingVat) / 100;
    return {
      calculatedCommissionDiscount: commissionDiscount,
      calculatedCommission: commission,
      calculatedRemaining: remaining,
      calculatedVat: estimateVat,
    };
  }

  async scanProductImages(): Promise<
    [
      boolean,
      {
        result: string | any;
        message: string;
      }
    ]
  > {
    const [pError, pResult] =
      await this.productRepository.getUnverifiedProducts(5);
    if (pError) {
      return [true, { result: null, message: pResult.message }];
    }

    const products: ILegacyProductModel[] = (pResult.result ||
      []) as ILegacyProductModel[];
    const endResult = await Promise.all(
      products.map(async product => {
        // Loop Images Array and call Vision Google API -> get response for each one
        const arrayImages = product.product_images || [];
        let possiblyFraud = false;
        for (let i = 0; i < arrayImages.length; i++) {
          const data = await this.callVisionAPI(arrayImages[i]);
          if (!data || !data.responses) {
            return [
              true,
              { result: null, message: 'Cannot get Vision API response' },
            ];
          }

          const responseVision =
            data.responses[Constants.VISION_API.MAIN_RESPONSE]
              .fullTextAnnotation;

          // Check if the image no have text for vision to detect
          if (responseVision === undefined) continue;
          const examiningText = responseVision.text;
          const arrayPhoneNumberDetected =
            Constants.VISION_API.REGEX_PHONE_NUMBER.exec(examiningText);

          // Check if response string from vision has phone number
          let phoneNumberDetected;
          if (arrayPhoneNumberDetected !== null) {
            phoneNumberDetected =
              arrayPhoneNumberDetected[
                Constants.VISION_API.POSITION_PHONE_EXPECTED
              ];
          }

          // Check if variable have a value
          if (phoneNumberDetected !== undefined) {
            const newFraudProduct = {
              visionResponse: JSON.stringify(responseVision),
              detectText: phoneNumberDetected,
              productId: product.id,
              productImage: arrayImages[i],
            };
            await this.productRepository.createProductFraud(newFraudProduct);

            possiblyFraud = true;
          }
        }

        const result = await this.productRepository.updateLegacyProduct(
          product,
          {
            isFraudDetected: possiblyFraud,
            verified_date: new Date(),
          }
        );

        return result;
      })
    );

    return [
      false,
      { result: endResult, message: Constants.MESSAGE.IDENTIFY_IMAGES_SUCCESS },
    ];
  }

  postVisionRequest = async (body: any) => {
    return axios
      .post(
        `https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_GOOGLE}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(({ data }) => data)
      .catch(error => console.log(error));
  };

  async callVisionAPI(image: string) {
    try {
      const requestBody = {
        requests: [
          {
            image: {
              source: {
                imageUri: image,
              },
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1,
              },
            ],
          },
        ],
      };

      return this.postVisionRequest(requestBody);
    } catch (error) {
      throw new Error('Fail to call vision API');
    }
  }

  async getExploreProducts(page: number, size: number) {
    try {
      const [err, data] = await this.productRepository.getProductsForExplore(
        page,
        size
      );
      const [errCommission, dataCommission] =
        await this.settingRepository.getSettingByKey(
          'buyer_commission_percentage'
        );
      const [errVat, dataVat] = await this.settingRepository.getSettingByKey(
        'vat_percentage'
      );
      if (err || errCommission || errVat) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey =
          Constants.ERROR_MAP.FAILED_TO_GET_EXPLORE_PRODUCTS;
        throw this.error;
      }

      const { docs, hasNextPage, totalDocs } =
        data.result as PaginationDto<ILegacyProductModel>;
      const exploreProductsDto = this.mapProductsToExploreProductsDto(
        docs as any[],
        (dataCommission as any).value,
        (dataVat as any).value
      );

      return {
        docs: exploreProductsDto || [],
        hasNextPage,
        totalDocs,
      } as PaginationDto<ExploreProductDto>;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_EXPLORE_PRODUCTS,
          exception.message
        );
    }
  }
  async createDraftProduct(
    createProductDto: LegacyProductInput,
    userId: string
  ) {
    try {
      await this.validateProduct(createProductDto);
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
          'seller_commission_percentage',
          'vat_percentage',
          'apply_delivery_fee_mpps',
          'apply_delivery_fee_spps',
          'price_quality_extra_commission',
          'shipping_charge_percentage',
        ]);
      if (errSettings) throw new Error('settings was not found');
      const settings: { [key: string]: any } = (
        sysSettings as SettingDocument[]
      ).reduce(
        (prev, current) => ({
          ...prev,
          [current.name]: getParsedValue(current.value, current.type),
        }),
        {}
      );
      createProductDto.billingSettings = {
        buyer_commission_percentage: settings.buyer_commission_percentage,
        seller_commission_percentage: settings.seller_commission_percentage,
        shipping_charge_percentage: settings.shipping_charge_percentage,
        vat_percentage: settings.vat_percentage,
        referral_discount_type: settings.referral_discount_type,
        referral_percentage: settings.referral_percentage,
        referral_fixed_amount: settings.referral_fixed_amount,
        delivery_threshold: settings.delivery_threshold,
        apply_delivery_fee: settings.apply_delivery_fee,
        delivery_fee: settings.delivery_fee,
        price_quality_extra_commission: 0,
      };

      const [err, data] = await this.productRepository.createDraftProduct(
        createProductDto,
        userId
      );
      return [err, data.result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAIL_TO_CREATE_DRAFT_PRODUCT
        );
    }
  }
  async validateProduct(createProductDto: LegacyProductInput) {
    try {
      await this.checkExistence(
        createProductDto.category_id,
        this.categoryRepository,
        Constants.ERROR_MAP.CATEGORY_ID_NOT_FOUND
      );
      await this.checkExistence(
        createProductDto.brand_id,
        this.brandRepository,
        Constants.ERROR_MAP.BRAND_ID_NOT_FOUND
      );
      await this.checkExistence(
        createProductDto.model_id,
        this.modelRepository,
        Constants.ERROR_MAP.MODEL_ID_NOT_FOUND
      );
      await this.checkExistence(
        createProductDto.varient_id,
        this.variantRepository,
        Constants.ERROR_MAP.FAILED_TO_GET_VARIANT
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY
        );
      }
    }
  }

  async checkExistence(
    id: string,
    baseRepository: BaseRepository,
    errorKey: string
  ): Promise<boolean> {
    const errorResponseDto: ErrorResponseDto = new ErrorResponseDto(
      Constants.ERROR_CODE.BAD_REQUEST,
      (this.error.errorType = Constants.ERROR_TYPE.API),
      ''
    );
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      errorResponseDto.errorKey = Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS;
      throw errorResponseDto;
    }
    const [err, data] = await baseRepository.getById(id);
    if (err || !data) {
      errorResponseDto.errorKey = errorKey;
      throw errorResponseDto;
    }
    return true;
  }
  async createProduct(createProductDto: LegacyProductInput, userId: string) {
    try {
      await this.validateProduct(createProductDto);
      const [errProdData, prodData] =
        await this.productRepository.getLatestProduct(userId);
      if (errProdData) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          prodData.result.toString(),
          prodData.message
        );
      }
      const latestProd = prodData.result as ILegacyProductModel;
      if (
        latestProd &&
        new Date().getTime() - latestProd.createdDate.getTime() < 10 * 1000
      ) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.INVALID_LISTING_INTERVAL_PRODUCT
        );
      }
      const [, userDoc] = await this.userRepository.getUserAddress(
        userId,
        '_id address addresses isKeySeller'
      );
      const user = userDoc.result as UserLegacyDocument;
      if ((user.addresses || []).length == 0 && !user.address) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.PICK_UP_ADDRESS_NOT_FOUND,
          'Failed to get the pickup address'
        );
      }
      const [errVariantRes, variantRes] = await this.variantRepository.getById(
        createProductDto.varient_id
      );
      if (errVariantRes) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          variantRes.result.toString(),
          variantRes.message
        );
      }
      const variantModel = variantRes.result as VariantDocument;

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
          'seller_commission_percentage',
          'vat_percentage',
          'apply_delivery_fee_mpps',
          'apply_delivery_fee_spps',
          'price_quality_extra_commission',
          'shipping_charge_percentage',
        ]);
      if (errSettings) throw new Error('settings was not found');

      const commissionSummaries = await this.calculateSummaryCommission({
        product: {
          id: null,
          sellPrice: createProductDto.sell_price,
          modelId: createProductDto.model_id,
          varientId: createProductDto.varient_id,
          grade: createProductDto.grade,
          categoryId: createProductDto.category_id,
          conditionId: createProductDto.condition_id,
        },
        promoCode: null,
        sellerId: userId,
        isCommissionForBuyer: true,
        source: null,
        sysSettings,
        reservation: null,
      });
      const commissionSummary = commissionSummaries[0]?.withoutPromo;
      if (Number(commissionSummary.grandTotal) >= variantModel.current_price) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.LISTING_PRODUCT_HAS_ERROR_PRICE
        );
      }
      createProductDto.billingSettings = {
        buyer_commission_percentage: sysSettings.buyer_commission_percentage,
        seller_commission_percentage: 0,
        shipping_charge_percentage: sysSettings.shipping_charge_percentage,
        vat_percentage: sysSettings.vat_percentage,
        referral_discount_type: sysSettings.referral_discount_type,
        referral_percentage: sysSettings.referral_percentage,
        referral_fixed_amount: sysSettings.referral_fixed_amount,
        delivery_threshold: sysSettings.delivery_threshold,
        apply_delivery_fee: sysSettings.apply_delivery_fee,
        delivery_fee: sysSettings.delivery_fee,
        price_quality_extra_commission: 0,
      };
      // get bid settings
      const bidSettings = await GetBidSettings('bidSettings');
      if (
        bidSettings &&
        createProductDto.start_bid > 0 &&
        createProductDto.isBiddingProduct
      ) {
        createProductDto.billingSettings.activate_bidding = bidSettings.value;
        createProductDto.billingSettings.available_payment_bidding =
          bidSettings.availablePayment;
        createProductDto.billingSettings.config_bid_settings =
          bidSettings.config;
        createProductDto.billingSettings.start_bid = createProductDto.start_bid;
      }

      // createProductDto.recommended_price = 0; // will check with meshal
      const [err, data] = await this.productRepository.createProduct(
        createProductDto,
        userId
      );
      const newProdId = (data.result as ILegacyProductModel)._id;
      await this.createSummaryCommission({
        product: {
          id: newProdId?.toString(),
          sellPrice: createProductDto.sell_price,
          modelId: createProductDto.model_id,
          varientId: createProductDto.varient_id,
          grade: createProductDto.grade,
          categoryId: createProductDto.category_id,
          conditionId: createProductDto.condition_id,
        },
        promoCode: null,
        sellerId: userId,
        isCommissionForBuyer: true,
        source: null,
        sysSettings,
        paymentId: null,
      });
      await this.addPriceNudgingHistory(
        newProdId,
        createProductDto.recommended_price
      );

      await this.searchService.addProducts([newProdId]);

      return [err, data.result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAIL_TO_CREATE_PRODUCT,
          exception.message
        );
      }
    }
  }

  async createProductForRevamp(
    createProductDto: LegacyProductInput,
    userId: string
  ) {
    try {
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
          'seller_commission_percentage',
          'vat_percentage',
          'apply_delivery_fee_mpps',
          'apply_delivery_fee_spps',
          'price_quality_extra_commission',
          'shipping_charge_percentage',
          'delay_listing_time',
          'listing_disable_time',
        ]);
      if (errSettings) throw new Error('settings was not found');
      createProductDto.billingSettings = {
        buyer_commission_percentage: sysSettings.buyer_commission_percentage,
        seller_commission_percentage: 0,
        shipping_charge_percentage: sysSettings.shipping_charge_percentage,
        vat_percentage: sysSettings.vat_percentage,
        referral_discount_type: sysSettings.referral_discount_type,
        referral_percentage: sysSettings.referral_percentage,
        referral_fixed_amount: sysSettings.referral_fixed_amount,
        delivery_threshold: sysSettings.delivery_threshold,
        apply_delivery_fee: sysSettings.apply_delivery_fee,
        delivery_fee: sysSettings.delivery_fee,
        price_quality_extra_commission: 0,
      };
      const auto_approve_at = new Date();
      if (
        sysSettings.delay_listing_time &&
        sysSettings.delay_listing_time > 0
      ) {
        createProductDto.auto_approve_at = new Date(
          auto_approve_at.getTime() + sysSettings.delay_listing_time * 60 * 1000
        );
      }

      createProductDto.expiryAfterInDays =
        sysSettings?.listing_disable_time > 0
          ? sysSettings.listing_disable_time
          : Constants.product.DEFAULT_EXPIRY_LISTING_DAYS;

      // get bid settings
      const bidSettings = await GetBidSettings('bidSettings');
      if (
        bidSettings &&
        createProductDto.start_bid > 0 &&
        createProductDto.isBiddingProduct
      ) {
        createProductDto.billingSettings.activate_bidding = bidSettings.value;
        createProductDto.billingSettings.available_payment_bidding =
          bidSettings.availablePayment;
        createProductDto.billingSettings.config_bid_settings =
          bidSettings.config;
        createProductDto.billingSettings.start_bid = createProductDto.start_bid;
      }
      // createProductDto.recommended_price = 0; // will check with meshal
      const [err, data] = await this.productRepository.createProduct(
        createProductDto,
        userId
      );
      return [err, data.result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAIL_TO_CREATE_PRODUCT,
          exception.message
        );
      }
    }
  }
  getRecommendedPrice(
    createProductDto: LegacyProductInput,
    variantData: ConditionDocument,
    nudgeSetting: boolean
  ) {
    let recommendPrice = 0;
    switch (createProductDto.grade) {
      case PriceNudgeCondition.LIKE_NEW:
        recommendPrice = Number(
          nudgeSetting
            ? variantData?.priceRange?.like_new_min_excellent_price_nudge
            : variantData?.priceRange?.like_new_min_excellent
        );
        break;
      case PriceNudgeCondition.LIGHTLY_USED:
      case PriceNudgeCondition.LIGHT_USE:
        recommendPrice = Number(
          nudgeSetting
            ? variantData?.priceRange?.lightly_used_min_excellent_price_nudge
            : variantData?.priceRange?.lightly_used_min_excellent
        );
        break;
      case PriceNudgeCondition.FAIR:
        recommendPrice = Number(
          nudgeSetting
            ? variantData?.priceRange?.good_condition_min_excellent_price_nudge
            : variantData?.priceRange?.good_condition_min_excellent
        );
        break;
      case PriceNudgeCondition.EXTENSIVE_USE:
        recommendPrice = Number(
          nudgeSetting
            ? variantData?.priceRange
                ?.extensively_used_min_excellent_price_nudge
            : variantData?.priceRange?.extensively_used_min_excellent
        );
        break;
      default:
        break;
    }
    return recommendPrice;
  }
  async updateProduct(
    id: any,
    req: any
  ): Promise<[boolean, { result: any; message?: string }]> {
    try {
      let seller = req.user;
      if (req.sellerId) {
        seller = await this.userRepository.getUserById(req.sellerId);
      }
      if (!seller) {
        this.error.errorCode = Constants.ERROR_CODE.UNAUTHORIZED;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.UNAUTHORIZED_USER;
        throw this.error;
      }

      const [updateError, updateResult] =
        await this.productRepository.updateProduct(id, req);

      if (!updateError) {
        const result = await this.updatePriceProduct(
          {
            product_id: id,
            sell_price: req.sell_price,
            bid_price: req.start_bid,
            user_id: req.sellerId,
          },
          false
        );
        // Sync Typesense
        await this.searchService.addProducts([id]);

        return [false, { result: result }];
      }

      return [updateError, updateResult];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
        exception.message
      );
    }
  }

  async getProductWithPagination(request: any) {
    try {
      const size = !request.query.size ? 5 : +request.query.size;
      const page = !request.query.page ? 1 : +request.query.page;
      const [error, products] =
        await this.productRepository.getProductWithPagination(size, page);
      const { total, pages } = await this.productRepository.getNumberOfPages(
        size
      );
      const result = Object.assign(
        {},
        { info: { total, pages }, results: products }
      );
      return [error, result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION
      );
    }
  }

  async getDetailProduct(
    id: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const [err, productRes] = await this.productRepository.getDetailProduct(
        id
      );
      if (err) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          productRes.result.toString(),
          productRes.message
        );
      }
      const product = productRes.result;
      const [, variantRes] = await this.variantRepository.getById(
        product.varient_id
      );
      const variant = variantRes.result as VariantDocument;
      const attributesArr = (product.attributes || []).map((item: any) => {
        return item.toString();
      });
      const attributes = await this.mappingAttributeFromLinkVariant(
        variant.attributes,
        attributesArr
      );

      const data = {
        ...product,
        attributes: attributes,
      } as LegacyProductType;
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DETAIL_PRODUCT,
          exception.message
        );
      }
    }
  }
  async getProductWithFiltering(filter: any) {
    try {
      return await this.productRepository.getProductWithFiltering(filter);
    } catch (error) {
      if (error instanceof ErrorResponseDto) throw error;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAIL_TO_FILTERING_PRODUCT
      );
    }
  }

  async getProducts(productIds: string[]) {
    try {
      return await this.productRepository.getProducts(productIds);
    } catch (error) {
      if (error instanceof ErrorResponseDto) throw error;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAIL_TO_FILTERING_PRODUCT
      );
    }
  }

  async getWishList(user_id: string) {
    try {
      return await this.productRepository.getWishList(user_id);
    } catch (error) {
      if (error instanceof ErrorResponseDto) throw error;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_WISH_LIST
      );
    }
  }

  async addAskSeller(
    questionerId: string,
    product_id: string,
    question: string,
    sellerID?: string
  ) {
    try {
      const [error, data] = await this.productRepository.addAskSeller(
        questionerId,
        product_id,
        question,
        sellerID
      );

      const productData = await this.getPreviewProductById(
        product_id,
        questionerId
      );

      !error &&
        (await this.activityRepository.createActivity(
          [productData.result?.seller_id],
          product_id,
          'AskQuestion',
          (data as any)._id
        ));

      !error &&
        (await this.subscriptionRepository.createSubscription(
          [productData.result?.seller_id],
          product_id,
          'AskQuestion',
          (data as any)._id
        ));

      !error && (await this.pushSellerNudgeNotification(sellerID));

      return [error, data];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_ADD_ASK_SELLER,
        exception.message
      );
    }
  }

  async pushSellerNudgeNotification(sellerId: string) {
    try {
      const defaultSettingValue = 3;
      const numberOfAnswerQuestions = await this.getNumberOfUnAnsweredAskSeller(
        sellerId
      );
      const [
        pendingUnAnsweredSppQuestionsError,
        pendingUnAnsweredSppQuestions,
      ] = await this.settingRepository.getSettingByKey(
        'pending_unanswered_spp_questions'
      );
      const [settingError, setting] =
        await this.settingRepository.getSettingByKey(
          'min_pending_spp_questions'
        );
      const settingValue = settingError ? defaultSettingValue : setting.value;
      const sendPendingUnAnsweredSppQuestionsMessage =
        pendingUnAnsweredSppQuestionsError
          ? false
          : pendingUnAnsweredSppQuestions.value;
      const { userType } = await this.getSellerUserType(sellerId);
      if (
        sendPendingUnAnsweredSppQuestionsMessage &&
        numberOfAnswerQuestions >= settingValue &&
        userType === SellerUserType.INDIVIDUAL_SELLER
      ) {
        const seller = await this.userRepository.getUserById(sellerId);
        if (!seller.sellerReceivedNudgeNotification) {
          await this.freshchatService.sendOutboundMsg({
            templateName: process.env.FRESHCHAT_SELLER_SPP_PENDING_QUESTIONS,
            phoneNumber: `+${seller.countryCode}${seller.mobileNumber}`,
            userId: sellerId,
            numberOfPendingQuestions: numberOfAnswerQuestions,
          });

          await this.userRepository.updateAskSellerNotificationNudgeReceived(
            sellerId,
            true
          );
        }
      }
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_ADD_ASK_SELLER,
        exception.message
      );
    }
  }

  async updateAskSeller(questionId: string, product_id: string, data: any) {
    try {
      const [error, answerData] = await this.productRepository.updateAskSeller(
        questionId,
        product_id,
        data
      );

      !error &&
        (await this.activityRepository.createActivity(
          [answerData?.questioner_id],
          product_id,
          'AnswerQuestion',
          questionId
        ));

      !error &&
        (await this.subscriptionRepository.createSubscription(
          [answerData?.questioner_id],
          product_id,
          'AnswerQuestion',
          questionId
        ));
      const numberOfUnAnsweredQuestions =
        await this.getNumberOfUnAnsweredAskSeller(answerData.seller_id);
      if (!error && numberOfUnAnsweredQuestions === 0) {
        await this.userRepository.updateAskSellerNotificationNudgeReceived(
          answerData.seller_id,
          false
        );
      }

      return [error, answerData];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_ASK_SELLER,
        exception.message
      );
    }
  }

  async getNumberOfUnAnsweredAskSeller(sellerId: string) {
    return await this.askSellerService.countPendingQuestionByUserID(sellerId);
  }
  async getAskSeller(productId: string, isSeller: boolean) {
    try {
      return await this.productRepository.getAskSeller(productId, isSeller);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_ADD_ASK_SELLER,
        exception.message
      );
    }
  }

  async getColors() {
    try {
      return await this.colorRepository.getColors();
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_COLOR,
        exception.message
      );
    }
  }

  async getQuestionAnswer(productId: string) {
    try {
      const [err, data] = await this.productRepository.getQuestionAnswerProduct(
        productId
      );
      if (err) {
        return [err, data];
      }
      const product = data.result;
      const questions: ProductQuestion = {
        product_questions: JSON.parse(
          product.answer_to_questions_migration || '[]'
        ),
        product_questions_ar: JSON.parse(
          product.answer_to_questions_ar_migration || '[]'
        ),
      };
      return [false, questions];
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_QUESTION,
        exception.message
      );
    }
  }

  async getProductDetails(productIds: string[]) {
    try {
      const [error, response] = await this.productRepository.getProductDetails(
        productIds
      );
      if (error) {
        return [error, response];
      }
      return [false, response.result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
          exception.message
        );
      }
    }
  }
  async getMySellProductsBySubmodule(
    userId: string,
    submodule: string,
    productIds: string[],
    size: number,
    page: number,
    sort?: string
  ) {
    try {
      let isExpired = false;
      if (submodule === 'idle') {
        isExpired = true;
      } else if (submodule === 'active') {
        isExpired = false;
      } else {
        if (productIds?.length === 0) {
          return [false, null];
        }
      }
      const [error, response] =
        await this.productRepository.getMySellProductsBySubmodule(
          userId,
          productIds,
          size,
          page,
          isExpired,
          sort
        );
      if (error) {
        return [error, response];
      }
      let result = response.result[0].data;
      if (result.length === 0) {
        return [false, null];
      }
      if (isExpired === false) {
        result = result.filter(
          (value: any, index: any, self: any) =>
            index ===
            self.findIndex(
              (t: any) => t?._id?.toString() === value?._id?.toString()
            )
        );
        await Promise.all(
          result.map(async (listing: any) => {
            const condition = await getProductCondition({
              id: listing.condition_id,
              variantId: listing.varient_id._id,
              sellPrice: listing.sell_price,
            } as GetProductCatConRequest);
            listing.priceRange = condition?.priceQuality?.name || null;
          })
        );
      }
      return [false, result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
          exception.message
        );
      }
    }
  }

  async getMySellProducts(
    userId: string,
    size: number,
    page: number,
    sort?: string
  ) {
    try {
      const [error, response] = await this.productRepository.getMySellProducts(
        userId,
        size,
        page,
        false,
        sort
      );
      if (error) {
        return [error, response];
      }
      let result = response.result[0].data;
      if (result.length === 0) {
        return [false, null];
      }

      result = result.filter(
        (value: any, index: any, self: any) =>
          index ===
          self.findIndex(
            (t: any) => t?._id?.toString() === value?._id?.toString()
          )
      );
      const total = result.length;
      const pages = Math.ceil(total / size);
      await Promise.all(
        result.map(async (listing: any) => {
          const condition = await getProductCondition({
            id: listing.condition_id,
            variantId: listing.varient_id._id,
            sellPrice: listing.sell_price,
          } as GetProductCatConRequest);
          listing.priceRange = condition?.priceQuality?.name || null;
        })
      );

      const data = {
        productList: result,
        pagination: { total, pages },
        totalProducts: response?.result[0]?.pagination[0]?.total || 0,
      };
      return [false, data];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
          exception.message
        );
      }
    }
  }

  async getMyExpiredProducts(
    userId: string,
    size: number,
    page: number
  ): Promise<[boolean, any]> {
    try {
      const [error, response] = await this.productRepository.getMySellProducts(
        userId,
        size,
        page,
        true
      );
      if (error) {
        return [error, response.result];
      }
      const result = response?.result[0]?.data;

      const total = response?.result[0]?.metadata[0]?.total || 0;
      const pages = Math.ceil(total / size) || 0;

      const data = {
        productList: result,
        pagination: { total, pages },
        totalProducts: response?.result[0]?.pagination[0]?.total || 0,
      };

      return [false, data];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
          exception.message
        );
      }
    }
  }

  async getBidsMyProducts(
    userId: string,
    size: number,
    page: number,
    language: string
  ): Promise<[boolean, any]> {
    try {
      const [error, response] =
        await this.productRepository.getBidsInMySellProducts(userId);
      if (error) {
        return [error, response.result];
      }
      let result = response.result;
      if (result.length === 0) {
        return [false, []];
      }
      result.map((item: LegacyProductType) => {
        item.bidding = item.bidding.filter(
          (bid: BiddingProductDto) =>
            bid.bid_status !== 'rejected' && bid.bid_status !== 'accepted'
        ) as any;
        if (language == 'ar' && item) {
          item.category.category_name = item.category.category_name_ar;
          item.brand.brand_name = item.brand.brand_name_ar;
          item.model.model_name = item.model.model_name_ar;
        }
      });
      result = result.filter(
        (item: LegacyProductType) => item.bidding.length > 0
      );
      return [false, result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
          exception.message
        );
      }
    }
  }
  async validateListingPreCondition(
    userId: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    const [pError, pResult] = await this.productRepository.getProductsOfUser(
      userId,
      '_id user_id status sell_status createdDate'
    );
    if (!pError && pResult.result?.length) {
      const lastProduct = pResult.result[0];
      const diff = Date.now() - lastProduct.createdDate.getTime();
      if (diff < 10 * 1000) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: {
              rules: [
                {
                  listingInterval: '10 seconds',
                  status: 'failed',
                },
              ],
            },
            message: Constants.MESSAGE.FAILED_LISTING_CONDITION,
          },
        ];
      }
    }

    const [, cResult] = await this.categoryRepository.getAllCategory();

    return [
      false,
      {
        code: Constants.SUCCESS_CODE.SUCCESS,
        result: {
          products: pResult.result,
          categories: cResult.result,
          rules: [
            {
              listingInterval: '10 seconds',
              status: 'passed',
            },
          ],
        },
        message: Constants.MESSAGE.PASSED_LISTING_CONDITION,
      },
    ];
  }

  validateStateBidProduct(product: LeanDocument<ILegacyProductModel>) {
    try {
      const expiredDate = product.expiryDate;
      if (moment().isAfter(expiredDate)) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey =
          Constants.ERROR_MAP.FAILED_TO_EDIT_EXPIRED_PRODUCT;
        throw this.error;
      }
      const productState = product.sell_status;
      if (productState === Constants.product.STATUS.SOLD) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_EDIT_SOLD_PRODUCT;
        throw this.error;
      }

      const bidding = product.bidding || [];
      if (bidding.length > 0) {
        const activeBidding = bidding.find(
          bid => bid.bid_status === Constants.BID_STATUS.ACTIVE
        );
        if (activeBidding) {
          this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey =
            Constants.ERROR_MAP.FAILED_TO_EDIT_PRODUCT_HAS_ACTIVE_BID;
          throw this.error;
        }
        const acceptedBidding = bidding.find(
          bid => bid.bid_status === Constants.BID_STATUS.ACCEPTED
        );
        if (acceptedBidding) {
          this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey =
            Constants.ERROR_MAP.FAILED_TO_EDIT_PRODUCT_HAS_ACCEPTED_BID;
          throw this.error;
        }
      }
      return true;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_VALIDATE_STATE_BID_PRODUCT,
          exception.message
        );
      }
    }
  }

  async sendRejectedBidSMSToBidder(
    bid: any,
    user: UserLegacyDocument,
    product: LeanDocument<ILegacyProductModel>
  ) {
    try {
      const message_en =
        `Dear ${user.name} your bid for product ${product.model_id.model_name} ${product.varient}` +
        `at ${bid.bid_price} is not suitable for the seller, the seller is still looking for a higher offer.`;
      const message_ar =
        `سومتك للمنتج ${product.model_id.model_name_ar} ${product.varient_ar} ` +
        `بالسعر ${bid.bid_price} غير مناسبة للبائع، مازال البائع يبحث عن عرض اعلى.`;

      const lang = user.language ? user.language : 'ar';
      let msg = lang === 'ar' ? message_ar : message_en;
      const receiver = user.countryCode + user.mobileNumber;

      msg = encodeURI(msg);
      return await sendSMSViaUnifonic(receiver, msg);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_SEND_SMS_TO_BIDDER,
          exception.message
        );
      }
    }
  }

  async insertAdminLog(
    currentPrice: number,
    newPrice: number,
    editorName: string,
    userId: string,
    productId: string,
    logType: string
  ) {
    try {
      const regionConf = await this.settingService.getRegionConfigs();
      if (currentPrice != newPrice) {
        const priceLog =
          logType === 'sell-price'
            ? `${editorName} has changed Buy Now Price ` +
              `from ${currentPrice} ${regionConf.currency} to ${newPrice} ${
                regionConf.currency
              } at ${moment().format('DD/MM/YYYY hh:mm:ss A')}`
            : `${editorName} has changed Bid Price ` +
              `from ${currentPrice} ${regionConf.currency} to ${newPrice} ${
                regionConf.currency
              } at ${moment().format('DD/MM/YYYY hh:mm:ss A')}`;
        const [errBuyLog, dataLog] = await this.adminLogRepository.createLog(
          userId,
          productId,
          priceLog
        );
        if (errBuyLog) {
          this.error.errorCode = dataLog.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = dataLog.result.toString();
          this.error.message = dataLog.message;
          throw this.error;
        }
      }
      return true;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_LOG,
          exception.message
        );
      }
    }
  }

  async notifyToRejectBidBidder(
    bidding: any,
    product: LeanDocument<ILegacyProductModel>
  ) {
    try {
      const productId = product._id;
      const customBidding = bidding.filter(
        (bid: any) => bid.bid_status !== Constants.BID_STATUS.REJECTED
      );
      if (customBidding.length === 0) {
        return true;
      }

      for await (const bid of customBidding) {
        // send sms
        const [errBidder, bidder] = await this.userRepository.getBidder(
          bid.user_id
        );
        if (errBidder) {
          this.error.errorCode = bidder.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = bidder.result.toString();
          this.error.message = bidder.message;
          throw this.error;
        }
        const user = bidder.result as UserLegacyDocument;
        const sendRejectedSMS = await this.sendRejectedBidSMSToBidder(
          bid,
          user,
          product
        );
        if (!sendRejectedSMS) {
          this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = Constants.ERROR_MAP.FAIL_TO_SEND_SMS;
          throw this.error;
        }
        const [errRejectBid, rejectedBidData] =
          await this.productRepository.rejectBid(productId, bid.bid_id);
        if (errRejectBid) {
          this.error.errorCode = rejectedBidData.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = rejectedBidData.result.toString();
          this.error.message = rejectedBidData.message;
          throw this.error;
        }
      }
      const bidIds = customBidding.map((bid: any) => bid.bid_id);
      const [errUpdateBid, updateBidData] =
        await this.bidRepository.updateBidStatus(
          bidIds,
          Constants.BID_STATUS.REJECTED
        );
      if (errUpdateBid) {
        this.error.errorCode = updateBidData.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = updateBidData.result.toString();
        this.error.message = updateBidData.message;
        throw this.error;
      }

      const userIds = customBidding.map((bid: any) => bid.user_id);
      // create activity
      await this.activityRepository.createActivity(
        userIds,
        productId,
        'BuyerBidRejected'
      );
      return true;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_NOTIFY_BIDDER,
          exception.message
        );
      }
    }
  }

  async getMismatchedListings(
    page: number,
    size: number,
    id: string,
    sortByMostRecent: boolean
  ) {
    try {
      const [err, data] = await this.productRepository.getMismatchedListings(
        page,
        size,
        id,
        sortByMostRecent
      );
      if (err) {
        throw err;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DELETED_LISTINGS,
          exception.message
        );
      }
    }
  }

  async getMismatchedListingsReport(): Promise<
    [boolean, { code?: number; result: any; message?: string }]
  > {
    try {
      //  Get all mismatched listings
      const [err, getResult] =
        await this.productRepository.getMismatchedListings(-1, -1, '', false);

      if (err) {
        return await sendMail({
          to: (process.env.SENDGRID_NOTIFIED_USER as string).split(','),
          subject: '[Alert] Daily mismatched listing report - Get Data Failed',
          text: getResult,
        });
      }
      // Create Excel file
      const title = `Mismatched Listings in ${moment().format('D-MMM')}`;
      const [genError, sheetContent] = await generateMismatchReport(
        getResult as any,
        title
      );

      if (genError) {
        return await sendMail({
          to: (process.env.SENDGRID_NOTIFIED_USER as string).split(','),
          subject:
            '[Alert] Daily mismatched listing report - Generated Sheet Failed',
          text: JSON.stringify(sheetContent),
        });
      }
      const sendTo: string =
        process.env.NODE_ENV === 'production'
          ? process.env.SENDGRID_TO_PROD_MISMATCHED
          : process.env.SENDGRID_TO_DEV_MISMATCHED;
      const [sendError, sendingResult] = await sendMail({
        to: sendTo.split(','),
        subject: `[Daily Report] - ${title}`,
        // eslint-disable-next-line max-len
        html: '<p>Dear Soum Admin!</p><p> This is auto generated email for <strong>Mismatched Listings</strong>.</p><p>Thanks in advance</p><p>Tech Team</p>',
        fileName: `mismatched_listing${new Date().toDateString()}.xlsx`,
        fileContent: sheetContent,
      });

      return [
        sendError,
        {
          message: Constants.MESSAGE.EMAIL_SENT,
          result: JSON.stringify(sendingResult),
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_SEND_ORDER_EMAIL,
          exception.message
        );
      }
    }
  }

  async reportProduct(productId: string, reason: string, userId: string) {
    try {
      const [err, data] = await this.productRepository.reportProduct(
        productId,
        reason,
        userId
      );
      if (err) {
        throw err;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REPORT_PRODUCT,
          exception.message
        );
      }
    }
  }

  async getReportedListings(page: number, size: number) {
    try {
      const [err, data] = await this.productRepository.getReportedListings(
        page,
        size
      );
      if (err) {
        throw err;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_REPORTED_LISTINGS,
          exception.message
        );
      }
    }
  }

  async updateBulkListing(
    bulkListingReq: ProductUpdateBulkListingDto
  ): Promise<void> {
    try {
      const listingGroupInput: ListingGroupInput = {
        sell_price: bulkListingReq?.sellPrice,
        product_images: bulkListingReq?.productImages,
      };
      await this.listingGroupRepository.updateListingGroup(
        bulkListingReq.listingGroupId,
        listingGroupInput
      );
      return;
    } catch (error) {
      logger.error(`Failed to updateBulkListing: ${error}`);
      return;
    }
  }

  async updatePriceProduct(
    editPriceInput: EditPriceProductInput,
    byAdmin = true
  ) {
    try {
      const productId = editPriceInput.product_id;
      if (!productId) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND;
        this.error.message = Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND;
        throw this.error;
      }

      const [err, listingResult] =
        await this.productRepository.getEditListingProduct(productId);
      if (err) {
        this.error.errorCode = listingResult.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = listingResult.result.toString();
        this.error.message = listingResult.message;
        throw this.error;
      }

      const product = listingResult.result as LeanDocument<ILegacyProductModel>;
      this.validateStateBidProduct(product);

      // notify to bidders have been rejected
      const bidding = product.bidding || [];
      if (bidding.length > 0) {
        await this.notifyToRejectBidBidder(bidding, product);
      }

      const sellPrice = formatPriceInDecimalPoints(editPriceInput.sell_price);
      const bidPrice = formatPriceInDecimalPoints(editPriceInput.bid_price);
      const [errPr, updatedData] =
        await this.productRepository.updatePriceListing(
          productId,
          sellPrice,
          bidPrice
        );
      if (product?.listingGroupId) {
        await this.updateBulkListing({
          sellPrice: editPriceInput.sell_price,
          listingGroupId: product.listingGroupId?.toString(),
          sellerId: product.user_id,
        } as ProductUpdateBulkListingDto);
      }
      const productSummary = await this.getProductSummaryCommission({
        orderId: null,
        productId: editPriceInput.product_id,
        isBuyer: false,
        isOriginalBreakDown: true,
      });
      if (productSummary) {
        await this.updateSellPriceInCommissionSummary({
          product: {
            id: editPriceInput.product_id,
            categoryId: product.category_id._id.toString(),
            sellPrice: editPriceInput.sell_price,
            modelId: product.model_id._id.toString(),
            varientId: product.varient_id._id.toString(),
            grade: product.grade,
            conditionId: product.condition_id,
          },
        });
      } else {
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
            'seller_commission_percentage',
            'vat_percentage',
            'apply_delivery_fee_mpps',
            'apply_delivery_fee_spps',
            'price_quality_extra_commission',
            'shipping_charge_percentage',
          ]);
        if (errSettings) throw new Error('settings was not found');
        const commissionReqData: any = {
          product: {
            id: editPriceInput.product_id,
            sellPrice: editPriceInput.sell_price,
            modelId: product.model_id._id.toString(),
            varientId: product.varient_id._id.toString(),
            grade: product.grade,
            categoryId: product.category_id._id.toString(),
            conditionId: product.condition_id,
          },
          sellerId: product.user_id.toString(),
          isCommissionForBuyer: false,
          sysSettings,
        };
        await this.createSummaryCommission(commissionReqData);
      }

      if (errPr) {
        this.error.errorCode = updatedData.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = updatedData.toString();
        this.error.message = updatedData.message;
        throw this.error;
      }
      // ims use this method, so no dm user needed.
      if (byAdmin) {
        // get name of author of request to change
        const [errUser, requestUser] =
          await this.deltaMachineAuthenticationRepository.getById(
            editPriceInput.user_id
          );

        if (errUser) {
          this.error.errorCode = requestUser.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = requestUser.result.toString();
          this.error.message = requestUser.message;
          throw this.error;
        }
        const editor = requestUser.result as DeltaMachineUserDocument;

        // insert the change to log
        const currentSellPrice = formatPriceInDecimalPoints(product.sell_price);
        const currentBidPrice = formatPriceInDecimalPoints(product.bid_price);

        await this.insertAdminLog(
          currentSellPrice,
          sellPrice,
          editor.username,
          editPriceInput.user_id,
          productId,
          'sell-price'
        );

        await this.insertAdminLog(
          currentBidPrice,
          bidPrice,
          editor.username,
          editPriceInput.user_id,
          productId,
          'bid-price'
        );
      }

      return [false, updatedData.result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          exception.message
        );
      }
    }
  }

  async getAdminLog(productId: string) {
    try {
      if (!productId) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND;
        throw this.error;
      }
      const [err, logs] = await this.adminLogRepository.getAdminLog(productId);
      if (err) {
        this.error.errorCode = logs.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = logs.result.toString();
        this.error.message = logs.message;
        throw this.error;
      }

      return [false, logs.result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_ADMIN_LOG,
          exception.message
        );
      }
    }
  }

  async mapDetailFeature(
    obj: AttributeDto,
    selectedAttributes: string[]
  ): Promise<AttributeDto> {
    const [, response] = await this.attributeRepository.getById(obj.featureId);
    const attribute = response.result as AttributeDocument;
    obj.nameAr = attribute.attribute_name_ar;
    obj.nameEn = attribute.attribute_name_en;
    obj.options = [];

    for (const option of attribute.options || []) {
      if (selectedAttributes.indexOf(option.id.toString()) > -1) {
        obj.options.push({
          id: option.id,
          nameAr: option.option_name_ar,
          nameEn: option.option_name_en,
        });
      }
      continue;
    }
    return obj;
  }

  async mappingAttributeFromLinkVariant(
    attributeVariants: AttributeVariantDocument[],
    selectedAttributes: string[]
  ): Promise<AttributeDto[]> {
    let data: AttributeDto[] = [];
    if (!attributeVariants || (selectedAttributes || []).length === 0) {
      return data;
    }
    const attributePromise = attributeVariants.map(
      (item: AttributeVariantDocument) => {
        const feature: AttributeDto = {
          featureId: item.feature_id,
          attributeId: item.attribute_id,
        };
        return this.mapDetailFeature(feature, selectedAttributes);
      }
    );

    await Promise.all(attributePromise).then((attributes: AttributeDto[]) => {
      data = attributes;
    });
    return data;
  }
  mapProductsToExploreProductsDto(
    products: any[],
    commissionPercentage: number,
    vatPercentage: number
  ) {
    return products.map((elem: any) => {
      const commission = (commissionPercentage * elem.sell_price) / 100;
      const vat = (vatPercentage * commission) / 100;
      return {
        productId: elem._id,
        modelName: elem.model_id.model_name,
        arModelName: elem.model_id.model_name_ar,
        grandTotal: formatPriceInDecimalPoints(
          elem.sell_price + commission + vat
        ),
        productImage: elem.product_images ? elem.product_images[0] : null,
      } as ExploreProductDto;
    });
  }

  async deleteProduct(productId: string, reason: string) {
    try {
      const [err, data] = await this.productRepository.deleteProduct(
        productId,
        reason
      );
      if (err) {
        throw err;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_DELETE_PRODUCT,
          exception.message
        );
      }
    }
  }

  async getDeletedListings(page: number, size: number) {
    try {
      const [err, data] = await this.productRepository.getDeletedListings(
        page,
        size
      );
      if (err) {
        throw err;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DELETED_LISTINGS,
          exception.message
        );
      }
    }
  }

  async getPendingListings(page: number, size: number, sortBy: string) {
    try {
      const [err, data] = await this.productRepository.getFlaggedListings(
        page,
        size,
        sortBy,
        true
      );
      if (err) {
        throw err;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DELETED_LISTINGS,
          exception.message
        );
      }
    }
  }

  async getProductsFilter(filter: ProductFilterDto) {
    try {
      const [err, data] = await this.productRepository.getProductsFilter(
        filter
      );
      if (err) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey =
          Constants.ERROR_MAP.FAILED_TO_GET_FILTERED_PRODUCTS;
        throw this.error;
      }

      const result = data.result as PaginationDto<ILegacyProductModel>;
      const productsDto = await this.mapProductsToFilteredProductsDto(
        result.docs
      );

      return {
        docs: productsDto,
        hasNextPage: result.hasNextPage,
        totalDocs: result.totalDocs,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MPP_PRODUCTS,
          exception.message
        );
    }
  }

  async mapProductsToFilteredProductsDto(products: ILegacyProductModel[]) {
    const filteredProducts = await Promise.all(
      products.map(async (elem: any) => {
        const productData: ProductListData = await this.productListData(elem);
        if (!_isEmpty(productData)) {
          const result = {
            productId: elem._id,
            grade: elem.grade,
            arGrade: elem.arGrade,
            modelId: elem.modelId,
            modelName: elem.modelName,
            arModelName: elem.arModelName,
            variantName: elem.variantName,
            arVariantName: elem.arVariantName,
            originalPrice: elem.originalPrice,
            sellPrice: elem.sellPrice,
            productImage: elem.productImages ? elem.productImages[0] : null,
            sellerId: elem.sellerId,
            createdDate: elem.createdDate,
            tags: productData.tags,
            attributes: this.mapAttributesDto(productData.variant?.attributes),
            isGreatDeal: elem.conditions
              ? isGreatDeal(elem.grade, elem.sellPrice, elem.conditions)
              : false,
            model_image: elem.modelImage,
            isMerchant: elem.isMerchant,
            listingQuantity: elem.listingQuantity,
            product_images: elem.productImages,
          } as FilteredProductsDto;
          if (
            elem?.isBiddingProduct &&
            elem?.billingSettings?.activate_bidding
          ) {
            result.activate_bidding = elem?.billingSettings?.activate_bidding;
            result.start_bid = elem?.billingSettings?.start_bid;
            result.highest_bid = elem?.billingSettings?.highest_bid || 0;
          }
          return result;
        }
      })
    );
    return filteredProducts;
  }
  async autoApproveProduct() {
    try {
      const [, sysSettings] = await this.settingService.getSettingsObjectByKeys(
        ['exclude_from_auto_approve']
      );
      const excludedCategories = sysSettings?.exclude_from_auto_approve
        ? sysSettings.exclude_from_auto_approve.split(',')
        : [];

      const [err, data] = await this.productRepository.autoApproveProduct(
        excludedCategories
      );
      if (err) {
        throw err;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_AUTO_APPROVE_PRODUCT,
          exception.message
        );
      }
    }
  }
  // @depricated
  async approveProduct(productId: string, status: boolean) {
    try {
      const [err, data] = await this.productRepository.approveProduct(
        productId,
        status,
        new Date()
      );
      if (err) {
        throw err;
      }

      if (status === false) return data;

      await this.deltaMachineService.sendFirstPublishOutboundMsg(productId);
      const [, productData] = await this.productRepository.getDetailProduct(
        productId
      );
      const sellerPhone =
        '+' +
        productData?.result?.seller_country_code +
        productData?.result?.seller_phone;
      await this.deltaMachineService.createSellerDeletionNudgeJob(
        productId,
        sellerPhone,
        true
      );
      await this.deltaMachineService.createSellerEngagementJob(
        productId,
        sellerPhone
      );
      // Re-calculate the rates
      await this.userRepository.updateRatesScan(
        productData?.result?.seller_id?.toString(),
        false
      );

      const condition = await getProductCondition({
        id: productData?.result?.condition_id,
        variantId: productData?.result?.varient_id,
        sellPrice: productData?.result?.sell_price,
      } as GetProductCatConRequest);
      const priceRange = condition?.priceQuality?.name || null;
      let webEngageData = {
        'Seller ID': productData?.result?.seller_id?.toString(),
        'Seller Name': productData?.result?.seller_name,
        'Model Name': productData?.result?.models?.model_name,
        Variants: productData?.result?.varients?.varient,
        'Product ID': productId,
        'Created Time': productData?.result?.createdDate,
        'Sell Price': productData?.result?.sell_price,
        'Category Name': productData?.result?.category?.category_name,
        'Brand Name': productData?.result?.brands?.brand_name,
        'Listing Condition': productData?.result?.grade,
        'Price Segment': priceRange,
        'Approval Source': 'Admin - Frontliner',
        'Listing type': productData?.result?.isBiddingProduct
          ? 'Bid'
          : 'Direct',
      };
      if (productData?.result?.isBiddingProduct) {
        webEngageData = {
          ...webEngageData,
          ...{ 'Start Bid': productData?.result?.billingSettings?.start_bid },
        };
      }

      const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
      await sendEventData(
        productData?.result?.seller_id?.toString() || 'Dave ID',
        'Listing got published',
        dateFormat,
        webEngageData
      );

      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_APPROVE_PRODUCT,
          exception.message
        );
      }
    }
  }
  async getOnHoldListings(page: number, size: number) {
    try {
      const [err, data] = await this.productRepository.getOnHoldListings(
        page,
        size
      );
      if (err) {
        throw err;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_ON_HOLD_LISTINGS,
          exception.message
        );
      }
    }
  }

  async getProductCalculationSummary(
    GetProductSummaryInputDto: GetProductSummaryInputDto
  ) {
    try {
      const [errProd, productResult] =
        await this.productRepository.getProductById(
          GetProductSummaryInputDto.productId
        );
      if (errProd) throw new Error(Constants.MESSAGE.PRODUCT_GET_NOT_FOUND);

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
          'categories_with_reservation',
          'enable_reservation',
          'enable_financing',
          'categories_with_financing',
        ]);
      if (errSettings) throw new Error('settings was not found');

      let promoCode = null;
      // can be optimized
      if (GetProductSummaryInputDto.promoCode) {
        promoCode = await getPromoCodeDetails({
          filterField: 'code',
          filterFieldValue: GetProductSummaryInputDto.promoCode,
        });
      } else if (GetProductSummaryInputDto.applyDefaultPromo) {
        promoCode = await getDefaultPromoCode();
      }

      const product: ILegacyProductModel =
        productResult.result as ILegacyProductModel;

      let reservation = null;
      if (sysSettings.enable_reservation) {
        const reservationForCategory = (
          JSON.parse(sysSettings.categories_with_reservation) || []
        ).find(
          (elem: any) => elem.categoryId == product.category_id.toString()
        );
        reservation = reservationForCategory
          ? ({
              reservationAmount: reservationForCategory.amount,
            } as ReservationSummary)
          : null;

        if (reservation) promoCode = null;
      }

      let financingRequest = null;
      if (sysSettings.enable_financing) {
        const financingForCategory = (
          JSON.parse(sysSettings.categories_with_financing) || []
        ).find(
          (elem: any) => elem.categoryId == product.category_id.toString()
        );
        financingRequest = financingForCategory
          ? {
              amount: financingForCategory.amount,
            }
          : null;
      }
      let paymentModuleName = GetProductSummaryInputDto.paymentModule;

      if (!paymentModuleName) {
        paymentModuleName = reservation
          ? PaymentModuleName.RESERVATION
          : PaymentModuleName.GENERAL_ORDER;
      }
      const commissionSummaries = await this.calculateSummaryCommission({
        product: {
          id: product._id.toString(),
          sellPrice: product.sell_price,
          modelId: product.model_id,
          varientId: product.varient_id,
          grade: product.grade,
          categoryId: product.category_id,
          conditionId: product.condition_id,
        },
        promoCode: promoCode || null,
        sellerId: product.user_id,
        isCommissionForBuyer: true,
        source: null,
        sysSettings,
        allPayments: GetProductSummaryInputDto.allPayments,
        paymentModuleName: paymentModuleName,
        reservation: reservation,
        financingRequest: financingRequest,
      });
      const promoCodeSummary = promoCode
        ? ({
            id: promoCode?.id || null,
            code: promoCode?.code || null,
            availablePayments: promoCode?.availablePayment,
            isDefault: promoCode?.isDefault,
          } as promoCodeSummary)
        : null;
      if (!GetProductSummaryInputDto.allPayments) {
        return {
          ...this.mapCommissionSummary(commissionSummaries[0]),
          promoCode: promoCodeSummary,
        };
      }
      const commissionsObject: any = {};
      for (const elem of commissionSummaries) {
        commissionsObject[elem.withoutPromo.paymentId] = {
          ...this.mapCommissionSummary(elem),
          promoCode: promoCodeSummary,
        } as ProductCalculationSummaryDto;
      }
      return { ...commissionsObject, promoCode: promoCodeSummary };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CALCULATE_PRODUCT,
          exception.message
        );
      }
    }
  }
  mapCommissionSummary(commissionSummary: BreakDownResponse) {
    const { withPromo, withoutPromo } = commissionSummary;
    const productPriceSummary = {
      itemSellPrice: withoutPromo.sellPrice,
      commission: withoutPromo.commission,
      vat: withoutPromo.totalVat,
      shipping: withoutPromo.deliveryFee,
      grandTotal: withoutPromo.grandTotal,
      commissionAnalysis: withoutPromo.commissionAnalysis || {},
      reservation: withoutPromo.reservation,
      financingRequest: withoutPromo.financingRequest,
      paymentCardType: withoutPromo.paymentCardType,
    } as ProductSPriceSummary;
    const productPriceDiscountSummary = withPromo
      ? ({
          itemSellPrice: withPromo?.sellPrice,
          commission: withPromo?.commission,
          vat:
            Number(withPromo?.commissionVat) + Number(withPromo.deliveryFeeVat),
          shipping: withPromo?.deliveryFee,
          grandTotal: withPromo?.grandTotal,
          discountValue: withPromo.discount,
          totalDiscount:
            Number(withoutPromo.grandTotal) - Number(withPromo.grandTotal),
          commissionAnalysis: withPromo.commissionAnalysis || {},
          reservation: withPromo.reservation,
          financingRequest: withPromo.financingRequest,
          paymentCardType: withPromo.paymentCardType,
        } as ProductPriceDiscountSummary)
      : null;

    return {
      productPriceSummary,
      productPriceDiscountSummary,
      downPayment: {
        amount: 0,
        remainingDownPaymentRounded: 0,
      },
    } as ProductCalculationSummaryDto;
  }

  async getPromoCodeToApply(data: {
    applyDefaultPromo: boolean;
    feedId?: string;
  }) {
    let promoCode: DetailedPromoCode = null;

    if (data.feedId) {
      promoCode = await getFeedPromo({ feedId: data.feedId });
    }

    if (!promoCode && data.applyDefaultPromo) {
      promoCode = await getDefaultPromoCode();
    }

    return promoCode;
  }
  async calculateSellerCutPrice(
    userId: string,
    modelId: string,
    variantId: string,
    sellPrice: number,
    grade: string
  ) {
    try {
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
        ]);
      if (errSettings) throw new Error('settings was not found');

      const [, data] = await this.modelRepository.getById(modelId);
      const categoryId = (data.result as DeviceModelDocument).category_id;
      const commissionSummaries = await this.calculateSummaryCommission({
        product: {
          id: null,
          sellPrice,
          modelId,
          varientId: variantId,
          categoryId: categoryId,
          conditionId: null,
          grade,
        },
        promoCode: null,
        sellerId: userId,
        isCommissionForBuyer: false,
        source: null,
        sysSettings,
        reservation: null,
      });
      const commissionSummary =
        commissionSummaries[0]?.withPromo ||
        commissionSummaries[0]?.withoutPromo;
      const yourCutPrice =
        Number(commissionSummary.sellPrice) -
        Number(commissionSummary.commission) -
        Number(commissionSummary.totalVat);
      return formatPriceInDecimalPoints(yourCutPrice);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CALCULATE_PRODUCT,
          exception.message
        );
      }
    }
  }

  async getFraudListings(page: number, size: number) {
    try {
      const [err, data] = await this.productRepository.getFraudListings(
        page,
        size
      );
      if (err) {
        throw err;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_FRAUD_LISTINGS,
          exception.message
        );
      }
    }
  }

  async getListingsTransaction(
    page: number,
    size: number,
    isGetSuccess: boolean
  ) {
    try {
      const [err, data] = await this.paymentRepository.getListingsTransaction(
        page,
        size,
        isGetSuccess
      );
      if (err) {
        throw err;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_LISTINGS_TRANSACTION_LISTINGS,
          exception.message
        );
      }
    }
  }

  async updateFraudStatus(productId: string, fraudStatus: boolean) {
    try {
      const [err, data] = await this.productRepository.updateFraudStatus(
        productId,
        fraudStatus
      );
      if (err) {
        throw err;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_FRAUD_STATUS_PRODUCT,
          exception.message
        );
      }
    }
  }

  async getFlaggedListings(
    page: number,
    size: number,
    sortBy: string,
    isOnHold: boolean,
    isConsignment: boolean
  ) {
    try {
      const [err, data] = await this.productRepository.getFlaggedListings(
        page,
        size,
        sortBy,
        isOnHold,
        isConsignment
      );
      if (err) {
        throw err;
      }
      const products: any[] = data.result.data;
      const conditionIds: string[] = products.map(
        product => product.condition_id
      );
      const conditions = await getConditions({ ids: conditionIds });
      const updatedResponse = products.map(product => {
        const condition = product.condition_id
          ? conditions.find(cond => cond.id === product.condition_id)
          : null;
        return {
          ...product,
          product_condition: condition
            ? condition.name
            : product.product_condition,
        };
      });
      return { ...data, result: { ...data.result, data: updatedResponse } };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAIL_TO_GET_FLAGGED_LISTING,
          exception.message
        );
      }
    }
  }

  async verifyProduct(
    productId: string,
    userId: string,
    verifyStatus: boolean
  ) {
    try {
      const [err, data] = await this.productRepository.verifyProduct(
        productId,
        userId,
        verifyStatus
      );
      if (err) {
        throw err;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_VERIFY_STATUS,
          exception.message
        );
      }
    }
  }

  async getPreviewProductById(productId: string, userId: string) {
    try {
      const [err, productResult] =
        await this.productRepository.getPreviewProductById(productId, userId);
      if (err) {
        throw productResult;
      }
      if (productResult.result?.tags) {
        productResult.result.tags = productResult.result.tags.name;
      } else {
        productResult.result.tags = '';
      }
      // Send soumChoice tag if product is consignment
      if (productResult.result?.isConsignment) {
        productResult.result.tags = 'soumChoice';
      }

      if (err) {
        throw productResult;
      }

      const product: any = productResult.result;

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

      const feeds = await this.feedRepository.getIntersectedFeeds(
        null,
        [FeedType.OFFERS],
        [Types.ObjectId(productId)]
      );
      product.productFeed = null;
      if ((feeds || [])?.length) {
        product.productFeed = {
          id: feeds[0]?._id?.toString(),
          arName: feeds[0]?.arName,
          enName: feeds[0]?.enName,
          arTitle: feeds[0]?.arTitle,
          enTitle: feeds[0]?.enTitle,
          expiryDate: feeds[0]?.expiryDate,
        };
      }
      let promoCode = await this.getPromoCodeToApply({
        applyDefaultPromo: true,
        feedId: product?.productFeed?.id || null,
      });

      if (promoCode && product.productFeed) {
        product.productFeed.promoCode = promoCode.code;
      }
      promoCode = await getDefaultPromoCode();
      const commissionSummaries = await this.calculateSummaryCommission({
        product: {
          id: product.product_id.toString(),
          sellPrice: product.sell_price,
          modelId: product.models._id,
          varientId: product.varients._id,
          categoryId: product.category._id,
          conditionId: product.condition_id,
          grade: product.grade,
        },
        promoCode: promoCode,
        sellerId: product.seller_id,
        isCommissionForBuyer: true,
        source: ProductAccessSource.SPP,
        sysSettings,
        allPayments: false,
        // add reservation here
      });

      const commissionSummary =
        commissionSummaries[0]?.withPromo ||
        commissionSummaries[0]?.withoutPromo;

      const extraFees =
        Number(commissionSummaries[0].withoutPromo.commission) +
        Number(commissionSummaries[0].withoutPromo.realEstateVat) +
        (sysSettings.apply_delivery_fee_spps
          ? Number(commissionSummaries[0].withoutPromo.totalVat)
          : Number(commissionSummaries[0].withoutPromo.commissionVat));

      product.grandTotal = commissionSummary.grandTotal;
      if (product.productFeed) {
        const GT_Before = commissionSummaries[0]?.withoutPromo?.grandTotal || 0;
        const GT_After =
          commissionSummaries[0]?.withPromo?.grandTotal ||
          commissionSummaries[0]?.withoutPromo?.grandTotal;
        product.discount = formatPriceInDecimalPoints(
          Number(GT_Before) - Number(GT_After),
          2
        );
      }
      product.extraFees = formatPriceInDecimalPoints(extraFees);

      product.isMerchant = product?.isMerchant ? product.isMerchant : false;
      product.sellerRating = product?.sellerRating
        ? product.sellerRating
        : null;
      product.isUAE_listing = product?.isUAE_listing || false;
      product.marketPercentage = product?.marketPercentage || null;
      product.listingQuantity = product?.listingQuantity
        ? product.listingQuantity
        : null;
      product.trendingBadge = await this.checkIfgroupListingIsPopular(
        product?.listingGroupId?.toString()
      );
      if (
        userId &&
        productResult?.result?.seller_id.toString() === userId?.toString() &&
        sysSettings?.Show_payouts_only_to_sellers
      ) {
        product.grandTotal = await this.calculateSellerCutPrice(
          userId,
          product.models._id,
          product.varients._id,
          product.sell_price,
          product.grade
        );
        product.pendingQuestion =
          await this.askSellerService.countPendingQuestionByUserID(
            userId,
            productId
          );
      }

      if (
        userId &&
        productResult?.result?.seller_id.toString() === userId?.toString() &&
        productResult?.result?.isConsignment
      ) {
        product.grandTotal = parseFloat(
          productResult?.result?.consignment?.payoutAmount
        );
      }

      if (product?.grandTotal) {
        product.grandTotal = parseFloat(product.grandTotal);
      }
      const [, variantRes] = await this.variantRepository.getById(
        product.varient_id
      );
      const varient: VariantDocument = variantRes.result as VariantDocument;

      productResult.result.attributes = await mapAttributes(varient.attributes);

      productResult.result.attributes =
        productResult?.result?.attributes?.filter(
          (value: any, index: any, self: any) =>
            index ===
            self.findIndex(
              (t: any) =>
                t?.title?.enName?.toString() ===
                value?.title?.enName?.toString()
            )
        );

      const categoryCondition = await getProductCondition({
        id: product.condition_id,
        variantId: product.varient_id,
        sellPrice: product.sell_price,
      } as GetProductCatConRequest);

      product.condition = categoryCondition?.condition;
      if (product?.isFavorite) {
        product.isFavorite = true;
      } else {
        product.isFavorite = false;
      }

      const addonsRes =
        (await getAddOns({
          modelId: product?.models?._id,
          price: product?.sell_price,
        } as GetAddonsRequest)) || null;

      const allowedAddons = addonsRes?.addons?.filter(addon => {
        const sellerIdToCompare =
          typeof product?.seller_id === 'string'
            ? product?.seller_id
            : String(product?.seller_id);

        // if no sellerIds for the AddonType then all sellers Accepted
        const p1 =
          addon.type === AddonType.WARRANTY &&
          ((addon?.sellerIds || []).length == 0 ||
            (Array.isArray(addon?.sellerIds) &&
              addon.sellerIds.includes(sellerIdToCompare)));

        const p2 = addon.type === AddonType.ACCESSORY;

        const p3 =
          (addon.type === AddonType.GIFT_WRAPPING ||
            addon.type === AddonType.EXTRA_PACKAGING) &&
          ((addon?.sellerIds || []).length == 0 ||
            (Array.isArray(addon?.sellerIds) &&
              addon.sellerIds.includes(sellerIdToCompare)));
        if (p1 || p2 || p3) {
          return true;
        }
        return false;
      });

      productResult.result.addons = allowedAddons;

      // this is temp solution till we change how we map isGreatDeal
      product.isGreatDeal = false;
      const normalCase =
        product.status === 'Active' && product.sell_status === 'Available';
      const sellerOnHoldCase =
        userId === product.seller_id.toString() &&
        product.status === 'On hold' &&
        product.isApproved === false;

      const sellerCase =
        product.status === 'Active' &&
        userId === product.seller_id.toString() &&
        [
          ProductOrderStatus.Sold,
          ProductOrderStatus.Locked,
          ProductOrderStatus.Refunded,
        ].includes(product.sell_status);

      const [, orderFoundData] =
        await this.orderRepository.checkIfUserBuyProduct(productId, userId);
      const buyerCase =
        product.sell_status === ProductOrderStatus.Sold &&
        orderFoundData.result;

      const rejectedCase =
        userId === product.seller_id.toString() && product.status === 'Reject';
      const returnProduct =
        normalCase ||
        sellerOnHoldCase ||
        sellerCase ||
        buyerCase ||
        rejectedCase;

      const [settingError, deliverRuleSetting] =
        await this.settingRepository.getSettingByKeys([
          SettingValues.DELIVERY_RULES,
        ]);
      const setting: SettingDocument = deliverRuleSetting.find(
        (elem: any) => elem.name == SettingValues.DELIVERY_RULES
      );

      const [addressError, address] =
        await this.addressRepository.getUserAddress(
          product?.seller_id?.toString()
        );

      if (settingError || addressError) {
        productResult.result.delivery_rules = [];
      } else {
        const data = address?.result[0] as AddressDocument;
        try {
          productResult.result.delivery_rules = JSON.parse(
            setting?.value
          )?.filter(
            (value: any) =>
              value?.from === data?.city || value?.from_ar === data?.city
          );

          if (productResult?.result?.delivery_rules?.length === 0) {
            productResult.result.delivery_rules = JSON.parse(
              setting?.value
            )?.filter((value: any) => value?.from === 'Rest of Kingdom');
          }

          const indexOfKingdom =
            productResult?.result?.delivery_rules[0]?.delivery_rule?.findIndex(
              (i: any) => i.to === 'Rest of Kingdom'
            );

          productResult?.result?.delivery_rules[0]?.delivery_rule?.push(
            productResult?.result?.delivery_rules[0]?.delivery_rule?.splice(
              indexOfKingdom,
              1
            )[0]
          );

          if (product?.isUAE_listing) {
            const deliveryRule =
              productResult?.result?.delivery_rules?.[0]?.delivery_rule;
            if (deliveryRule) {
              const newDeliveryRule: DeliveryRules = deliveryRule.map(
                (elem: DeliveryRules) => {
                  return {
                    ...elem,
                    min_expected_delivery_time: 3,
                    max_expected_delivery_time: 8,
                  };
                }
              );

              productResult.result.delivery_rules[0].delivery_rule =
                newDeliveryRule;
            }
          }
          // Send soumChoice tag if product is consignment
          if (product.isConsignment) {
            productResult.result.expressDeliveryBadge = true;
          } else {
            productResult.result.expressDeliveryBadge =
              await this.checkExpressDeliveryFlag({
                sellerId: product.seller_id.toString(),
                productId: productId.toString(),
              });
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (!returnProduct)
        throw new Error(Constants.MESSAGE.PRODUCT_IS_NOT_AVAILABLE);

      if (userId) {
        productView('product-view', {
          productId: productId,
          grandTotal: product?.grandTotal,
          userId: userId,
          viewedAt: new Date(),
        });
        // We need this to push data to Recommendation service
        try {
          AddFeedback({
            userId: userId,
            itemId: productId,
            type: 'SPP_VISITED',
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
      }

      const offer = await getOfferForProduct({
        productId,
        userId,
      });

      productResult.result.acceptedOffer =
        offer?.status === 'accepted' ? offer : null;
      return productResult; // we should not return the obj like this @Dave
    } catch (exception) {
      console.log(exception);
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
          exception.message
        );
      }
    }
  }

  async checkExpressDeliveryFlag(data: {
    sellerId: string;
    productId: string;
  }): Promise<boolean> {
    try {
      const vaultSettings = await getSecretData('/secret/data/apiv2');
      const expressDeliveryCondition =
        vaultSettings['express_delivery_condition'];
      const expDelSellersList = JSON.parse(expressDeliveryCondition);

      if (!expDelSellersList[data.sellerId]) {
        return false;
      }
      if (
        expDelSellersList[data.sellerId].length === 0 ||
        Array.from(expDelSellersList[data.sellerId]).includes(data.productId)
      ) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async checkSellPriceForUpdate(
    variant_id: string,
    sellPrice: number
  ): Promise<boolean> {
    try {
      const [err, data] = await this.variantRepository.getById(variant_id);

      if (err) {
        return err;
      }

      const variant = data.result as VariantDocument;
      const currentPrice = Number(variant?.current_price);

      if (isNaN(currentPrice) || isNaN(sellPrice)) return true;

      if (currentPrice <= 0) return false;

      return sellPrice > currentPrice;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          exception.message
        );
      }
    }
  }

  async checkFBSExpressDeliveryFlag(data: {
    sellerId: string;
  }): Promise<boolean> {
    try {
      const vaultSettings = await getSecretData('/secret/data/apiv2');
      const fbsSellersSetting = JSON.parse(
        vaultSettings?.['fbsSellers'] || '[]'
      );
      return fbsSellersSetting.includes(data.sellerId);
    } catch (error) {
      console.log('🚀 ~ checkFBSExpressDeliveryFlag ~ error:', error);
      return false;
    }
  }

  async updatePrice(
    productId: string,
    userId: string,
    sellPrice: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const [err, data] = await this.productRepository.updatePrice(
        productId,
        userId,
        sellPrice
      );

      const productSummary = await this.getProductSummaryCommission({
        orderId: null,
        productId: productId,
        isBuyer: false,
        isOriginalBreakDown: true,
      });
      const [, listingResult] =
        await this.productRepository.getEditListingProduct(productId);
      const product = listingResult.result as LeanDocument<ILegacyProductModel>;
      if (productSummary) {
        await this.updateSellPriceInCommissionSummary({
          product: {
            id: productId,
            sellPrice: sellPrice,
            categoryId: product.category_id._id.toString(),
            modelId: product.model_id._id.toString(),
            varientId: product.varient_id._id.toString(),
            grade: product.grade,
            conditionId: product.condition_id,
          },
        });
      } else {
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
            'seller_commission_percentage',
            'vat_percentage',
            'apply_delivery_fee_mpps',
            'apply_delivery_fee_spps',
            'price_quality_extra_commission',
            'shipping_charge_percentage',
          ]);
        if (errSettings) throw new Error('settings was not found');
        const commissionReqData: any = {
          product: {
            id: productId,
            sellPrice: product.sell_price,
            modelId: product.model_id._id.toString(),
            varientId: product.varient_id._id.toString(),
            grade: product.grade,
            categoryId: product.category_id._id.toString(),
            conditionId: product.condition_id.toString(),
          },
          sellerId: product.user_id.toString(),
          isCommissionForBuyer: false,
          sysSettings,
        };
        await this.createSummaryCommission(commissionReqData);
      }
      if (err) {
        return [err, data];
      }

      return [false, data];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRICE_PRODUCT,
          exception.message
        );
      }
    }
  }

  async updateEditPriceStatus(
    productId: string,
    userId: string,
    isEditing: boolean
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const [err, data] = await this.productRepository.updateEditPriceStatus(
        productId,
        userId,
        isEditing
      );
      if (err) {
        return [err, data];
      }

      return [false, data];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
          exception.message
        );
      }
    }
  }

  async validateSellData(
    productId: string,
    sellPrice: number,
    status: string,
    sell_status: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const [err, data] = await this.productRepository.validateSellData(
        productId,
        sellPrice,
        status,
        sell_status
      );

      if (err) {
        return [err, data];
      }

      return [false, data];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
          exception.message
        );
      }
    }
  }

  mapAttributesDto(attributes: FeatureForProduct[]) {
    const data =
      attributes?.map((elem: FeatureForProduct) => ({
        title: {
          arName: elem?.attribute_name_ar,
          enName: elem?.attribute_name_en,
        },
        value: {
          arName: elem?.option?.[0]?.option_name_ar || '',
          enName: elem?.option?.[0]?.option_name_en || '',
        },
      })) || [];

    // based on request from product team
    if (
      data.length == 1 &&
      data[0].title.enName == 'Capacity' &&
      data[0].value.enName == 'Next'
    )
      return [];
    return data;
  }

  mapFiltersDto(attributes: FeatureForProduct[]) {
    const data =
      attributes?.map((elem: FeatureForProduct) => ({
        title: {
          arName: elem?.attribute_name_ar,
          enName: elem?.attribute_name_en,
        },
        value: {
          arName: elem?.option?.[0]?.option_name_ar || '',
          enName: elem?.option?.[0]?.option_name_en || '',
        },
      })) || [];

    // based on request from product team
    if (
      data.length == 1 &&
      data[0].title.enName == 'Capacity' &&
      data[0].value.enName == 'Next'
    )
      return [];
    return data;
  }

  async updateProductVariant(
    productId: string,
    newVariantId: string,
    isForceUpdate: boolean
  ) {
    try {
      const [errData, variantData] =
        await this.variantRepository.getVariantById(newVariantId);
      if (errData) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          ''
        );
      }
      const variant = variantData.result as VariantDocument;
      if (variant?.status !== 'Active') {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          ''
        );
      }
      const [err, updateProductVariantResult] =
        await this.productRepository.updateProductVariant(
          productId,
          newVariantId,
          isForceUpdate,
          variant
        );

      if (err) {
        throw updateProductVariantResult;
      }

      return updateProductVariantResult;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          exception.message
        );
      }
    }
  }

  async rejectProduct(productId: string, rejected_reasons: string) {
    try {
      const [, productData] = await this.productRepository.getDetailProduct(
        productId
      );

      const [err, rejectProductResult] =
        await this.productRepository.rejectProduct(productId, rejected_reasons);

      if (err) {
        throw rejectProductResult;
      }
      // Re-calculate the rates
      await this.userRepository.updateRatesScan(
        productData?.result?.seller_id?.toString(),
        false
      );

      return rejectProductResult;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REJECT_PRODUCT,
          exception.message
        );
      }
    }
  }

  async countBetterPriceListings(
    variantId: string,
    score: number,
    listingPrice: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const [err, data] = await this.productRepository.countBetterPriceListings(
        variantId,
        score,
        listingPrice
      );

      if (err) {
        return [err, data];
      }

      return [false, data];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_COUNT_BETTER_PRICE_LISTINGS,
          exception.message
        );
      }
    }
  }

  async updateModelMismatch(numberOfRecord: number): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const [err, data] = await this.productRepository.updateModelMismatch(
        numberOfRecord
      );

      if (err) {
        return [err, data];
      }

      return [false, data];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_MISMATCHED_MODEL,
          exception.message
        );
      }
    }
  }

  async findProductsByUserId(userId: string) {
    try {
      return await this.productRepository.findProductsByUserId(userId);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
        exception.message
      );
    }
  }

  async getPendingProductsCountByUserId(userId: string) {
    try {
      const [err, data] =
        await this.productRepository.findPendingProductsByUserId(userId);
      const productsCounts = {
        active: 0,
        requiresRenewel: 0,
      };
      if (!err) {
        const products = (data?.result as ILegacyProductModel[]) || [];
        for (const product of products) {
          if (
            product.status === ProductStatus.Idle ||
            product.isExpired === true ||
            new Date(product.expiryDate).getTime() <= new Date().getTime()
          ) {
            productsCounts.requiresRenewel++;
          } else {
            productsCounts.active++;
          }
        }
      }
      return productsCounts;
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
        exception.message
      );
    }
  }
  async getConsignmentProductsByUserId(userId: string) {
    try {
      const [err, products] =
        await this.productRepository.getConsignmentProductsByUserId(userId);
      if (err) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_CONSIGNMENT_COUNT
        );
      }
      return products;
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_CONSIGNMENT_COUNT,
        exception.message
      );
    }
  }
  async getMySales(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const [error, mySalesResult] =
        await this.deltaMachineService.getDMOrdersBySeller(userId);
      if (error) {
        throw new Error('Cannot get my sales data');
      }

      const needActionsOrder: any = [];
      const previousSales: any = [];
      const refundedSales: any = [];
      const statuses = await this.deltaMachineService.getStatusList();

      const dmStatuses =
        (await this.dmStatusGroupService.getDmStatusGroups()) as GetAllDMStatusGroup[];
      const needActionsStatus: string[] = dmStatuses
        .filter(
          (c: GetAllDMStatusGroup) =>
            c.group === DMStatusGroups.NEED_ACTIONS_STATUS
        )
        .map((item: GetAllDMStatusGroup) => item.statusName);
      const dynamicTimerShownStatus: string[] = dmStatuses
        .filter(
          (c: GetAllDMStatusGroup) =>
            c.group === DMStatusGroups.DYNAMIC_TIMER_SHOWN_STATUS
        )
        .map((item: GetAllDMStatusGroup) => item.statusName);
      const doneOrder: string[] = dmStatuses
        .filter(
          (c: GetAllDMStatusGroup) => c.group === DMStatusGroups.DONE_ORDER
        )
        .map((item: GetAllDMStatusGroup) => item.statusName);
      const refundedSalesStatus: string[] = dmStatuses
        .filter(
          (c: GetAllDMStatusGroup) =>
            c.group === DMStatusGroups.REFUNDED_SALES_STATUS
        )
        .map((item: GetAllDMStatusGroup) => item.statusName);

      await Promise.all(
        (mySalesResult?.result as SellerDMOrder[])?.map(
          async (dmOrder: any) => {
            const status = (statuses as DeltaMachineStatusDocument[]).find(
              status => status.toObject().id === dmOrder.statusId.toString()
            );
            const data = {
              dmOrderId: dmOrder._id,
              orderId: dmOrder.orderId,
              statusId: dmOrder.statusId,
              createdAt: dmOrder.createdAt,
              updatedAt: dmOrder.updatedAt,
              confirmationDeadline: dmOrder.confirmationDeadline,
              variant_id: dmOrder.orderData?.variantId,
              statusName: status.name,
              modelName: dmOrder.orderData?.productName,
              modelNameAr: dmOrder.orderData?.productNameAr,
              orderNumber: dmOrder.orderData?.orderNumber,
              trackingNumber: dmOrder.orderData?.trackingNumber,
              product_id: dmOrder.orderData?.productId,
              grand_total: dmOrder.orderData?.grandTotal,
              listingCode: dmOrder.listingNumber,
              timeLeft: 0,
              attributes: {},
            };
            const [, variantRes] =
              await this.variantRepository.getVarientWithAttributes(
                dmOrder.orderData?.variantId
              );
            const variant: VariantForProduct =
              variantRes.result as VariantForProduct;
            data.attributes = this.mapAttributesDto(variant?.attributes);

            if (needActionsStatus.includes(data.statusName)) {
              if (dynamicTimerShownStatus.includes(data.statusName)) {
                data.timeLeft = Math.round(
                  (data.confirmationDeadline?.getTime() -
                    new Date().getTime()) /
                    36e5
                );
              }
              needActionsOrder.push(data);
            }

            if (doneOrder.includes(data.statusName)) {
              previousSales.push(data);
            }

            if (refundedSalesStatus.includes(data.statusName)) {
              refundedSales.push(data);
            }
            return data;
          }
        )
      );

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        {
          needActionOrder: needActionsOrder,
          previousSales: previousSales,
          refundedSales: refundedSales,
        },
        Constants.MESSAGE.GET_MY_SALES_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MY_SALES,
          exception.message
        );
      }
    }
  }

  async getMySalesDetail(
    userId: string,
    orderId: string,
    token: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const [err, mySalesResult] = await this.productRepository.getMySales(
        userId,
        orderId
      );

      if (err || !mySalesResult.result[0]) {
        throw mySalesResult;
      }
      const [, variantRes] =
        await this.variantRepository.getVarientWithAttributes(
          mySalesResult?.result[0]?.variant_id
        );
      const variant: VariantForProduct = variantRes.result as VariantForProduct;
      mySalesResult.result[0].attributes = this.mapAttributesDto(
        variant?.attributes
      );

      const dmStatuses =
        (await this.dmStatusGroupService.getDmStatusGroups()) as GetAllDMStatusGroup[];
      const dynamicTimerShownStatus: string[] = dmStatuses
        .filter(
          (c: GetAllDMStatusGroup) =>
            c.group === DMStatusGroups.DYNAMIC_TIMER_SHOWN_STATUS
        )
        .map((item: GetAllDMStatusGroup) => item.statusName);
      const doneOrder: string[] = dmStatuses
        .filter(
          (c: GetAllDMStatusGroup) => c.group === DMStatusGroups.DONE_ORDER
        )
        .map((item: GetAllDMStatusGroup) => item.statusName);
      const refundedSalesStatus: string[] = dmStatuses
        .filter(
          (c: GetAllDMStatusGroup) =>
            c.group === DMStatusGroups.REFUNDED_SALES_STATUS
        )
        .map((item: GetAllDMStatusGroup) => item.statusName);
      const shouldShowBanner: string[] = dmStatuses
        .filter(
          (c: GetAllDMStatusGroup) =>
            c.group === DMStatusGroups.SHOULD_SHOW_BANNER
        )
        .map((item: GetAllDMStatusGroup) => item.statusName);
      const inTransit: string[] = dmStatuses
        .filter(
          (c: GetAllDMStatusGroup) => c.group === DMStatusGroups.IN_TRANSIT
        )
        .map((item: GetAllDMStatusGroup) => item.statusName);
      const shipmentDeliveredToBuyer: string[] = dmStatuses
        .filter(
          (c: GetAllDMStatusGroup) =>
            c.group === DMStatusGroups.SHIPMENT_DELIVERED_TO_BUYER
        )
        .map((item: GetAllDMStatusGroup) => item.statusName);
      const productVerified: string[] = dmStatuses
        .filter(
          (c: GetAllDMStatusGroup) =>
            c.group === DMStatusGroups.PRODUCT_VERIFIED
        )
        .map((item: GetAllDMStatusGroup) => item.statusName);
      if (
        dynamicTimerShownStatus.includes(mySalesResult?.result[0]?.statusName)
      ) {
        mySalesResult.result[0].timeLeft = Math.round(
          (mySalesResult?.result[0]?.confirmationDeadline?.getTime() -
            new Date().getTime()) /
            36e5
        );
      }

      doneOrder.includes(mySalesResult?.result[0]?.statusName) ||
      refundedSalesStatus.includes(mySalesResult?.result[0]?.statusName)
        ? (mySalesResult.result[0].shouldShowWallet = true)
        : (mySalesResult.result[0].shouldShowWallet = false);

      shouldShowBanner.includes(mySalesResult?.result[0]?.statusName)
        ? (mySalesResult.result[0].shouldShowBanner = true)
        : (mySalesResult.result[0].shouldShowBanner = false);

      const activityLogData = await getActivityLogByOrderNumber(
        mySalesResult?.result[0]?.orderNumber,
        token
      );

      let stepOneDoneTimeStamp = '';
      let stepTwoDoneTimeStamp = '';
      let stepThreeDoneTimeStamp = '';
      let stepFourDoneTimeStamp = '';

      if (Array.isArray(activityLogData) && activityLogData.length !== 0) {
        stepOneDoneTimeStamp =
          activityLogData?.filter(
            (data: any) =>
              (data?.eventType === ActivityLogEvent.STATUS_CHANGE &&
                data?.action?.includes(ActivityLogAction.IN_TRANSIT)) ||
              data?.action?.includes(ActivityLogAction.BACKLOG_IN_TRANSIT) ||
              data?.action?.includes(ActivityLogAction.LOST_SHIPMENT)
          )[0]?.createdAt || '';

        stepTwoDoneTimeStamp =
          activityLogData?.filter(
            (data: any) =>
              (data?.eventType === ActivityLogEvent.STATUS_CHANGE &&
                data?.action?.includes(
                  ActivityLogAction.DELIVERED_SOUM_PRODUCT
                )) ||
              data?.action?.includes(ActivityLogAction.ITEM_DELIVERED) ||
              data?.action?.includes(ActivityLogAction.DISPUTE) ||
              data?.action?.includes(ActivityLogAction.TO_RESTRICTED)
          )[0]?.createdAt || '';

        stepThreeDoneTimeStamp =
          activityLogData?.filter(
            (data: any) =>
              (data?.eventType === ActivityLogEvent.STATUS_CHANGE &&
                data?.action?.includes(ActivityLogAction.PAYOUT_TO_SELLER)) ||
              data?.action?.includes(ActivityLogAction.BACKLOG_PAYOUT)
          )[0]?.createdAt || '';

        stepFourDoneTimeStamp =
          activityLogData?.filter(
            (data: any) =>
              data?.eventType === ActivityLogEvent.STATUS_CHANGE &&
              data?.action?.includes(ActivityLogAction.TRANSFERRED)
          )[0]?.createdAt || '';
      }

      mySalesResult.result[0].trackingSteps = [];
      mySalesResult.result[0].trackingStepsFlag = shouldShowBanner.includes(
        mySalesResult?.result[0]?.statusName
      )
        ? [false, false, false, false]
        : [];

      if (inTransit.includes(mySalesResult?.result[0]?.statusName)) {
        mySalesResult?.result[0]?.trackingSteps?.push(stepOneDoneTimeStamp);
        mySalesResult.result[0].trackingStepsFlag = [true, false, false, false];
      }

      if (
        shipmentDeliveredToBuyer.includes(mySalesResult?.result[0]?.statusName)
      ) {
        mySalesResult?.result[0]?.trackingSteps?.push(stepOneDoneTimeStamp);
        mySalesResult?.result[0]?.trackingSteps?.push(stepTwoDoneTimeStamp);
        mySalesResult.result[0].trackingStepsFlag = [true, true, false, false];
      }

      if (productVerified.includes(mySalesResult?.result[0]?.statusName)) {
        mySalesResult?.result[0]?.trackingSteps?.push(stepOneDoneTimeStamp);
        mySalesResult?.result[0]?.trackingSteps?.push(stepTwoDoneTimeStamp);
        mySalesResult?.result[0]?.trackingSteps?.push(stepThreeDoneTimeStamp);
        mySalesResult.result[0].trackingStepsFlag = [true, true, true, false];
      }

      if (doneOrder.includes(mySalesResult?.result[0]?.statusName)) {
        mySalesResult?.result[0]?.trackingSteps?.push(stepOneDoneTimeStamp);
        mySalesResult?.result[0]?.trackingSteps?.push(stepTwoDoneTimeStamp);
        mySalesResult?.result[0]?.trackingSteps?.push(stepThreeDoneTimeStamp);
        mySalesResult?.result[0]?.trackingSteps?.push(stepFourDoneTimeStamp);
        mySalesResult.result[0].trackingStepsFlag = [true, true, true, true];
      }

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        mySalesResult.result[0],
        Constants.MESSAGE.GET_MY_SALES_DETAIL_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MY_SALES,
          exception.message
        );
      }
    }
  }

  async removeBillingSettingsForOldProducts() {
    try {
      await this.productRepository.removeBillingSettingsOfOldProducts();
      return true;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          exception.message
        );
      }
    }
  }
  async productListData(product: any) {
    const [, variantRes] =
      await this.variantRepository.getVarientWithAttributes(product.varientId);
    const variant: VariantForProduct = variantRes.result as VariantForProduct;

    if (variant?.attributes?.length > 0) {
      variant.attributes = variant.attributes.filter(
        (value: any, index: any, self: any) =>
          index ===
          self.findIndex(
            (t: any) =>
              t?.attribute_name_en?.toString() ===
              value?.attribute_name_en?.toString()
          )
      );
    }

    let tags = '';
    if (product.tags) {
      product.tags?.map((_tag: Tag) => {
        tags = _tag.name;
      });
    }

    return {
      variant: variant,
      tags: tags,
    } as ProductListData;
  }

  async getBuyerPriceQualityCommission(priceLebel: string, settings: any) {
    return (
      settings[`${priceLebel}_price_quality_commission`.toLocaleLowerCase()] ||
      0
    );
  }
  async addPriceNudgingHistory(productId: string, sellPrice: number) {
    try {
      return await this.priceNudgingHistoryRepository.addPriceNudgingHistory(
        productId,
        sellPrice
      );
    } catch (exception) {
      logger.error(exception);
    }
  }
  async getPriceNudgingHistoryByProductId(productId: string) {
    try {
      return await this.priceNudgingHistoryRepository.getPriceNudgingHistoryByProductId(
        productId
      );
    } catch (error) {
      if (error instanceof ErrorResponseDto) throw error;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_PRICE_NUDGING_HISTORY
      );
    }
  }
  async countNumberOfActiveProducts(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const [err, numberOfListings] =
        await this.productRepository.countNumberOfActiveProducts(userId);

      if (err) {
        throw numberOfListings;
      }
      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        numberOfListings,
        Constants.MESSAGE.COUNT_ACTIVE_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_COUNT_ACTIVE,
          exception.message
        );
      }
    }
  }

  async createSummaryCommission(data: {
    product: any;
    sellerId: string;
    promoCode?: DetailedPromoCode | null;
    source?: ProductAccessSource | null;
    sysSettings?: any;
    isCommissionForBuyer?: boolean | true;
    orderId?: string;
    paymentId?: string;
    addOns?: AddOn[];
    reservation?: ReservationSummary;
    financingRequest?: FinancingRequestSummary;
    paymentModuleName?: PaymentModuleName | PaymentModuleName.GENERAL_ORDER;
  }) {
    let priceRange = null;
    if (data.isCommissionForBuyer) {
      const condition = await getProductCondition({
        id: data.product.conditionId,
        variantId: data.product.varientId,
        sellPrice: data.product.sellPrice,
      } as GetProductCatConRequest);
      priceRange = condition?.priceQuality?.name || null;
    }
    const getSellerUserTypetResult = await this.getSellerUserType(
      data.sellerId
    );
    const userType =
      !getSellerUserTypetResult?.isCompliant && !data.isCommissionForBuyer
        ? SellerUserType.NOT_COMPLIANT
        : getSellerUserTypetResult.userType;
    const commissionSummaryRequest = {
      commission: {
        userType,
        isBuyer: data.isCommissionForBuyer,
      } as CommissionFilters,
      product: {
        id: data.product.id,
        sellPrice: data.product.sellPrice,
        priceRange,
        source: data.source,
        categoryId: data.product.categoryId,
        modelId: data.product.modelId,
        conditionId: data.product.conditionId,
        varientId: data.product.varientId,
      } as Product,
      calculationSettings: {
        vatPercentage: data.sysSettings.vat_percentage,
        applyDeliveryFeeSPPs: data.sysSettings.apply_delivery_fee_spps,
        applyDeliveryFeeMPPs: data.sysSettings.apply_delivery_fee_mpps,
        applyDeliveryFee: data.sysSettings.apply_delivery_fee,
        deliveryFeeThreshold: data.sysSettings.delivery_threshold,
        deliveryFee: data.sysSettings.delivery_fee,
        referralFixedAmount: data.sysSettings.referral_fixed_amount,
        applyReservation: data.reservation ? true : false,
        applyFinancing: data.financingRequest ? true : false,
      } as CommissionFilters,
      promoCode: data.promoCode
        ? ({
            promoLimit: data.promoCode.promoLimit,
            type: data.promoCode.promoType,
            generator: data.promoCode.promoGenerator,
            discount: data.promoCode.discount,
            percentage: data.promoCode.percentage,
          } as PromoCode)
        : null,
      order: {
        id: data.orderId,
      } as Order,
      paymentOption: data.paymentId
        ? {
            id: data.paymentId,
          }
        : null,
      addOns: data?.addOns,
      reservation: data.reservation,
      financingRequest: data.financingRequest,
      paymentModuleName: data.paymentModuleName,
    } as CreateCommissionSummaryRequest;
    return createProductCommissionSummary(commissionSummaryRequest);
  }

  async calculateSummaryCommission(data: {
    product: any;
    sellerId: string;
    promoCode?: DetailedPromoCode | null;
    source?: ProductAccessSource | null;
    sysSettings?: any;
    isCommissionForBuyer?: boolean | true;
    allPayments?: boolean | false;
    paymentModuleName?: PaymentModuleName | PaymentModuleName.GENERAL_ORDER;
    paymentOptionId?: string;
    reservation?: ReservationSummary;
    financingRequest?: FinancingRequestSummary;
  }) {
    let priceRange = null;
    if (data.isCommissionForBuyer) {
      const condition = await getProductCondition({
        id: data.product.conditionId,
        variantId: data.product.varientId,
        sellPrice: data.product.sellPrice,
      } as GetProductCatConRequest);
      priceRange = condition?.priceQuality?.name || null;
    }
    const getSellerUserTypetResult = await this.getSellerUserType(
      data.sellerId
    );
    const userType =
      !getSellerUserTypetResult?.isCompliant && !data.isCommissionForBuyer
        ? SellerUserType.NOT_COMPLIANT
        : getSellerUserTypetResult.userType;
    const commissionSummaryRequest: CalculateCommissionSummaryRequest = {
      commission: {
        userType,
        isBuyer: data.isCommissionForBuyer,
      } as CommissionFilters,
      product: {
        id: data.product.id,
        sellPrice: data.product.sellPrice,
        priceRange,
        source: data.source,
        categoryId: data.product.categoryId,
        modelId: data.product.modelId,
        conditionId: data.product.conditionId,
        varientId: data.product.varientId,
      } as Product,
      calculationSettings: {
        vatPercentage: data.sysSettings.vat_percentage,
        applyDeliveryFeeSPPs: data.sysSettings.apply_delivery_fee_spps,
        applyDeliveryFeeMPPs: data.sysSettings.apply_delivery_fee_mpps,
        applyDeliveryFee: data.sysSettings.apply_delivery_fee,
        deliveryFeeThreshold: data.sysSettings.delivery_threshold,
        deliveryFee: data.sysSettings.delivery_fee,
        referralFixedAmount: data.sysSettings.referral_fixed_amount,
        applyReservation: !!data.reservation,
        applyFinancing: !!data.financingRequest,
      } as CalculationSettings,
      promoCode: data.promoCode
        ? ({
            promoLimit: data?.promoCode?.promoLimit,
            type: data.promoCode.promoType,
            generator: data.promoCode.promoGenerator,
            discount: data.promoCode.discount,
            percentage: data.promoCode.percentage,
          } as PromoCode)
        : null,
      allPayments: data.allPayments,
      paymentModuleName: data.paymentModuleName,
      paymentOption: data.paymentOptionId
        ? {
            id: data.paymentOptionId,
          }
        : null,
      reservation: data.reservation
        ? {
            reservationAmount: data.reservation.reservationAmount,
          }
        : null,
      financingRequest: data.financingRequest
        ? {
            amount: data.financingRequest.amount,
          }
        : null,
    };

    return calculateProductCommissionSummary(commissionSummaryRequest);
  }

  async createSummaryCommissionMigration(data: {
    product: any;
    sellerId: string;
    promoCode?: DetailedPromoCode | null;
    source?: ProductAccessSource | null;
    sysSettings?: any;
    isCommissionForBuyer?: boolean | true;
    orderId?: string;
  }) {
    let priceRange = null;
    if (data.isCommissionForBuyer) {
      const condition = await getProductCondition({
        id: data.product.conditionId,
        variantId: data.product.varientId,
        sellPrice: data.product.sellPrice,
      } as GetProductCatConRequest);
      priceRange = condition?.priceQuality?.name || null;
    }
    const { userType } = await this.getSellerUserType(data.sellerId);

    let sellerCommissionPercentage =
      data.sysSettings.seller_commission_percentage;
    if (
      SellerUserType.KEY_SELLER == userType &&
      data.sysSettings.business_seller_commission_percentage
    )
      sellerCommissionPercentage =
        data.sysSettings.business_seller_commission_percentage;
    const commissionSummaryRequest = {
      commission: {
        userType,
        isBuyer: data.isCommissionForBuyer,
      } as CommissionFilters,
      product: {
        id: data.product.id,
        sellPrice: data.product.sellPrice,
        priceRange,
        source: data.source,
      } as Product,
      calculationSettings: {
        vatPercentage: data.sysSettings.vat_percentage,
        applyDeliveryFeeSPPs: data.sysSettings.apply_delivery_fee_spps,
        applyDeliveryFeeMPPs: data.sysSettings.apply_delivery_fee_mpps,
        applyDeliveryFee: data.sysSettings.apply_delivery_fee,
        deliveryFeeThreshold: data.sysSettings.delivery_threshold,
        deliveryFee: data.sysSettings.delivery_fee,
        referralFixedAmount: data.sysSettings.referral_fixed_amount,
        sellerCommissionPercentage: sellerCommissionPercentage,
        buyerCommissionPercentage: data.sysSettings.buyer_commission_percentage,
        priceQualityExtraCommission:
          data.sysSettings.price_quality_extra_commission,
      } as MigrationCalculationSettings,
      promoCode: data.promoCode
        ? ({
            promoLimit: data?.promoCode?.promoLimit,
            type: data.promoCode.promoType,
            generator: data.promoCode.promoGenerator,
            discount: data.promoCode.discount,
            percentage: data.promoCode.percentage,
          } as PromoCode)
        : null,
      order: {
        id: data.orderId,
      } as Order,
    } as MigrateCommissionSummaryRequest;
    return migrateProductCommissionSummary(commissionSummaryRequest);
  }

  async getSellerUserType(
    userId: string
  ): Promise<{ userType: SellerUserType; isCompliant: boolean }> {
    const [, userDoc] = await this.userRepository.getUserAddress(
      userId,
      '_id isKeySeller isMerchant sellerType'
    );
    const user = userDoc.result as UserLegacyDocument;
    let userType: SellerUserType;
    if (user.isKeySeller) userType = SellerUserType.KEY_SELLER;
    else if (user.isMerchant) userType = SellerUserType.MERCHANT_SELLER;
    else if (user.sellerType?.isUAE) userType = SellerUserType.UAE_SELLER;
    else userType = SellerUserType.INDIVIDUAL_SELLER;
    return {
      userType,
      isCompliant: !!user.sellerType?.isCompliant,
    };
  }

  async getProductSummaryCommission(data: {
    orderId: string;
    productId: string;
    isBuyer: boolean;
    isOriginalBreakDown: boolean;
  }) {
    return getProductSummaryCommission(data);
  }

  async updateSellerCommission(data: {
    product: any;
    sellerNewCommission: number;
  }) {
    return updateSellerCommission(data);
  }

  async updateSellPriceInCommissionSummary(data: { product: any }) {
    let priceRange = null;
    const condition = await getProductCondition({
      id: data.product.conditionId,
      variantId: data.product.varientId,
      sellPrice: data.product.sellPrice,
    } as GetProductCatConRequest);
    priceRange = condition?.priceQuality?.name || null;
    return updateSellPriceInCommissionSummary({
      product: {
        id: data.product.id,
        sellPrice: data.product.sellPrice,
        priceRange,
        categoryId: data.product.categoryId,
      } as Product,
    });
  }

  async getActiveListingByUserID(
    userId: string,
    page: number,
    size: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const [err, activeListings] =
        await this.productRepository.getActiveListingByUserID(
          userId,
          page,
          size
        );

      if (err) {
        throw activeListings;
      }

      const listingsList: any = [];

      await Promise.all(
        activeListings.result.docs.map(async (listing: any) => {
          listing = listing.toObject();
          const [, variantRes] =
            await this.variantRepository.getVarientWithAttributes(
              listing.varient_id
            );
          const varient: VariantForProduct =
            variantRes.result as VariantForProduct;

          const [, model]: any = await this.modelRepository.getById(
            listing?.model_id
          );
          listing = {
            originalPrice: varient?.current_price || 0,
            productId: listing?._id,
            sellPrice: listing?.sell_price,
            grade: listing?.grade,
            arGrade: listing?.grade_ar,
            productImage: listing?.product_images[0],
            variantName: varient?.varient,
            arVariantName: varient?.varient_ar,
            modelName: model?.result?.model_name,
            arModelName: model?.result?.model_name_ar,
          };
          listingsList.push(listing);
        })
      );

      return returnedDataTemplate(
        activeListings.code,
        {
          activeListings: listingsList,
          hasNextPage: activeListings?.result?.hasNextPage,
          totalListings: activeListings?.result?.totalDocs,
        },
        activeListings.message
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_COUNT_ACTIVE,
          exception.message
        );
      }
    }
  }

  async updateProductImages(
    productId: string,
    listingImages: string[]
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const [err, updatedListing] =
        await this.productRepository.updateProductImages(
          productId,
          listingImages
        );

      if (err) {
        throw updatedListing;
      }

      const product = updatedListing?.result as ILegacyProductModel;
      if (product?.listingGroupId) {
        await this.updateBulkListing({
          listingGroupId: product.listingGroupId.toString(),
          sellerId: product.user_id,
          productImages: listingImages,
        } as ProductUpdateBulkListingDto);
      }

      return returnedDataTemplate(
        updatedListing.code,
        updatedListing,
        updatedListing.message
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_LISTING_IMAGES,
          exception.message
        );
      }
    }
  }

  async updateProductsCondition(data: {
    categoryId: string;
    conditionId: string;
    scoreRangeMax: number;
    scoreRangeMin: number;
  }) {
    try {
      const productIds = await this.productRepository.updateProductsCondition({
        categoryId: data.categoryId,
        conditionId: data.conditionId,
        scoreRangeMax: data.scoreRangeMax,
        scoreRangeMin: data.scoreRangeMin,
      });
      if (!productIds?.length) return;
      this.searchService.clearProductSyncStatus(productIds);
    } catch (error) {
      console.log(error);
    }
  }
  async GetViewedProductsData(
    productIds: string[],
    shouldSkipExpire: boolean = false,
    categoryId: string = '',
    getSpecificCategory: boolean = false
  ) {
    try {
      return await this.productRepository.GetViewedProductsData(
        productIds,
        shouldSkipExpire,
        categoryId,
        getSpecificCategory
      );
    } catch (error) {
      if (error instanceof ErrorResponseDto) throw error;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_VIEWED_PRODUCTS
      );
    }
  }

  async getRecentlySoldProducts(
    hours: number,
    limit: number,
    offset: number,
    categoryId: string = '',
    getSpecificCategory: boolean = false
  ) {
    try {
      return await this.orderRepository.getRecentlySoldProducts(
        hours,
        limit,
        offset,
        categoryId,
        getSpecificCategory
      );
    } catch (error) {
      if (error instanceof ErrorResponseDto) throw error;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_VIEWED_PRODUCTS
      );
    }
  }
  async updateProductStatusForRelisting(productId: string): Promise<boolean> {
    try {
      const updateProduct =
        await this.productRepository.updateProductStatusForRelisting(productId);
      return updateProduct;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_RELIST_PRODUCT,
          exception.message
        );
      }
    }
  }

  async updateProductDetails(
    productId: string,
    productUpdate: ProductUpdateDto
  ) {
    try {
      const [err, updateProductResult] =
        await this.productRepository.updateProductDetails(
          productId,
          productUpdate
        );

      if (err) {
        throw new Error(`Failed to update product details ${err}`);
      }

      return updateProductResult;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          exception.message
        );
      }
    }
  }
  async getProductActivationStatus(
    productId: string
  ): Promise<{ isActivated: boolean }> {
    try {
      const [errProd, productResult] =
        await this.productRepository.getProductById(productId);
      if (errProd) throw new Error(Constants.MESSAGE.PRODUCT_GET_NOT_FOUND);
      const product: ILegacyProductModel =
        productResult.result as ILegacyProductModel;
      return {
        isActivated: product?.status === ProductStatus.Active ? true : false,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT,
          exception.message
        );
      }
    }
  }

  async updateProductActivationStatus(productId: string, isActivated: boolean) {
    try {
      await this.productRepository.updateProductActivationStatus(
        productId,
        isActivated
      );
      if (isActivated) {
        await this.searchService.addProducts([productId]);
      } else {
        await this.searchService.deleteOneOrManyProducts([productId]);
      }
      await syncProduct({
        productAction: ProductActions.SYSTEM_STATUS_UPDATE,
        productId,
        status: isActivated ? ProductStatus.Active : ProductStatus.Idle,
      });
      return true;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          exception.message
        );
      }
    }
  }

  async GetProductsForProductService(productIds: string[]) {
    const [err, productsRes] = await this.productRepository.getProductsByIds(
      productIds
    );
    if (err) return [];

    const products = productsRes.result as ILegacyProductModel[];

    return products.map(elem => {
      return {
        id: elem?._id?.toString(),
        categories: [
          {
            id: elem?.category_id?.toString(),
            type: CategoryType.CATEGORY,
          },
          {
            id: elem?.brand_id?.toString(),
            type: CategoryType.BRAND,
          },
          {
            id: elem?.model_id?.toString(),
            type: CategoryType.MODEL,
          },
          {
            id: elem?.varient_id?.toString(),
            type: CategoryType.VARIANT,
          },
        ],
        groupListingId: elem?.listingGroupId?.toString(),
        imagesUrl: elem.product_images,
        description: elem.description,
        sellPrice: elem.sell_price,
        userId: elem.user_id,
        status: elem.status,
        score: elem.score,
        // sellType: '',
        statusSummary: {
          isApproved: elem.isApproved,
          isExpired: elem.isExpired,
          isDeleted: elem.status === ProductStatus.Delete,
          isReported: elem.isReported,
          isVerifiedByAdmin: elem.isVerifiedByAdmin,
          isFraudDetected: elem.isFraudDetected,
          // isSearchSync: elem.isSearchSync,
        },
      } as ProductForProductService;
    });
  }
  async activateProduct(userId: string, productId: string) {
    try {
      const [err, activateResult] =
        await this.productRepository.activateProduct(userId, productId);
      if (err) {
        return [err, activateResult];
      }
      await this.searchService.addProducts([productId]);
      return [err, activateResult];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          exception.message
        );
      }
    }
  }

  async getProductDetailsForPromoValidation(productId: string) {
    const [feedResponse, productResponse] = await Promise.all([
      this.feedRepository.getByProductId(productId),
      this.productRepository.getProductById(productId),
    ]);
    const [error, data] = productResponse;
    if (error) {
      throw error;
    }
    const result = data.result as ILegacyProductModel;
    const [errCat, category] = await this.categoryRepository.getById(
      result.category_id
    );
    let categories = [result.category_id];
    const categoryDocument = !errCat
      ? (category.result as CategoryDocument)
      : null;
    if (categoryDocument && categoryDocument.parent_super_category_id) {
      categories = [
        result.category_id,
        categoryDocument.parent_super_category_id,
      ];
    }
    return {
      sellPrice: result.sell_price,
      detailsForScopeValidation: {
        feeds: feedResponse.map(feed => feed.id),
        models: [result.model_id],
        categories: categories,
        sellers: [result.user_id],
        brands: [result.brand_id],
      },
    };
  }
  async checkIfgroupListingIsPopular(
    groupListingId?: string,
    updateCache?: boolean
  ) {
    const key = 'merchant_order_count';
    let result = await getCache<MerchantSoldCounts[]>(key);
    if (_isEmpty(result) || updateCache) {
      // this part will update the cached value and TS to resync some products
      const [, sysSettings] = await this.settingService.getSettingsObjectByKeys(
        ['trending_min_count', 'trending_number_of_days']
      );
      const numOfDays = sysSettings.trending_number_of_days || 10;
      const minCount = sysSettings.trending_min_count || 2;
      const date = moment().subtract(numOfDays, 'days').toDate();
      result = await this.orderRepository.getCountOfMerchantOrders(
        date,
        minCount
      );
      const ONE_DAY = 86400;

      setCache(key, result, ONE_DAY);
      const ids = ((result as MerchantSoldCounts[]) || []).map(elem => elem.id);
      if (ids?.length)
        await this.productRepository.getGroupListingProducts(ids);
    }
    const groupListing = ((result as MerchantSoldCounts[]) || []).find(
      (elem: MerchantSoldCounts) => elem.id.toString() === groupListingId
    );
    if (groupListing) return true;
    return false;
  }

  async countTodayAskQuestionsOfUser(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    return await this.productRepository.countAskQuestionsOfUserWithin(
      userId,
      moment().startOf('day'),
      moment().endOf('day')
    );
  }

  async countThisMonthAskQuestionsOfUser(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    return await this.productRepository.countAskQuestionsOfUserWithin(
      userId,
      moment().startOf('month'),
      moment().endOf('month')
    );
  }
}
