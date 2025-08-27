import { Types, isValidObjectId } from 'mongoose';
import Container, { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { CreateFeedDto } from '../dto/AdminCollection/CreateFeedDto';
import { FeedItemDto } from '../dto/AdminCollection/FeedItemDto';
import { GetAdminFeedItemDto } from '../dto/AdminCollection/GetAdminFeedItemDto';
import { GetAdminFullFeedDto } from '../dto/AdminCollection/GetAdminFullFeedDto';
import { GetFeedDto } from '../dto/AdminCollection/GetFeedDto';
import { GetFeedItemDto } from '../dto/AdminCollection/GetFeedItemDto';
import { GetFullFeedDto } from '../dto/AdminCollection/GetFullFeedDto';
import { UpdateFeedDto } from '../dto/AdminCollection/UpdateFeedDto';
import { UpdateFeedStatusDto } from '../dto/AdminCollection/UpdateFeedStatusDto';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { CategoryType } from '../enums/CategoryType';
import { FeedStatus } from '../enums/FeedStatus';
import { FeedType } from '../enums/FeedType';
import { getFeedPromos } from '../grpc/commission';
import { DetailedPromoCode } from '../grpc/proto/commission/DetailedPromoCode';
import { ProductAccessSource } from '../enums/ProductAccessSource.Enum';
import { ProductFeedStatus } from '../enums/ProductFeedStatus';
import { ProductOrderStatus, ProductStatus } from '../enums/ProductStatus.Enum';
import { UpdateAction } from '../enums/UpdateAction';
import { getConditions } from '../grpc/category';
import { getProductDataForFeeds } from '../grpc/productMicroService';
import { Product } from '../grpc/proto/product/Product';
import { PromoCode } from '../grpc/proto/product/PromoCode';
import { getProductDataForFeedsReq } from '../grpc/proto/product/getProductDataForFeedsReq';
import { JobTypes } from '../libs/bull.util';
import { BullMQService, Queues } from '../libs/bullmq.util';
import { deleteWithPattern } from '../libs/redis';
import { FeedDocument, FeedItem } from '../models/Feed';
import { ILegacyProductModel } from '../models/LegacyProducts';
import { PromoCodeScopeTypeEnum } from '../models/LegacyPromoCode';
import { VariantDocument } from '../models/Variant';
import { FeedRepository } from '../repositories/FeedRepository';
import {
  ProductRepoFilters,
  ProductRepository,
} from '../repositories/productRepository';
import { VariantRepository } from '../repositories/variantRepository';
import { SearchService } from '../services/searchService';
import { mapAttributes } from '../util/attributes';
import { ProductService } from './productService';
import { SettingService } from './settingService';

@Service()
export class FeedService {
  @Inject()
  variantRepository: VariantRepository;
  bullMQService: BullMQService;
  constructor(
    public feedRepository: FeedRepository,
    public productRepository: ProductRepository,
    public settingService: SettingService,
    public productService: ProductService,
    public searchService: SearchService,
    public error: ErrorResponseDto
  ) {
    this.bullMQService = Container.get(BullMQService);
  }

  async getFeedById(feedId: string) {
    try {
      const [err, data] = await this.feedRepository.getFullFeedById(feedId);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const fullFeedDto: GetAdminFullFeedDto = this.mapToAdminFullFeedDto(
        data.result as any
      );
      return fullFeedDto;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          exception.message
        );
      }
    }
  }
  async getFeeds(
    feedTypes: FeedType[],
    productRepoFilters: ProductRepoFilters,
    category: string = '',
    getBothTypes: boolean = true
  ) {
    try {
      // await this.deactivateOfferFeeds();
      const [err, data] = await this.feedRepository.getFeeds(
        feedTypes,
        productRepoFilters,
        category,
        getBothTypes
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const feedDto: GetFullFeedDto[] = await this.mapToFeedDto(
        (data.result as GetFullFeedDto[]) || []
      );
      return feedDto;
    } catch (exception) {
      console.log('feedService ', exception);
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          exception.message
        );
      }
    }
  }
  async getFeedByIdForSoumUser(feedId: string, page: number, size: number) {
    try {
      // await this.deactivateOfferFeeds();
      const [err, data] = await this.feedRepository.getFeedByIdForSoumUser(
        feedId,
        page,
        size
      );
      const totalActiveProducts = await this.feedRepository.getTotalActiveItem(
        feedId
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const fullFeedDto: GetFullFeedDto = await this.mapToFullFeedDto(
        data.result as any
      );
      fullFeedDto.totalActiveProducts = totalActiveProducts;
      return fullFeedDto;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          exception.message
        );
      }
    }
  }
  async validateProductToCollection(
    productIds: string[],
    categoryId: string = '',
    isCategorySpecific: boolean = false
  ) {
    try {
      const [err, data] = await this.productRepository.getProductsByIds(
        productIds
      );
      if (err) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND;
        this.error.message = Constants.MESSAGE.PRODUCT_ID_NOT_FOUND;
        throw this.error;
      }
      const products = data.result as ILegacyProductModel[];
      const validProducts: GetAdminFeedItemDto[] = [];
      products.map(elem => {
        if (
          elem.sell_status == ProductOrderStatus.Available &&
          elem.status == ProductStatus.Active &&
          elem.expiryDate >= new Date()
        ) {
          if (
            isCategorySpecific === false &&
            categoryId.toString() !== elem.category_id.toString()
          ) {
            validProducts.push(this.mapProductToGetAdminFeedItemDto(elem));
          } else if (
            isCategorySpecific === true &&
            categoryId.toString() === elem.category_id.toString()
          ) {
            validProducts.push(this.mapProductToGetAdminFeedItemDto(elem));
          }
        }
      });
      return validProducts;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_VALIDATE_PRODUCT,
          exception.message
        );
      }
    }
  }
  async getAllFeeds(type: string, category: string = '') {
    try {
      // await this.deactivateOfferFeeds();
      const [errFeed, feeds] = await this.feedRepository.getAllSummary(
        type,
        category
      );
      if (errFeed) {
        this.error.errorCode = feeds.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = feeds.result.toString();
        this.error.message = feeds.message;
        throw this.error;
      }
      return feeds.result as FeedDocument[];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          exception.message
        );
      }
    }
  }
  async getAllFeedsForListing(
    type: string,
    clientType: string = '',
    category: string = ''
  ): Promise<GetFeedDto[]> {
    try {
      const FeedDocuments = await this.getAllFeeds(type, category);
      return this.mapToGetFeedDto(FeedDocuments, type, clientType);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          exception.message
        );
      }
    }
  }

  async createNewFeed(
    createFeedDto: CreateFeedDto
  ): Promise<string | FeedDocument> {
    try {
      const [errValid, message] = await this.validateCreateDto(createFeedDto);
      if (errValid) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_CREATE_FEED;
        this.error.message = message;
        throw this.error;
      }

      const countFeeds = await this.feedRepository.feedsCount(
        createFeedDto.feedType,
        createFeedDto.feedCategory
      );
      if (countFeeds < 15) {
        const feedDocument: FeedDocument = this.mapToFeedDocument(
          createFeedDto,
          null
        );
        feedDocument.position = countFeeds + 1;
        const [err, data] = await this.feedRepository.createOne(feedDocument);
        if (err) {
          this.error.errorCode = data.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = data.result.toString();
          this.error.message = data.message;
          throw this.error;
        }

        const productIDs = feedDocument?.items?.map(
          (product: any) => product?.productId
        );
        await this.searchService.addProducts(productIDs);

        if (createFeedDto.feedType === FeedType.OFFERS) {
          await this.removeIntersection(data.result as FeedDocument);
          await this.searchService.addProducts(
            createFeedDto?.items.map(elem => elem.productId)
          );
          await this.registerDeactivateOfferFeedsEvent(feedDocument.expiryDate);
        }

        return data.result as FeedDocument;
      } else {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_CREATE_FEED;
        this.error.message = 'There are more than 15 collections';
        throw this.error;
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          exception.message
        );
      }
    }
  }

  async removeIntersection(feed: FeedDocument) {
    const prodIds = feed.items.map(elem => elem.productId);
    const intersertedFeeds = await this.feedRepository.getIntersectedFeeds(
      feed._id,
      [FeedType.OFFERS],
      prodIds
    );
    intersertedFeeds.forEach(async element => {
      element.items = element.items.filter(
        item => !prodIds.includes(item.productId)
      );
      await this.feedRepository.updateOne(element._id.toString(), element);
    });
  }
  async updateFeed(
    updateFeedDto: UpdateFeedDto,
    updateAction: UpdateAction
  ): Promise<string | FeedDocument> {
    try {
      const [errValid, validationResult] = await this.validateUpdateDto(
        updateFeedDto,
        updateAction
      );
      if (errValid) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED;
        this.error.message = validationResult as string;
        throw this.error;
      }

      const feedDocument: FeedDocument = this.mapToFeedDocument(
        updateFeedDto,
        validationResult as FeedDocument
      );
      const productsBefore = feedDocument?.items?.map(elem =>
        elem.productId.toString()
      );

      const { items } = await this.getFeedByIdForSoumUser(
        updateFeedDto.feedId,
        1,
        1000
      );

      const [err, data] = await this.feedRepository.updateOne(
        updateFeedDto.feedId,
        feedDocument
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }

      if ((data.result as FeedDocument).status == 1) {
        await this.handleProductsSync(updateFeedDto, items);
      }

      if (updateFeedDto.feedType === FeedType.OFFERS) {
        await this.removeIntersection(data.result as FeedDocument);
      }
      const productsAfter = updateFeedDto?.items?.map(elem => elem.productId);
      const productToUpdate = new Set<string>(
        (productsBefore || []).concat(productsAfter || [])
      );
      if (productToUpdate.size)
        await this.searchService.addProducts(Array.from(productToUpdate));
      await this.registerDeactivateOfferFeedsEvent(feedDocument.expiryDate);

      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          exception.message
        );
      }
    }
  }
  async handleProductsSync(
    updateFeedDto: UpdateFeedDto,
    updateFeedItems: GetFeedItemDto[]
  ): Promise<void> {
    const allProductIds = updateFeedItems.map(item => item.productId);
    const updatedProductIds =
      updateFeedDto.items?.map((product: any) => product.productId) || [];

    const uniqueProductIds = [
      ...new Set([...allProductIds, ...updatedProductIds]),
    ];

    if (uniqueProductIds.length) {
      await this.searchService.addProducts(uniqueProductIds);
    }
  }

  async updateFeedStatus(
    updateFeedStatusDto: UpdateFeedStatusDto
  ): Promise<string | FeedDocument> {
    try {
      const countFeeds = await this.feedRepository.feedsCount(
        updateFeedStatusDto.feedType
      );

      const [feedError, feedRestlt] = await this.feedRepository.getById(
        updateFeedStatusDto.feedId
      );
      const feed = !feedError ? (feedRestlt.result as FeedDocument) : null;
      if (updateFeedStatusDto.status === ProductFeedStatus.ACTIVE) {
        if (countFeeds > 14) {
          this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey =
            Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED_STATUS;
          this.error.message = 'There are more than 15 collections';
          throw this.error;
        }

        if (
          feed.feedType === FeedType.OFFERS &&
          feed.expiryDate <= new Date()
        ) {
          this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey =
            Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED_STATUS;
          this.error.message = 'Feed already expired';
          throw this.error;
        }
      }

      const [err, data] = await this.feedRepository.updateFeedStatus(
        updateFeedStatusDto.feedId,
        updateFeedStatusDto.status
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      if (updateFeedStatusDto.feedType === FeedType.OFFERS) {
        const productsAfter = await this.validateProductToCollection(
          (data.result as FeedDocument)?.items.map(elem =>
            elem.productId.toString()
          )
        );
        await this.searchService.addProducts(
          productsAfter.map(elem => elem.productId)
        );
      }
      if (updateFeedStatusDto.feedType === FeedType.BUDGET) {
        await deleteWithPattern('home_*');
      }

      const productIDs =
        (feedRestlt.result as FeedDocument)?.items.map(
          (item: any) => item.productId
        ) || [];
      if (productIDs.length > 0) {
        await this.searchService.addProducts(productIDs);
      }

      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED_STATUS,
          exception.message
        );
      }
    }
  }
  async validateCreateDto(
    createFeedDto: CreateFeedDto
  ): Promise<[boolean, string]> {
    const [err, message] = this.validateDto(createFeedDto);
    if (err) return [true, message];
    const productIds = createFeedDto.items.map(
      (elem: FeedItemDto) => new Types.ObjectId(elem.productId)
    );
    const totalAvailableProduct = await this.getTotalActiveProducts(productIds);
    if (totalAvailableProduct !== productIds.length) {
      return [true, Constants.MESSAGE.INVALID_PRODUCTS_FOR_FEED_ITEMS];
    }
    return [false, null];
  }

  async validateUpdateDto(
    updateFeedDto: UpdateFeedDto,
    updateAction: UpdateAction
  ): Promise<[boolean, string | FeedDocument]> {
    const [errFeed, data] = await this.feedRepository.getById(
      updateFeedDto.feedId
    );
    if (errFeed) return [true, data.result as string];
    if (updateAction == UpdateAction.FULL_UPDATE) {
      const [err, message] = this.validateDto(updateFeedDto);
      if (err) return [true, message];

      const productsInFeed =
        (data.result as FeedDocument).items?.map((elem: FeedItem) =>
          elem.productId.toString()
        ) || [];
      // get old products in feed and exclude them and then validate the new added ones
      const productIds = updateFeedDto.items
        .filter((elem: FeedItemDto) => !productsInFeed.includes(elem.productId))
        .map((elem: FeedItemDto) => new Types.ObjectId(elem.productId));
      const totalAvailableProduct = await this.getTotalActiveProducts(
        productIds
      );
      if (totalAvailableProduct !== productIds.length)
        return [true, Constants.MESSAGE.INVALID_PRODUCTS_FOR_FEED_ITEMS];
    }
    return [false, data.result as FeedDocument];
  }
  validateDto(feedDto: CreateFeedDto | UpdateFeedDto): [boolean, string] {
    if (!feedDto.arName || !feedDto.enName)
      return [true, Constants.MESSAGE.INVALID_FEED_NAME];

    if (
      !feedDto.items ||
      feedDto.items?.find(
        (elem: FeedItemDto) => !isValidObjectId(elem.productId)
      )
    )
      return [true, Constants.MESSAGE.INVALID_PRODUCTS_FOR_FEED_ITEMS];

    const totalUniqueIds = new Set(
      feedDto.items.map((elem: FeedItemDto) => elem.productId)
    ).size;
    const totalUniquePositions = new Set(
      feedDto.items.map((elem: FeedItemDto) => elem.position)
    ).size;
    const totalActiveProducts = feedDto.items.filter(
      (elem: FeedItemDto) => elem.status == FeedStatus.Active
    ).length;
    const minNumberProducts = feedDto?.feedType === FeedType.BUDGET ? 4 : 5;
    if (
      feedDto?.feedType === FeedType.BUDGET &&
      totalActiveProducts < minNumberProducts
    ) {
      return [true, Constants.MESSAGE.INVALID_PRODUCTS_FOR_BUDGET];
    }
    if (
      totalUniqueIds !== feedDto.items.length ||
      totalUniquePositions !== feedDto.items.length ||
      totalActiveProducts < minNumberProducts
    )
      return [true, Constants.MESSAGE.INVALID_PRODUCTS_FOR_FEED_ITEMS];
    return [false, null];
  }

  async getTotalActiveProducts(prodIds: Types.ObjectId[]): Promise<number> {
    const [, data] = await this.productRepository.getTotalAvailableProduct(
      prodIds
    );
    return data.result || 0;
  }

  mapToFeedDocument(
    createFeedDto: CreateFeedDto | UpdateFeedDto,
    oldFeedDocument: FeedDocument
  ): FeedDocument {
    if (!createFeedDto) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_MAP_FEED_DTO
      );
    }
    const feedDocument = {
      _id: oldFeedDocument?._id,
      arName: createFeedDto?.arName || oldFeedDocument?.arName,
      enName: createFeedDto?.enName || oldFeedDocument?.enName,
      arTitle: createFeedDto?.arTitle || oldFeedDocument?.arTitle,
      enTitle: createFeedDto?.enTitle || oldFeedDocument?.enTitle,
      expiryDate: createFeedDto?.expiryDate || oldFeedDocument?.expiryDate,
      maxBudget: createFeedDto?.maxBudget || oldFeedDocument?.maxBudget,
      imgURL: createFeedDto?.imgURL || oldFeedDocument?.imgURL,
      status: oldFeedDocument?.status || ProductFeedStatus.ACTIVE,
      feedType: createFeedDto?.feedType || oldFeedDocument?.feedType,
      feedCategory:
        createFeedDto?.feedCategory || oldFeedDocument?.feedCategory || '',
      items:
        createFeedDto?.items?.map(
          (elem: FeedItemDto) =>
            ({
              position: elem.position,
              productId: new Types.ObjectId(elem.productId),
              status: elem.status,
              categoryId: elem.categoryId
                ? new Types.ObjectId(elem.categoryId)
                : null,
              brandId: elem.brandId ? new Types.ObjectId(elem.brandId) : null,
              modelId: elem.modelId ? new Types.ObjectId(elem.modelId) : null,
            } as FeedItem)
        ) || oldFeedDocument?.items,
      position: createFeedDto?.position || oldFeedDocument?.position,
    } as FeedDocument;
    return feedDocument;
  }

  mapToGetFeedDto(
    feeds: any[],
    type: string,
    clientType: string
  ): GetFeedDto[] {
    if (!feeds) return [];
    return feeds.map(
      feed =>
        ({
          id: feed._id,
          arName: feed.arName,
          enName: feed.enName,
          arTitle:
            type === FeedType.BUDGET.toLowerCase() && clientType !== 'admin-web'
              ? `SAR ${feed.maxBudget} بـ ${feed.arName}`
              : feed.arTitle,
          enTitle:
            type === FeedType.BUDGET.toLowerCase() && clientType !== 'admin-web'
              ? `${feed.enName} for ${feed.maxBudget} SAR`
              : feed.enTitle,
          expiryDate: feed.expiryDate,
          maxBudget: feed.maxBudget,
          imgURL: feed.imgURL,
          collectionStatus: feed.status,
          position: feed.position,
          totalActiveProducts: feed.items.filter(
            (elem: any) =>
              elem.status === FeedStatus.Active &&
              elem.sellStatus === ProductOrderStatus.Available &&
              elem.productStatus === ProductStatus.Active &&
              elem.expiryDate > new Date()
          ).length,
          totalProducts: feed.items.length,
        } as GetFeedDto)
    );
  }
  mapToAdminFullFeedDto(feedSummary: any): GetAdminFullFeedDto {
    return {
      id: feedSummary._id,
      arName: feedSummary.arName,
      enName: feedSummary.enName,
      arTitle: feedSummary.arTitle,
      enTitle: feedSummary.enTitle,
      expiryDate: feedSummary.expiryDate,
      maxBudget: feedSummary.maxBudget,
      imgURL: feedSummary.imgURL,
      feedType: feedSummary?.feedType,
      collectionStatus: feedSummary.status,
      totalActiveProducts: feedSummary.items.filter(
        (elem: any) =>
          elem.status === FeedStatus.Active &&
          elem.sellStatus == ProductOrderStatus.Available &&
          elem.productStatus == ProductStatus.Active &&
          elem.expiryDate > new Date()
      ).length,
      totalProducts: feedSummary.items.length,
      items: feedSummary.items.map(
        (elem: any) =>
          ({
            expiryDate: elem.expiryDate,
            modelName: elem.modelName,
            productId: elem.productId,
            sellPrice: elem.sellPrice,
            sellStatus: elem.sellStatus,
            categoryId: elem.categoryId,
            brandId: elem.brandId,
            modelId: elem.modelId,
            status: elem.status,
            position: elem.position,
          } as GetAdminFeedItemDto)
      ),
    } as GetAdminFullFeedDto;
  }
  mapProductToGetAdminFeedItemDto(
    product: any | ILegacyProductModel
  ): GetAdminFeedItemDto {
    return {
      productId: product._id,
      modelName: product.model_id.model_name,
      sellPrice: product.sell_price,
      expiryDate: product.expiryDate,
      sellStatus: product.sell_status,
      categoryId: product.category_id,
      brandId: product.brand_id,
      modelId: product.model_id,
      position: 0,
    } as GetAdminFeedItemDto;
  }
  async mapToFeedDto(feeds: GetFullFeedDto[]): Promise<GetFullFeedDto[]> {
    feeds = feeds.filter(feed => {
      return (
        (feed.items.length > 4 && feed.feedType == FeedType.HOME_PAGE) ||
        (feed.items.length >= 4 && feed.feedType == FeedType.OFFERS) ||
        (feed.items.length >= 1 && feed.feedType == FeedType.MPP) ||
        (feed.items.length >= 3 && feed.feedType == FeedType.BUDGET)
      );
    });

    let promos: DetailedPromoCode[] = [];
    const offersFeedsIds = feeds
      .filter(elem => elem.feedType === FeedType.OFFERS)
      .map((elem: any) => elem._id.toString());
    if (offersFeedsIds.length) {
      const grpcResponse = await getFeedPromos({ feedIds: offersFeedsIds });
      if (grpcResponse) {
        promos = grpcResponse?.DetailedPromoCode || [];
      }
    }
    return Promise.all(
      feeds.map(async (feed: any) => {
        let feedPromo: DetailedPromoCode = null;
        if (feed.feedType === FeedType.OFFERS) {
          feedPromo = promos.find((promo: DetailedPromoCode) =>
            promo.promoCodeScope
              .find(
                scope =>
                  scope.promoCodeScopeType === PromoCodeScopeTypeEnum.FEEDS
              )
              .ids.includes(feed._id.toString())
          );
        }

        const prodsDeepLoad = await getProductDataForFeeds({
          products: feed.items?.slice(0, 10).map((item: any) => {
            return {
              id: item.productId,
              userId: item.seller._id.toString(),
              sellPrice: item.sellPrice,
              categories: [
                {
                  id: item?.categoryId?.toString(),
                  type: CategoryType.CATEGORY,
                },
                {
                  id: item?.brandId?.toString(),
                  type: CategoryType.BRAND,
                },
                {
                  id: item?.modelId?.toString(),
                  type: CategoryType.MODEL,
                },
                {
                  id: item?.varientId?.toString(),
                  type: CategoryType.VARIANT,
                },
                {
                  id: item?.conditionId?.toString(),
                  type: CategoryType.CONDITION,
                },
              ],
            } as Product;
          }),
          promoCode: feedPromo
            ? ({
                promoLimit: feedPromo?.promoLimit,
                type: feedPromo.promoType,
                generator: feedPromo.promoGenerator,
                discount: feedPromo.discount,
                percentage: feedPromo.percentage,
              } as PromoCode)
            : null,
        } as getProductDataForFeedsReq);

        // call commission service with list of products
        // const commissions = [];
        return {
          id: feed._id,
          arName: feed.arName,
          enName: feed.enName,
          arTitle:
            feed.feedType.toLowerCase() === FeedType.BUDGET.toLowerCase()
              ? `${feed.arName} بـ ${feed.maxBudget} ريال`
              : feed.arTitle,
          enTitle:
            feed.feedType === FeedType.BUDGET.toLowerCase()
              ? `${feed.enName} for ${feed.maxBudget} SAR`
              : feed.enTitle,
          expiryDate: feed.expiryDate,
          items: await Promise.all(
            feed.items?.slice(0, 1000).map(async (elem: any) => {
              const { condition, commissionSummary } =
                prodsDeepLoad.products.find(
                  prod => prod.id === elem.productId.toString()
                ) || { condition: null, commissionSummary: null };
              const GT_Before =
                commissionSummary?.withoutPromo?.grandTotal || 0;
              const GT_After =
                commissionSummary?.withPromo?.grandTotal ||
                commissionSummary?.withoutPromo?.grandTotal;
              const discount = Number(GT_Before) - Number(GT_After);

              // this is the old way so i keep it
              // formatPriceInDecimalPoints(
              //   100 - (elem.sellPrice * 100) / elem.originalPrice
              // );

              // const [, variantRes] = await this.variantRepository.getById(
              //   elem.varientId
              // );
              // const varient: VariantDocument =
              //   variantRes.result as VariantDocument;
              // const attributes = await mapAttributes(varient.attributes);
              // const condition = elem.conditionId
              //   ? conditions.find(cond => cond.id == elem.conditionId)
              //   : null;

              const collection = {
                originalPrice: elem.originalPrice,
                modelName: elem.modelName,
                arModelName: elem.arModelName,
                productId: elem.productId,
                sellPrice: elem.sellPrice,
                grandTotal:
                  Number(commissionSummary?.withoutPromo?.grandTotal) ||
                  elem.sellPrice,
                grade: elem.grade,
                arGrade: elem.arGrade,
                productImage: elem.productImages ? elem.productImages[0] : null,
                variantName: elem.variant,
                arVariantName: elem.arVariant,
                dmSecurityFee: elem.dmSecurityFee,
                discount: discount,
                attributes: [],
                product_images: elem.productImages,
                productImages: elem.productImages, // fix build issue
                condition: condition
                  ? {
                      id: condition.id,
                      name: condition.name,
                      nameAr: condition.nameAr,
                      labelColor: condition.labelColor,
                      textColor: condition.textColor,
                    }
                  : null,
              } as GetFeedItemDto;

              if (
                elem?.isBiddingProduct &&
                elem?.billingSettings?.activate_bidding
              ) {
                collection.activate_bidding =
                  elem?.billingSettings?.activate_bidding;
                collection.start_bid = elem?.billingSettings?.start_bid;
                collection.highest_bid = elem?.billingSettings?.start_bid;
              }

              if (collection) {
                return collection;
              }
            })
          ),
          feedType: feed.feedType,
          maxBudget: feed.maxBudget,
          imgURL: feed.imgURL,
          position: feed.position,
          totalActiveProducts: feed.items.length,
          totalProducts: feed.items.length,
        } as unknown as GetFullFeedDto;
      })
    );
  }

  async mapToFullFeedDto(feedSummary: any) {
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
    const promoCode = await this.productService.getPromoCodeToApply({
      applyDefaultPromo: false,
      feedId:
        feedSummary.feedType === FeedType.OFFERS
          ? feedSummary._id.toString()
          : null,
    });

    const conditionIds = feedSummary.items
      .map((elem: any) => elem.conditionId)
      .filter(Boolean);
    const conditions = conditionIds?.length
      ? await getConditions({
          ids: conditionIds,
        })
      : [];
    const items: GetFeedItemDto[] = await Promise.all(
      feedSummary.items?.map(async (elem: any) => {
        const condition = elem.conditionId
          ? conditions.find(cond => cond.id == elem.conditionId)
          : null;
        const commissionSummaries =
          await this.productService.calculateSummaryCommission({
            product: {
              id: elem.productId.toString(),
              sellPrice: elem.sellPrice,
              modelId: elem.modelId,
              varientId: elem.variantId,
              grade: elem.grade,
              categoryId: elem.categoryId,
              conditionId: elem.conditionId,
            },
            promoCode: promoCode || null,
            sellerId: elem.user_id,
            isCommissionForBuyer: true,
            source: ProductAccessSource.MPP,
            sysSettings,
            allPayments: false,
            reservation: null,
          });
        const commissionSummary =
          commissionSummaries[0].withPromo ||
          commissionSummaries[0].withoutPromo;
        const [, variantRes] = await this.variantRepository.getById(
          elem.variantId
        );
        const varient: VariantDocument = variantRes.result as VariantDocument;

        const attributes = await mapAttributes(varient.attributes);

        const GT_Before = commissionSummaries[0]?.withoutPromo?.grandTotal || 0;
        const GT_After =
          commissionSummaries[0]?.withPromo?.grandTotal ||
          commissionSummaries[0]?.withoutPromo?.grandTotal;
        const discount =
          feedSummary.feedType == FeedType.OFFERS
            ? Number(GT_Before) - Number(GT_After)
            : 0;
        // this is the old way so i keep it
        // formatPriceInDecimalPoints(
        //   100 - (elem.sellPrice * 100) / elem.originalPrice
        // );
        const collection = {
          originalPrice: elem.originalPrice,
          modelName: elem.modelName,
          arModelName: elem.arModelName,
          productId: elem.productId,
          sellPrice: elem.sellPrice,
          grandTotal: commissionSummary.grandTotal,
          grade: elem.grade,
          arGrade: elem.arGrade,
          productImage: elem.productImages ? elem.productImages[0] : null,
          variantName: elem.variant,
          arVariantName: elem.arVariant,
          discount,
          attributes: attributes,
          product_images: elem.productImages,
          createdAt: elem.createdAt,
          condition: condition
            ? {
                id: condition.id,
                name: condition.name,
                nameAr: condition.nameAr,
                labelColor: condition.labelColor,
                textColor: condition.textColor,
              }
            : null,
        } as GetFeedItemDto;
        if (elem?.isBiddingProduct && elem?.billingSettings?.activate_bidding) {
          collection.activate_bidding = elem?.billingSettings?.activate_bidding;
          collection.start_bid = elem?.billingSettings?.start_bid;
          collection.highest_bid = elem?.billingSettings?.start_bid;
        }

        return collection;
      })
    );
    return {
      id: feedSummary._id,
      arName: feedSummary.arName,
      enName: feedSummary.enName,
      arTitle: feedSummary.arTitle,
      enTitle: feedSummary.enTitle,
      expiryDate: feedSummary.expiryDate,
      items: items?.filter(Boolean),
    } as GetFullFeedDto;
  }
  async updateFeedCollectionType() {
    try {
      const [err, data] = await this.feedRepository.updateFeedCollectionType();
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED,
          exception.message
        );
      }
    }
  }
  async deactivateOfferFeeds() {
    try {
      console.log('handle new job for registerDeactivateOfferFeedsEvent');

      const feeds = await this.feedRepository.deactivateOfferFeeds();
      console.log(
        'handle new job for registerDeactivateOfferFeedsEvent ',
        feeds.length
      );

      if (!feeds?.length) return;

      let productToUpdate: string[] = [];
      feeds.forEach(elem => {
        productToUpdate = productToUpdate.concat(
          elem.items.map(item => item.productId.toString())
        );
      });
      await this.searchService.addProducts(productToUpdate);
    } catch (error) {
      console.log(error);
    }
  }

  async registerDeactivateOfferFeedsEvent(expiryDate: Date) {
    console.log('Add new job for registerDeactivateOfferFeedsEvent');
    const delay = new Date(expiryDate)?.getTime() - new Date().getTime();
    console.log('delay after, ', delay);

    this.bullMQService.addJob(
      {
        type: JobTypes.EXPIRE_OFFER_FEED,
        retryCount: 1,
      },
      { delay },
      Queues.EXPIRE_OFFER_FEED
    );
  }
}
