import { Types } from 'mongoose';
import Container, { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { PaginationDto } from '../dto/paginationDto';
import { ProductFilterDto } from '../dto/product/ProductFilterDto';
import {
  ProductFeed,
  ProductSortScoreData,
  SeachKeywords,
  SyncDataDto,
} from '../dto/search/syncDataDto';
import { AddonType } from '../enums/AddonType';
import { Cities } from '../enums/Cities.Enum';
import { ConditionValue } from '../enums/Condition';
import { FeedStatus } from '../enums/FeedStatus';
import { FeedType } from '../enums/FeedType';
import { ProductAccessSource } from '../enums/ProductAccessSource.Enum';
import { ProductSyncStatus } from '../enums/search/searchEnums';
import { getAddOns } from '../grpc/addon';
import { getProductCondition } from '../grpc/category';
import { GetAddonsRequest } from '../grpc/proto/addon/GetAddonsRequest';
import {
  GetProductCatConRequest,
  GetProductCatConResponse,
} from '../grpc/proto/category.pb';
import { AddMultipleItems, DeleteItems } from '../grpc/recommendation';
import { GetRatingSeller } from '../grpc/review';
import { GoogleServices } from '../libs/googleapis';
import { getSecretData } from '../libs/vault';
import { ChoiceDocument } from '../models/Choice';
import { ILegacyProductModel, ProductListData } from '../models/LegacyProducts';
import { Tag } from '../models/LegacyUser';
import { QuestionKey } from '../models/Question';
import { VariantDocument } from '../models/Variant';
import { FeedRepository } from '../repositories/FeedRepository';
import { ChoiceRepository } from '../repositories/choiceRepository';
import { QuestionRepository } from '../repositories/questionRepository';
import { ResponseRepository } from '../repositories/responseRepository';
import { SearchRepository } from '../repositories/searchRepository';
import { VariantRepository } from '../repositories/variantRepository';
import { mapAttributes } from '../util/attributes';
import { detectTextLang, formatPriceInDecimalPoints } from '../util/common';
import { generateGTIN } from '../util/googleGTIN';
import { isGreatDeal } from '../util/isGreatDeal';
import { syncUnsyncObjectReq } from '../util/searchTools';
import { ProductService } from './productService';
import { ResponseService } from './responseService';
import { SettingService } from './settingService';
import { VariantService } from './variantService';
import moment from 'moment';
@Service()
export class SearchService {
  searchRepository: SearchRepository;

  productService: ProductService;
  @Inject()
  variantService: VariantService;
  @Inject()
  responseService: ResponseService;
  @Inject()
  settingService: SettingService;
  @Inject()
  error: ErrorResponseDto;

  @Inject()
  responseRepository: ResponseRepository;

  @Inject()
  questionRepository: QuestionRepository;

  @Inject()
  choiceRepository: ChoiceRepository;
  @Inject()
  google: GoogleServices;
  @Inject()
  variantRepository: VariantRepository;

  @Inject()
  feedRepository: FeedRepository;

  constructor() {
    this.searchRepository = Container.get(SearchRepository);
    this.productService = Container.get(ProductService);
  }

  async addProducts(productIds: string[]) {
    if (productIds.length > 0) {
      const filter = {
        productIds: productIds,
        size: productIds.length,
      } as ProductFilterDto;
      return await this.getSyncData(filter);
    }
  }
  async getSyncData(filter: ProductFilterDto): Promise<any> {
    try {
      const [err, data] = await this.searchRepository.getSyncData(filter);
      if (err) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey =
          Constants.ERROR_MAP.FAILED_TO_GET_FILTERED_PRODUCTS;
        throw this.error;
      }
      const result = data.result as PaginationDto<ILegacyProductModel>;
      if (result.docs.length > 0) {
        const unsyncedProductsSet: string[] = [];
        const result = data.result as PaginationDto<ILegacyProductModel>;
        result.docs.map(item => {
          if (
            !item?.search_sync ||
            [
              ProductSyncStatus.UNSYNCED,
              ProductSyncStatus.UNSYNCED + '_' + process.env.PREFIX + '_dev',
            ].includes(item?.search_sync)
          ) {
            unsyncedProductsSet.push(item?._id);
          }
        });
        const typesenseProductsDto = await this.mapProductsToTypesenseDto(
          result.docs,
          filter?.highestBid
        );
        const [errSyncRes, syncRes] = await syncUnsyncObjectReq(
          'sync',
          typesenseProductsDto
        );
        if (errSyncRes || syncRes[0].errorCode !== 0) {
          return [];
        }
        const prodIDs: string[] = typesenseProductsDto.map((elem: any) => {
          return elem.productId;
        });
        if (prodIDs.length > 0) {
          await this.updateSearchData(prodIDs);
          result?.docs?.map((elem: any) => {
            if (process.env.NODE_ENV === 'production') {
              this.syncProductToGoogle(elem);
            }
            return elem.productId;
          });
        }

        // We need this to push data to Recommendation service
        try {
          const unsyncedProductsList = typesenseProductsDto.filter(item =>
            unsyncedProductsSet.includes(item.id)
          );
          AddMultipleItems(unsyncedProductsList).then(
            (response: { status: boolean }) => {
              if (!response.status) {
                console.log(
                  'Error while adding items to recommendation service'
                );
              }
            }
          );
        } catch (error) {
          console.log(
            'Error while adding items to recommendation service: ',
            error
          );
        }
        return syncRes;
      }

      return [];
    } catch (exception) {
      console.log('🚀 ~ SearchService ~ getSyncData ~ exception:', exception);
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
  async syncProductToGoogle(prod: any) {
    // eslint-disable-next-line max-len
    const link = `https://soum.sa/category/${prod?.categoryName}/product/${prod?.brandName}-${prod?.modelName}/${prod._id}`;
    const prodLink = link.replace(/ /g, '-').toLowerCase();
    const product = {
      offerId: prod._id,
      title: `${prod.arModelName} ${prod.arVariantName}`,
      description: prod.arVariantName,
      link: prodLink,
      imageLink: prod.productImages[0],
      contentLanguage: 'ar',
      targetCountry: 'SA',
      channel: 'online',
      availability: 'in stock',
      condition: prod.arGrade,
      price: {
        value: prod.sellPrice,
        currency: 'SAR',
      },
      brand: prod.brandId,
      gtin: generateGTIN(),
    };

    await this.google.insertProduct(product);
  }
  async updateSearchData(productIds: string[]) {
    const [err] = await this.searchRepository.updateSearchData(productIds);
    if (err) {
      this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_GET_FILTERED_PRODUCTS;
      throw this.error;
    }
  }
  async mapProductsToTypesenseDto(
    products: ILegacyProductModel[],
    highestBid: number = 0
  ) {
    // get all feeds that belong to this product as bulk
    const feeds = await this.feedRepository.getIntersectedFeeds(
      null,
      [FeedType.OFFERS],
      products.map((elem: any) => {
        return elem?._id ? elem._id : Types.ObjectId(elem.productId);
      })
    );
    const vaultSettings = await getSecretData('/secret/data/product');
    const priceFilters = vaultSettings['price_range'];
    const cities = vaultSettings['cities'];
    const categoryBestListingVariant =
      vaultSettings['categoryBestListingVariant'];

    const [, homeFeeds] = await this.feedRepository.getFeeds(
      [
        FeedType.HOME_PAGE,
        FeedType.MPP,
        FeedType.SPP,
        FeedType.BANNER,
        FeedType.BUDGET,
        FeedType.OFFERS,
      ],
      { size: 1000 }
    );
    const filteredProducts = await Promise.all(
      products.map(async (elem: any) => {
        const productId = elem?._id ? elem._id : elem.productId;
        const productData: ProductListData =
          await this.productService.productListData(elem);
        const searchData = await this.mapKeywords(elem);

        const priceRangeFilter = priceFilters
          ? this.getPriceRange(elem.sellPrice, elem.categoryName, priceFilters)
          : '';

        const categoryCondition = await getProductCondition({
          id: elem.conditionId,
          variantId: elem.varientId,
          sellPrice: elem.sellPrice,
        } as GetProductCatConRequest);

        const priceRange = categoryCondition?.priceQuality?.name || null;

        // const _batteryCapacity = await this.checkBatteryCapacity(productId);

        const [errResponseRes, responseRes] =
          await this.responseService.getFilterResponse(productId);

        const batteryCapacity = errResponseRes
          ? null
          : await this.checkBatteryCapacity(responseRes);

        const batteryRange = batteryCapacity?.batteryCapacity
          ? this.calculateBatteryRange(batteryCapacity?.batteryCapacity)
          : null;

        const accessories = errResponseRes
          ? null
          : await this.checkAccessories(responseRes);

        const hasWarranty = await this.hasWarranty(responseRes);

        const has10DayGuarantee = this.has10DayGuarantee(elem);

        const sort_score = await this.calculateSortScore({
          brand_position: elem.brandPosition,
          category_position: elem.categoryPosition,
          model_position: elem.modelPosition,
        } as ProductSortScoreData);

        const sortScoreV2 =
          (await this.sortScoreV2(elem, hasWarranty, sort_score)) || 0;
        const sortScoreV2DG =
          (await this.sortScoreV2DG(elem, hasWarranty, sort_score)) || 0;
        const sortScoreV3 =
          (await this.sortScoreV3(categoryCondition, elem, hasWarranty)) || 0;
        const [, variantRes] = await this.variantRepository.getById(
          elem.varientId
        );

        const varient: VariantDocument = variantRes.result as VariantDocument;
        const attributes = await mapAttributes(varient.attributes);

        const newAttr = attributes.map(attribute => {
          return {
            title: attribute.title,
            value: attribute.value,
            iconURL:
              attribute.iconURL ||
              `${process.env.IMAGES_AWS_S3_ENDPOINT_CDN}/${process.env.DEFAULT_VARIENT_CAR_ICON}`,
          };
        });
        const attributesObjEnFilters = attributes.reduce(
          (result: any, item: any) => {
            const key = item.title.enName;
            result[key] = item.value.enName;
            return result;
          },
          {}
        );

        const attributesObjArFilters = attributes.reduce(
          (result: any, item: any) => {
            const key = item.title.arName;
            result[key] = item.value.arName;
            return result;
          },
          {}
        );
        const attributesObjCleanedEn: any = this.removeSkippedAttributes(
          attributesObjEnFilters
        );
        const attributesObjCleanedAr: any = this.removeSkippedAttributes(
          attributesObjArFilters
        );
        const attributesObjEn: any =
          this.transformAttributesEn(attributes) || {};
        const attributesObjAr: any =
          this.transformAttributesAr(attributes) || {};

        const text_questions_ans = elem?.text_answer
          ? elem?.text_answer[0]
          : '';

        let expressDeliveryBadge = false;

        if (elem.isConsignment) {
          expressDeliveryBadge = true;
        } else {
          expressDeliveryBadge =
            await this.productService.checkExpressDeliveryFlag({
              sellerId: elem.sellerId.toString(),
              productId: productId.toString(),
            });
        }
        const filtersEn = Object.keys(attributesObjCleanedEn);
        const filtersAr = Object.keys(attributesObjCleanedAr);

        if (elem.categoryName !== 'Cars') {
          filtersEn.push('Ship From');
          filtersAr.push('الشحن من');
        }

        if (categoryCondition?.condition) {
          filtersEn.push('Condition');
          filtersAr.push('الحالة');
        }

        if (batteryRange) {
          filtersEn.push('Battery');
          filtersAr.push('البطارية');
        }

        const addonsRes =
          (await getAddOns({
            modelId: elem?.modelId,
            price: elem.sellPrice,
          } as GetAddonsRequest)) || null;

        addonsRes?.addons?.filter(addon => {
          if (
            addon.type === AddonType.ACCESSORY &&
            (elem?.sellerCity === Cities.RIYADH ||
              elem?.sellerCity === Cities.RIYADH_AR)
          ) {
            accessories?.accessoriesAr?.push(addon.nameAr);
            accessories?.accessoriesEn?.push(addon.nameEn);
          }
        });

        const rating = await GetRatingSeller({ sellerId: elem.sellerId });

        const feedNames = await this.findFeedNames(homeFeeds.result, productId);

        const feed = (feeds || []).find(feed =>
          feed?.items.map(elem => elem.productId).includes(productId)
        );
        let productFeed: ProductFeed = null;
        let promoCode = null;
        let discount = 0;
        const isActiveIteam = feed?.items?.find(
          feedItem =>
            feedItem.status == FeedStatus.Active &&
            feedItem.productId.toString() === productId.toString()
        );
        const isFeedIteam = feed && isActiveIteam;
        if (isFeedIteam) {
          productFeed = {
            id: feed._id?.toString(),
            arName: feed.arName,
            enName: feed.enName,
            arTitle: feed.arTitle,
            enTitle: feed.enTitle,
            expiryDate: feed.expiryDate?.toISOString(),
          };

          promoCode = await this.productService.getPromoCodeToApply({
            applyDefaultPromo: false,
            feedId: productFeed?.id || null,
          });

          if (promoCode && productFeed) {
            productFeed.promoCode = promoCode.code;
          }
        }

        const [errSettings, sysSettings] =
          await this.settingService.getSettingsObjectByKeys([
            'delivery_fee',
            'delivery_threshold',
            'apply_delivery_fee',
            'apply_referral_codes',
            'referral_discount_type',
            'referral_percentage',
            'referral_fixed_amount',
            'vat_percentage',
            'apply_delivery_fee_mpps',
            'apply_delivery_fee_spps',
          ]);
        if (errSettings) throw new Error('settings was not found');
        const commissionSummaries =
          await this.productService.calculateSummaryCommission({
            product: {
              id: productId.toString(),
              sellPrice: elem.sellPrice,
              modelId: elem.modelId,
              varientId: elem.varientId,
              categoryId: elem.categoryId,
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

        if (promoCode && isFeedIteam) {
          const GT_Before =
            commissionSummaries[0]?.withoutPromo?.grandTotal || 0;
          const GT_After =
            commissionSummaries[0]?.withPromo?.grandTotal ||
            commissionSummaries[0]?.withoutPromo?.grandTotal;
          discount = Number(GT_Before) - Number(GT_After);
        }

        const deliveryFee = sysSettings?.delivery_fee;

        const cityMapping = this.getCityMapping(cities, elem.sellerCity);

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

        const syncData = {
          id: productId,
          productId: productId,
          grade: elem.grade,
          arGrade: elem.arGrade,
          modelId: elem.modelId,
          categoryId: elem.categoryId,
          brandId: elem.brandId,
          variantId: elem.varientId,
          modelName: elem.modelName,
          arModelName: elem.arModelName,
          variantName: elem.variantName,
          arVariantName: elem.arVariantName,
          originalPrice: elem.originalPrice,
          sellPrice: elem.sellPrice,
          completion_rate: elem.sellerRate,
          productImage: elem.productImages ? elem.productImages[0] : null,
          sellerId: elem.sellerId,
          createdDate: elem.createdDate,
          tags: productData.tags,
          attributes: newAttr,
          isGreatDeal: elem.conditions
            ? isGreatDeal(elem.grade, elem.sellPrice, elem.conditions)
            : false,
          keywords_en: searchData.keywordsEn,
          keywords_ar: searchData.keywordsAr,
          model_position: searchData.modelPosition,
          category_position: searchData.categoryPosition,
          brand_position: searchData.brandPosition,
          price_range: priceRange,
          model_image: elem.modelImage,
          listingQuantity: elem.listingQuantity,
          sellerRating: elem.sellerRating,
          isUAE_listing: elem.isUAE_listing,
          reviewerRating: rating?.stars || 0,
          sellerCityAr: cityMapping?.sellerCityAr,
          sellerCityEn: cityMapping?.sellerCityEn,
          battery_capacity: batteryCapacity?.batteryCapacity,
          sort_score: sort_score,
          product_images: elem.productImages,
          condition: categoryCondition?.condition
            ? {
                id: categoryCondition.condition.id,
                name: categoryCondition.condition.name,
                nameAr: categoryCondition.condition.nameAr,
                labelColor: categoryCondition.condition.labelColor,
                textColor: categoryCondition.condition.textColor,
              }
            : null,
          text_questions_ans: text_questions_ans,
          sortScoreV2: sortScoreV2 || 0,
          sortScoreV2DG: sortScoreV2DG || 0,
          sortScoreV3: sortScoreV3 || 0,
          isUpranked: elem?.isUpranked || false,
          brandName: elem?.brandName,
          arBrandName: elem?.arBrandName,
          filtersEn: filtersEn?.sort() ?? filtersEn,
          filtersAr:
            filtersAr?.sort((a, b) => a.localeCompare(b, 'ar')) ?? filtersAr,
          priceRange: priceRangeFilter,
          showSecurityBadge: elem?.seller?.hasOptedForSF || false,
          discount,
          productFeed,
          expressDeliveryBadge,
          categoryName: elem.categoryName,
          arCategoryName: elem.arCategoryName,
          collectionEn: feedNames?.enCollections,
          collectionAr: feedNames?.arCollections,
          extraFees: formatPriceInDecimalPoints(commissionAndVat) || 0,
          deliveryFee: deliveryFee || 0,
          grandTotal: grandTotal,
          collections: feedNames?.collections,
          collectionIds: feedNames?.collectionIds,
          isConsignment: elem.isConsignment,
          createdAt: moment(elem.createdDate).unix(),
        } as SyncDataDto;

        const fastFilters = [];

        if (expressDeliveryBadge) {
          fastFilters.push('expressDeliveryBadge');
        }

        if (Number(rating?.stars) >= 4) {
          (syncData.fourPlusStarSeller = true),
            fastFilters.push('fourPlusStarSeller');
        }

        if (elem.isMerchant) {
          syncData.isMerchant = true;
          fastFilters.push('isMerchant');
        }

        if (hasWarranty) {
          syncData.hasWarranty = true;
          fastFilters.push('hasWarranty');
        }

        if (has10DayGuarantee) {
          syncData.has10DayGuarantee = true;
          fastFilters.push('has10DayGuarantee');
        }

        if (elem?.isBiddingProduct && elem?.billingSettings?.activate_bidding) {
          syncData.activate_bidding = elem?.billingSettings?.activate_bidding;
          syncData.start_bid = elem?.billingSettings?.start_bid;
          syncData.highest_bid =
            highestBid > 0 ? highestBid : elem?.billingSettings?.start_bid;
        }

        type FilterObject = {
          [key: string]: string;
        };

        const createAccessoriesObject = (
          filters: string[] | undefined
        ): FilterObject => {
          return (filters || []).reduce((acc, filter) => {
            acc[filter] = filter;
            return acc;
          }, {} as FilterObject);
        };

        if (fastFilters.length > 0) {
          syncData.fastFilters = fastFilters;
        }

        const filterObjectEn = createAccessoriesObject(
          accessories?.accessoriesEn
        );
        const filterObjectAr = createAccessoriesObject(
          accessories?.accessoriesAr
        );

        const bestListingData = await this.getBestListingData(
          elem?.categoryId,
          categoryBestListingVariant
        );
        let typesenseData = {
          ...syncData,
          ...attributesObjCleanedEn,
          ...attributesObjCleanedAr,
          ...attributesObjEn,
          ...attributesObjAr,
          ...filterObjectEn,
          ...filterObjectAr,
          ...bestListingData,
        };

        typesenseData['Ship From'] = elem?.isUAE_listing
          ? 'UAE'
          : 'Saudi Arabia';
        typesenseData['الشحن من'] = elem?.isUAE_listing
          ? 'الإمارات'
          : 'المملكة العربية السعودية';

        if (categoryCondition?.condition) {
          typesenseData = {
            ...typesenseData,
            Condition: categoryCondition?.condition?.name,
            الحالة: categoryCondition?.condition?.nameAr,
            'الحالة.arKey': categoryCondition?.condition?.nameAr,
            'Condition.enKey': categoryCondition?.condition?.name,
            'الحالة.positionAr': categoryCondition?.condition?.positionAr,
            'Condition.positionEn': categoryCondition?.condition?.positionEn,
          };
        }

        if (
          accessories?.accessoriesEn?.length > 0 ||
          accessories.accessoriesEn?.length > 0
        ) {
          filtersEn.push('Accessories');
          filtersAr.push('الإكسسوارات');
          typesenseData.Accessories = accessories?.accessoriesEn;
          typesenseData.الإكسسوارات = accessories?.accessoriesAr;
        }

        if (batteryRange) {
          typesenseData = {
            ...typesenseData,
            Battery: batteryRange,
            البطارية: batteryRange,
            'البطارية.arKey': batteryRange,
            'Battery.enKey': batteryRange,
            'البطارية.positionAr': batteryCapacity?.positionAr || 1000,
            'Battery.positionEn': batteryCapacity?.positionEn || 10000,
          };
        }

        if (elem.categoryName === 'Cars') {
          if (attributesObjCleanedEn?.Year) {
            filtersEn.push('Payment Options');
            filtersAr.push('طرق الشراء');
            const currentYear = new Date().getFullYear();
            const year = attributesObjCleanedEn?.Year;
            typesenseData = {
              ...typesenseData,
              'طرق الشراء.arKey':
                currentYear - Number(year) > 4 ? 'كاش' : 'كاش وتمويل',
              'Payment Options.enKey':
                currentYear - Number(year) > 4 ? 'Cash' : 'Cash & Finance',
              'طرق الشراء':
                currentYear - Number(year) > 4 ? 'كاش' : 'كاش وتمويل',
              'Payment Options':
                currentYear - Number(year) > 4 ? 'Cash' : 'Cash & Finance',
              'طرق الشراء.positionAr': 1,
              'Payment Options.positionEn': 1,
            };
          }

          if (elem?.brandName) {
            typesenseData = {
              ...typesenseData,
              'ماركة السيارة.arKey': elem?.arBrandName,
              'Car Brand.enKey': elem?.brandName,
              'ماركة السيارة': elem?.arBrandName,
              'Car Brand': elem?.brandName,
              'ماركة السيارة.positionAr': 2,
              'Car Brand.positionEn': 2,
            };
          }

          if (categoryCondition?.condition) {
            filtersEn.push('Condition');
            filtersAr.push('الحالة');
          }
        }
        return typesenseData;
      })
    );
    return filteredProducts;
  }
  async getBestListingData(
    categoryId: string,
    categoryBestListingVariant: string
  ) {
    try {
      const categoryBestListingVariantObj = JSON.parse(
        categoryBestListingVariant
      );

      const category = categoryBestListingVariantObj.find((item: any) => {
        return item.categoryId == categoryId;
      });
      if (category) {
        return {
          bestListingVariantsEn: category.bestListingVariantsEn,
          bestListingVariantsAr: category.bestListingVariantsAr,
          retrieveUpTo: category.retrieveUpTo,
        };
      } else {
        return {};
      }
    } catch (error) {
      console.log('getBestListingData err::', error);
      return {};
    }
  }

  async findFeedNames(feeds: any[], productId: string) {
    const arCollections: string[] = [];
    const enCollections: string[] = [];
    const collections: ProductFeed[] = [];
    const collectionIds: string[] = [];

    feeds?.forEach(feed => {
      feed?.items?.forEach((item: any) => {
        if (
          item.productId.toString().normalize() ===
          productId.toString().normalize()
        ) {
          arCollections.push(feed.arName);
          enCollections.push(feed.enName);
          if (feed.feedType != FeedType.BANNER) {
            collectionIds.push(feed?._id);
            collections.push({
              id: feed?._id,
              feedType: feed?.feedType,
              position: feed?.position,
              arName: feed?.arName,
              enName: feed?.enName,
              enTitle: feed?.enTitle,
              arTitle: feed?.arTitle,
              expiryDate: feed?.expiryDate,
              promoCode: feed?.promoCode,
            } as ProductFeed);
          }
        }
      });
    });

    return {
      collectionIds,
      enCollections,
      arCollections,
      collections,
    };
  }
  transformAttributesAr(attributes: any) {
    const result: Record<string, any | number> = {};
    const skipValues = ['Skip', 'Next', 'التالي', 'تخطي', '-']; // List of values to skip
    const skipTitles = [
      'القير',
      'القيادة',
      'تصنيف حجم السيارة',
      'نوع الوقود',
      'اسطوانات',
      'سعة المحرك',
      'المحرك الكهربائي',
    ];

    attributes.forEach((attribute: any) => {
      const { title, value, positionAr } = attribute;

      // Skip if value.arName is in the skip list
      if (
        skipValues.includes(value.arName) ||
        skipTitles.includes(title.arName)
      ) {
        return;
      }

      result[title.arName] = value.arName;
      result[`${title.arName}.arKey`] = value.arName;
      result[`${title.arName}.positionAr`] = positionAr;
    });

    return result;
  }

  transformAttributesEn(attributes: any) {
    const result: Record<string, any | number> = {};
    const skipValues = ['Skip', 'Next', 'التالي', 'تخطي', '-']; // List of values to skip
    const skipTitles = [
      'Transmission',
      'Drive',
      'Fuel Type',
      'Cylinders',
      'Engine displacement',
      'Electric motor',
      'Vehicle Size Class',
    ];
    attributes.forEach((attribute: any) => {
      const { title, value, positionEn } = attribute;

      // Skip if value.enName is in the skip list
      if (
        skipValues.includes(value.enName) ||
        skipTitles.includes(title.enName)
      ) {
        return;
      }

      result[title.enName] = value.enName;
      result[`${title.enName}.enKey`] = value.enName;
      result[`${title.enName}.positionEn`] = positionEn;
    });

    return result;
  }
  removeSkippedAttributes(obj: Record<string, string>): Record<string, string> {
    const skipValues = ['Skip', 'Next', 'التالي', 'تخطي', '-'];
    const skipTitles = [
      'Car Model',
      'Transmission',
      'Drive',
      'Fuel Type',
      'Cylinders',
      'Engine displacement',
      'Electric motor',
      'Vehicle Size Class',
      'طراز السيارة',
      'القير',
      'القيادة',
      'تصنيف حجم السيارة',
      'نوع الوقود',
      'اسطوانات',
      'سعة المحرك',
      'المحرك الكهربائي',
    ];

    const cleanedObj: Record<string, string> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (!skipValues.includes(value) && !skipTitles.includes(key)) {
        cleanedObj[key] = value;
      }
    }
    return cleanedObj;
  }
  getCityMapping(citiesList: any, sellerCity: string): any {
    try {
      const lang = detectTextLang(sellerCity);
      const cities = JSON.parse(citiesList);
      const city = cities.find((city: any) => {
        return lang === 'en'
          ? city.name_en === sellerCity
          : city.name_ar === sellerCity;
      });

      if (city) {
        return {
          sellerCityEn: city.name_en,
          sellerCityAr: city.name_ar,
        };
      }
    } catch (error) {
      return null;
    }
  }
  getPriceRange(
    sellPrice: number,
    categoryName: string,
    priceFilters: string
  ): string {
    const priceRanges = JSON.parse(priceFilters);
    const category = priceRanges.find(
      (cat: { categoryName: string }) => cat.categoryName === categoryName
    );

    if (!category) {
      return '';
    }

    const { minPrice, maxPrice } = category;
    const priceRangeSize = (maxPrice - minPrice) / 20;

    const formatPriceRange = (min: number, max: number) =>
      `${Math.round(min)}-${Math.round(max)}`;

    for (let i = 0; i < 20; i++) {
      const rangeMin = minPrice + i * priceRangeSize;
      const rangeMax = rangeMin + priceRangeSize;

      if (sellPrice >= rangeMin && sellPrice <= rangeMax) {
        return formatPriceRange(rangeMin, rangeMax);
      }
    }

    return formatPriceRange(minPrice, maxPrice);
  }

  async checkAccessories(responses: any): Promise<{ [key: string]: string[] }> {
    try {
      const filtered_products = responses?.filter(
        (item: Record<string, any>) =>
          item?.question_key === QuestionKey.ACCESSORIES &&
          item?.answers[0] !== ''
      );

      if (filtered_products?.length > 0) {
        return this.extractAccessoryFilters(filtered_products[0]?.answers[0]);
      }

      return { accessoriesEn: [], accessoriesAr: [] };
    } catch (err) {
      return null;
    }
  }

  extractAccessoryFilters(accessories: any): {
    accessoriesEn: string[];
    accessoriesAr: string[];
  } {
    const accessoriesEn: string[] = [];
    const accessoriesAr: string[] = [];

    accessories?.sub_choices?.forEach((choice: ChoiceDocument) => {
      accessoriesEn.push(choice.option_en);
      accessoriesAr.push(choice.option_ar);
    });

    return {
      accessoriesEn,
      accessoriesAr,
    };
  }
  async clearProductSyncStatus(productIds: string[]) {
    return this.searchRepository.clearProductSyncStatus(productIds);
  }

  async mapKeywords(product: any): Promise<SeachKeywords> {
    return {
      keywordsAr: [
        product?.arCategoryName,
        product?.arBrandName,
        product?.arModelName,
      ],
      keywordsEn: [
        product?.categoryName,
        product?.brandName,
        product?.modelName,
      ],
      modelPosition: product?.modelPosition,
      brandPosition: product?.brandPosition,
      categoryPosition: product?.categoryPosition,
    };
  }
  calculateBatteryRange(batteryCapacity: number): string {
    if (batteryCapacity >= 95) {
      return '+95%';
    } else if (batteryCapacity >= 90 && batteryCapacity < 95) {
      return '90% - 95%';
    } else if (batteryCapacity >= 85 && batteryCapacity < 90) {
      return '85% - 90%';
    } else if (batteryCapacity >= 80 && batteryCapacity < 85) {
      return '80% - 85%';
    } else if (batteryCapacity >= 75 && batteryCapacity < 80) {
      return '75% - 80%';
    } else if (batteryCapacity < 75) {
      return 'Less than 75%';
    }
    return '';
  }
  async checkBatteryCapacity(responses: any): Promise<any> {
    try {
      const filtered_products = responses.filter(
        (item: Record<string, any>) =>
          item.question_key === QuestionKey.BATTERY && item.choices.length > 0
      );

      if (filtered_products.length > 0 && filtered_products[0]?.choices[0]) {
        const batteryCapacity = parseInt(
          filtered_products[0]?.choices[0]?.option_en
        );
        return {
          batteryCapacity: batteryCapacity,
          positionEn:
            batteryCapacity > 94
              ? 1
              : filtered_products[0]?.choices[0].position_en,
          positionAr:
            batteryCapacity > 94
              ? 1
              : filtered_products[0]?.choices[0].position_ar,
        };
      }
      return null;
    } catch (err) {
      return null;
    }
  }
  async deleteOneOrManyProducts(productIds: string[]) {
    productIds = await this.getUnAvailableProducts(productIds);
    if (productIds.length > 0) {
      const search_sync =
        process.env.NODE_ENV === 'production'
          ? ProductSyncStatus.UNSYNCED
          : ProductSyncStatus.UNSYNCED + '_' + process.env.PREFIX + '_dev';

      const [errSyncRes, syncRes] = await syncUnsyncObjectReq(
        'unsync',
        productIds
      );

      if (errSyncRes || syncRes[0].errorCode !== 0) {
        return [];
      }

      !errSyncRes &&
        (await this.searchRepository.updateProductSyncStatus(
          productIds,
          search_sync
        ));
      // Delete items from recommendation engine
      try {
        DeleteItems({ itemIds: productIds }).then(
          (response: { status: boolean }) => {
            if (!response.status) {
              console.log('Error while adding items to recommendation service');
            }
          }
        );
      } catch (error) {
        console.log(
          'Error while adding items to recommendation service: ',
          error
        );
      }

      if (process.env.NODE_ENV === 'production') {
        const deletePromises = productIds.map(productId => {
          this.google.removeProduct(`online:ar:SA:${productId}`);
        });

        try {
          await Promise.all(deletePromises);
        } catch (error) {
          console.error('Error removing products:', error.message);
        }
      }

      return productIds;
    }
    return [];
  }
  async getUnAvailableProducts(productIds: string[]) {
    try {
      const [err, data] = await this.searchRepository.getUnAvailableProducts(
        productIds
      );
      if (err) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey =
          Constants.ERROR_MAP.FAILED_TO_PUSH_PRODUCTS_TO_SEARCH;
        throw this.error;
      }

      return (data.result as string[]) || [];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_PUSH_PRODUCTS_TO_SEARCH,
          exception.message
        );
      }
    }
  }

  async updateHighestBid(productIds: string[], bid?: number) {
    if (productIds.length == 0) {
      return null;
    }

    const filter = {
      productIds: productIds,
      size: productIds.length,
      highestBid: bid,
    } as ProductFilterDto;

    return await this.getSyncData(filter);
  }
  async sortScoreV2(
    product: any,
    hasWarranty: boolean,
    sortScore: number
  ): Promise<number> {
    // product_sort_score_v2  = (0.5 × B) +(0.3 × (Q × 10)) + (0.1 × W) + (0.1 × S)
    const { buyerSurplus, imagesQualityScore, activeWarranty } =
      await this.calculateScores(product, hasWarranty);

    const score =
      0.5 * buyerSurplus +
      0.3 * (imagesQualityScore * 10) +
      0.1 * activeWarranty +
      0.1 * sortScore;

    return score;
  }

  async sortScoreV2DG(
    product: any,
    hasWarranty: boolean,
    sortScore: number
  ): Promise<number> {
    // (0.5 × B) +(0.3 × (Q × 10)) + (0.1 × W) + (0.1 × S) + (10DG × 1.75)
    const { buyerSurplus, imagesQualityScore, activeWarranty } =
      await this.calculateScores(product, hasWarranty);
    let dg10 = 0;
    if (
      product?.tags?.some((tag: Tag) => tag?.name === 'soumChoice') ||
      product?.isConsignment
    ) {
      dg10 = 100;
    }

    const score =
      0.5 * buyerSurplus +
      0.3 * (imagesQualityScore * 10) +
      0.1 * activeWarranty +
      0.1 * sortScore +
      1.75 * dg10;

    return score;
  }
  async sortScoreV3(
    categoryCondition: GetProductCatConResponse,
    product: any,
    hasWarranty: boolean
  ): Promise<number> {
    const condition = categoryCondition?.condition
      ? categoryCondition?.condition?.name
      : null;

    const greatDeal = product?.conditions
      ? isGreatDeal(product?.grade, product?.sellPrice, product?.conditions)
      : false;

    let sortScoreV3 = 0;
    sortScoreV3 += product?.isMerchant ? 20 : 0;
    sortScoreV3 += greatDeal ? 5 : 0;
    sortScoreV3 += hasWarranty ? 10 : 0;
    sortScoreV3 += product?.isUpranked ? 10 : 0;

    if (condition === ConditionValue.LIKE_NEW) {
      sortScoreV3 += 50;
    } else if (condition === ConditionValue.EXCELLENT) {
      sortScoreV3 += 40;
    } else if (condition === ConditionValue.REFURBISHED_ORIGINAL_PARTS) {
      sortScoreV3 += 30;
    } else if (condition === ConditionValue.REFURBISHED) {
      sortScoreV3 += 20;
    } else if (condition === ConditionValue.LIGHTLY_USED) {
      sortScoreV3 += 10;
    } else if (condition === ConditionValue.EXTENSIVE_USE) {
      sortScoreV3 += 5;
    }

    return sortScoreV3;
  }

  has10DayGuarantee(product: any): boolean {
    if (!product) {
      return false;
    }

    const hasSoumChoiceTag =
      product.tags?.some((tag: Tag) => tag?.name === 'soumChoice') ?? false;
    const isConsignment = product.isConsignment ?? false;

    return hasSoumChoiceTag || isConsignment;
  }
  async hasWarranty(responses: any): Promise<boolean> {
    try {
      const hasWarranty = responses?.some((item: Record<string, any>) => {
        return (
          item.question_key === QuestionKey.WARRANTY &&
          item.choices.length > 0 &&
          item.choices[0].option_en !== "There's no warranty"
        );
      });

      return hasWarranty;
    } catch (err) {
      return false;
    }
  }
  private async warrantyScore(hasWarranty: boolean) {
    const scoreWithWarranty = 100;
    const scoreWithoutWarranty = 0;
    if (hasWarranty) {
      return scoreWithWarranty;
    }
    return scoreWithoutWarranty;
  }
  private async calculateScores(
    product: any,
    hasWarranty: boolean
  ): Promise<{
    buyerSurplus: number;
    imagesQualityScore: number;
    activeWarranty: number;
  }> {
    const recommendedPrice = Number(product?.originalPrice) || 0;
    const sellPrice = Number(product?.sellPrice) || 0;
    const buyerSurplus =
      recommendedPrice === 0 ? 0 : recommendedPrice - sellPrice;

    const imagesQualityScore = Number(product?.imagesQualityScore) || 0;
    const activeWarranty = await this.warrantyScore(hasWarranty);

    return { buyerSurplus, imagesQualityScore, activeWarranty };
  }
  async calculateSortScore(sortData: ProductSortScoreData): Promise<number> {
    // brand_score: 40%
    // category_score: 40%
    // model_score: 20%

    const { brand_position, category_position, model_position } = sortData;
    let score = 0;
    if (brand_position) {
      score = 40 / brand_position;
    }

    if (category_position) {
      score = score + 40 / category_position;
    }

    if (model_position) {
      score = score + 20 / model_position;
    }
    return parseFloat(score.toFixed(2));
  }

  // cleanup unavailable products missed by the cronjob
  async cleanUp() {
    try {
      const [err, data] = await this.searchRepository.cleanUp();
      if (err) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey =
          Constants.ERROR_MAP.FAILED_TO_PUSH_PRODUCTS_TO_SEARCH;
        throw this.error;
      }
      const productIds = data.result as string[];
      if (productIds.length > 0) {
        const search_sync =
          process.env.NODE_ENV === 'production'
            ? ProductSyncStatus.UNSYNCED
            : ProductSyncStatus.UNSYNCED + '_' + process.env.PREFIX + '_dev';

        const [errSyncRes, syncRes] = await syncUnsyncObjectReq(
          'unsync',
          productIds
        );
        if (errSyncRes || syncRes[0].errorCode !== 0) {
          return [];
        }

        !errSyncRes &&
          (await this.searchRepository.updateProductSyncStatus(
            productIds,
            search_sync
          ));
      }
      return productIds;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_PUSH_PRODUCTS_TO_SEARCH,
          exception.message
        );
      }
    }
  }
}
