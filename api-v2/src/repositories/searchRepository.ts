/* eslint-disable max-len */
import moment from 'moment';
import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ProductFilterDto } from '../dto/product/ProductFilterDto';
import { ProductOrderStatus, ProductStatus } from '../enums/ProductStatus.Enum';
import { ProductSyncStatus } from '../enums/search/searchEnums';
import { mappingMongoError } from '../libs/mongoError';
import {
  ILegacyProductModel,
  MatchCondition,
  ProductModel,
} from '../models/LegacyProducts';
import { lookup, unwind } from '../util/queryHelper';
import { ENVIRONMENT } from '../util/secrets';
import { PaginationDto } from './../dto/paginationDto';

@Service()
export class SearchRepository {
  async getSyncData(filter: ProductFilterDto): Promise<
    [
      boolean,
      {
        code: number;
        result: PaginationDto<ILegacyProductModel> | string;
        message?: string;
      }
    ]
  > {
    const productIds = filter?.productIds;
    const { size } = filter;

    const matchCondition: MatchCondition = {
      status: ProductStatus.Active,
      isApproved: true,
      sell_status: ProductOrderStatus.Available,
      expiryDate: { $gte: moment().toDate() },
    };

    if (!productIds) {
      matchCondition.$and = [
        {
          $or: [
            { search_sync: { $exists: false } },
            { search_sync: ProductSyncStatus.UNSYNCED },
            {
              search_sync:
                ProductSyncStatus.UNSYNCED + '_' + process.env.PREFIX + '_dev',
            },
          ],
        },
      ];
    }

    const productIdsArr = [];
    if (productIds?.length > 0) {
      for (const productId of productIds) {
        productIdsArr.push(new mongoose.Types.ObjectId(productId));
      }
      matchCondition._id = productIdsArr?.length > 0 && { $in: productIdsArr };
    }
    const aggregate: Array<Record<string, any>> = [
      {
        $match: matchCondition as MatchCondition,
      },
      {
        $limit: size,
      },
      { $unwind: { path: '$highlights', preserveNullAndEmptyArrays: true } },
      lookup('varients', 'varient_id', '_id', 'varientData'),
      unwind('$varientData', false),
      lookup('users', 'user_id', '_id', 'seller'),
      unwind('$seller', false),
      lookup('device_models', 'model_id', '_id', 'device_model'),
      lookup('categories', 'category_id', '_id', 'category'),
      lookup('brands', 'brand_id', '_id', 'brand'),
      unwind('$category', false),
      unwind('$brand', false),
      unwind('$device_model', false),
      {
        $lookup: {
          from: 'Response',
          let: { response: '$response' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$response'] },
                    { $ne: ['$responses.text_answer', null] },
                  ],
                },
              },
            },
            {
              $project: {
                text_answer: '$responses.text_answer',
              },
            },
          ],
          as: 'textAnswers',
        },
      },
      { $unwind: { path: '$textAnswers', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          liked: { $first: '$liked' },
          varientId: { $first: '$varient_id' },
          conditionId: { $first: '$condition_id' },
          grade: { $first: '$grade' },
          arGrade: { $first: '$grade_ar' },
          modelId: { $first: '$model_id' },
          modelName: { $first: '$device_model.model_name' },
          arModelName: { $first: '$device_model.model_name_ar' },
          modelPosition: { $first: '$device_model.position' },
          modelImage: { $first: '$device_model.model_icon' },
          categoryId: { $first: '$category_id' },
          categoryName: { $first: '$category.category_name' },
          arCategoryName: { $first: '$category.category_name_ar' },
          categoryPosition: { $first: '$category.position' },
          arBrandName: { $first: '$brand.brand_name_ar' },
          brandName: { $first: '$brand.brand_name' },
          brandId: { $first: '$brand_id' },
          brandPosition: { $first: '$brand.position' },
          sellerId: { $first: '$user_id' },
          sellerCity: { $first: '$seller.address.city' },
          sellPrice: { $first: '$sell_price' },
          sellerRate: { $first: '$seller.rates.completion_rate' },
          isMerchant: { $first: '$seller.isMerchant' },
          sellerRating: { $first: '$seller.rating' },
          isUAE_listing: { $first: '$seller.sellerType.isUAE' },
          createdDate: { $first: '$createdDate' },
          productImages: { $first: '$product_images' },
          variantName: { $first: '$varientData.varient' },
          arVariantName: { $first: '$varientData.varient_ar' },
          originalPrice: { $first: '$varientData.current_price' },
          favorites: { $first: '$favoriteData' },
          tags: { $first: '$seller.tags' },
          billingSettings: { $first: '$billingSettings' },
          isBiddingProduct: { $first: '$isBiddingProduct' },
          listingQuantity: { $first: '$listingQuantity' },
          text_answer: { $first: '$textAnswers.text_answer' },
          isUpranked: { $first: '$isUpranked' },
          recommendedPrice: { $first: '$recommended_price' },
          imagesQualityScore: { $first: '$imagesQualityScore' },
          answerToQuestions: { $first: '$answer_to_questions' },
          answerToQuestionsAr: { $first: '$answer_to_questions_ar' },
          search_sync: { $first: '$search_sync' },
          seller: { $first: '$seller' },
          listingGroupId: { $first: '$listingGroupId' },
          isConsignment: { $first: '$isConsignment' },
        },
      },
    ];
    const data = await ProductModel.aggregate([...aggregate]);
    if (!data) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_MPP_PRODUCTS,
        },
      ];
    }

    return [
      false,
      {
        code: Constants.SUCCESS_CODE.SUCCESS,
        result: {
          docs: data,
          totalDocs: 0,
          hasNextPage: true,
        },
      },
    ];
  }
  async updateSearchData(productIds: string[]) {
    try {
      const search_sync: string =
        ENVIRONMENT === 'production'
          ? ProductSyncStatus.SYNCED
          : ProductSyncStatus.SYNCED + '_' + process.env.PREFIX + '_dev'; // To manage conflicts between FBs
      await ProductModel.updateMany(
        { _id: { $in: productIds } },
        {
          $set: {
            search_sync: search_sync,
          },
        }
      ).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: productIds,
        },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, exception.message];
      }
    }
  }
  async getUnAvailableProducts(productIds?: string[]): Promise<
    [
      boolean,
      {
        code: number;
        result: string[] | string;
        message?: string;
      }
    ]
  > {
    try {
      let sync_environment: Array<Record<string, unknown>> = [
        { search_sync: ProductSyncStatus.SYNCED },
        { search_sync: { $exists: false } },
      ];

      let filterByIds = {};
      if (productIds?.length > 0) {
        const productIdsArr = productIds.map(
          productId => new mongoose.Types.ObjectId(productId)
        );
        filterByIds =
          productIdsArr.length > 0 ? { _id: { $in: productIdsArr } } : {};
      }

      if (ENVIRONMENT !== 'production') {
        sync_environment = [
          { search_sync: ProductSyncStatus.SYNCED },
          {
            search_sync:
              ProductSyncStatus.SYNCED + '_' + process.env.PREFIX + '_dev',
          },
          {
            $and: [
              { expiryDate: { $gte: moment().toDate() } },
              { search_sync: { $exists: false } },
            ],
          },
          {
            $and: [
              { updatedDate: { $gte: moment().subtract(30, 'd').toDate() } }, // set to 30 days so as to avoid scanning very old products
              { search_sync: { $exists: false } },
            ],
          },
        ];
      }
      const data = await ProductModel.find(
        {
          $and: [
            {
              $or: [
                { status: ProductStatus.Delete },
                { status: ProductStatus.Reject },
                { status: ProductStatus.Idle },
                { expiryDate: { $lte: moment().toDate() } },
                { sell_status: ProductOrderStatus.Sold },
                { sell_status: ProductOrderStatus.Refunded },
                { sell_status: ProductOrderStatus.Locked },
                {
                  $and: [
                    { isApproved: false },
                    { sell_status: ProductOrderStatus.Available },
                    {
                      $or: [
                        { search_sync: ProductSyncStatus.SYNCED },
                        {
                          search_sync:
                            ProductSyncStatus.SYNCED +
                            '_' +
                            process.env.PREFIX +
                            '_dev',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              $and: [
                {
                  $or: sync_environment,
                },
                filterByIds,
              ],
            },
          ],
        },
        { id: 1, _id: 1 }
      )
        .sort({ createdDate: -1 })
        .limit(2000)
        .exec();

      if (!data)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCTS,
            message: Constants.MESSAGE.FAILED_TO_GET_PRODUCTS,
          },
        ];

      const productsIds = await Promise.all(
        data.map(async (elem: ILegacyProductModel) => {
          return elem._id;
        })
      );

      return [
        false,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: productsIds,
          message: null,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCTS,
          message: exception.message,
        },
      ];
    }
  }
  async updateProductSyncStatus(productsIds: string[], syncStatus: string) {
    try {
      await ProductModel.updateMany(
        { _id: { $in: productsIds } },
        { $set: { search_sync: syncStatus } }
      ).exec();

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: Constants.MESSAGE.PRODUCT_SYNC_STATUS_SUCCESSFULLY_UPDATED,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT_TO_SYNC_STATUS,
          message: exception.message,
        },
      ];
    }
  }

  async clearProductSyncStatus(productsIds: string[]) {
    try {
      await ProductModel.updateMany(
        { _id: { $in: productsIds } },
        { $unset: { search_sync: 1 } }
      ).exec();

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: Constants.MESSAGE.PRODUCT_SYNC_STATUS_SUCCESSFULLY_UPDATED,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT_TO_SYNC_STATUS,
          message: exception.message,
        },
      ];
    }
  }
  async cleanUp(): Promise<
    [
      boolean,
      {
        code: number;
        result: string[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const updatedAt = new Date();
      updatedAt.setMinutes(updatedAt.getMinutes() - 15);
      const data = await ProductModel.find(
        {
          $and: [
            {
              $or: [
                { status: ProductStatus.Delete },
                { status: ProductStatus.Reject },
                { status: ProductStatus.Idle },
                { expiryDate: { $lte: moment().toDate() } },
                { sell_status: ProductOrderStatus.Sold },
                { sell_status: ProductOrderStatus.Refunded },
              ],
            },
            {
              isApproved: true,
            },
            {
              updatedDate: { $gte: updatedAt },
            },
          ],
        },
        { id: 1, _id: 1 }
      )
        .sort({ createdDate: -1 })
        .limit(200)
        .exec();

      if (!data)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCTS,
            message: Constants.MESSAGE.FAILED_TO_GET_PRODUCTS,
          },
        ];

      const productsIds = await Promise.all(
        data.map(async (elem: ILegacyProductModel) => {
          return elem._id;
        })
      );

      return [
        false,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: productsIds,
          message: null,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCTS,
          message: exception.message,
        },
      ];
    }
  }
}
