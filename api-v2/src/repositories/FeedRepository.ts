import mongoose from 'mongoose';
import { Service } from 'typedi';
import moment from 'moment';
import { Constants } from '../constants/constant';
import { FeedDocument, FeedModel } from '../models/Feed';
import { BaseRepository } from './BaseRepository';
import { FeedStatus } from '../enums/FeedStatus';
import { GetFullFeedDto } from '../dto/AdminCollection/GetFullFeedDto';
import { ProductFeedStatus } from '../enums/ProductFeedStatus';
import { ProductRepoFilters } from './productRepository';
import { FeedType } from '../enums/FeedType';
import { Types } from 'mongoose';

const getNewConditionName = (product: any) => {
  const old_condition_en = ['like new', 'lightly used', 'fair'];
  const new_condition_en = [
    'Excellent condition',
    'Good condition',
    'Noticeably used',
  ];
  const new_condition_ar = ['حالة ممتازة', 'حالة جيدة', 'إستخدام ملحوظ'];
  const condition_index_en = old_condition_en.indexOf(
    product.grade?.toLowerCase()
  );

  if (condition_index_en > -1) {
    product.grade = new_condition_en[condition_index_en];
    product.grade_ar = new_condition_ar[condition_index_en];
    if (product.arGrade) {
      product.arGrade = product.grade_ar;
    }
  }

  return product;
};

@Service()
export class FeedRepository extends BaseRepository {
  constructor() {
    super();
  }
  async getById(
    id: string
  ): Promise<
    [boolean, { code: number; result: FeedDocument | string; message?: string }]
  > {
    try {
      const data: FeedDocument = await FeedModel.findById(id);
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          },
        ];
      }
      return [false, { result: data, code: Constants.SUCCESS_CODE.SUCCESS }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          message: exception.message,
        },
      ];
    }
  }
  private populationAggregation = [
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'productData',
      },
    },
    { $unwind: '$productData' },
    {
      $lookup: {
        from: 'device_models',
        localField: 'productData.model_id',
        foreignField: '_id',
        as: 'deviceModel',
      },
    },
    { $unwind: '$deviceModel' },
    {
      $lookup: {
        from: 'varients',
        localField: 'productData.varient_id',
        foreignField: '_id',
        as: 'variantData',
      },
    },
    { $unwind: '$variantData' },
  ];

  async getFeeds(
    feedTypes: FeedType[],
    productRepoFilters: ProductRepoFilters,
    category: string = '',
    getBothTypes: boolean = true
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const itemIndex = feedTypes.includes(FeedType.BUDGET) ? 3 : 4;
      let aggregate: Array<Record<string, any>> = [
        {
          $match: {
            status: 1,
            [`items.${itemIndex}`]: { $exists: true },
          },
        },
        { $unwind: '$items' },
      ];

      if (feedTypes.length > 0) {
        aggregate.push({
          $match: {
            feedType: { $in: feedTypes },
          },
        });
      }
      if (getBothTypes === false) {
        if (category === '') {
          aggregate.push({
            $match: {
              feedCategory: { $ne: 'cars' },
            },
          });
        } else {
          aggregate.push({
            $match: {
              feedCategory: { $eq: 'cars' },
            },
          });
        }
      }

      const itemFilters: any = {};
      if (productRepoFilters?.categoryIds) {
        Object.assign(itemFilters, {
          ['items.categoryId']: {
            $in: productRepoFilters.categoryIds.map(
              elem => new mongoose.Types.ObjectId(elem)
            ),
          },
        });
      }
      if (productRepoFilters?.brandIds) {
        Object.assign(itemFilters, {
          ['items.brandId']: {
            $in: productRepoFilters.brandIds.map(
              elem => new mongoose.Types.ObjectId(elem)
            ),
          },
        });
      }
      if (productRepoFilters?.modelIds) {
        Object.assign(itemFilters, {
          ['items.modelId']: {
            $in: productRepoFilters.modelIds.map(
              elem => new mongoose.Types.ObjectId(elem)
            ),
          },
        });
      }

      aggregate.push({ $match: itemFilters });

      aggregate = aggregate.concat([
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productData',
          },
        },
        { $unwind: '$productData' },
        {
          $lookup: {
            from: 'device_models',
            localField: 'productData.model_id',
            foreignField: '_id',
            as: 'deviceModel',
          },
        },
        { $unwind: '$deviceModel' },
        {
          $lookup: {
            from: 'users',
            localField: 'productData.user_id',
            foreignField: '_id',
            as: 'seller',
          },
        },
        { $unwind: '$seller' },
        {
          $lookup: {
            from: 'varients',
            localField: 'productData.varient_id',
            foreignField: '_id',
            as: 'variantData',
          },
        },
        { $unwind: '$variantData' },
        {
          $match: {
            'items.status': FeedStatus.Active,
            'productData.sell_status': 'Available',
            'productData.status': 'Active',
            'productData.expiryDate': { $gt: moment().toDate() },
            'productData.isApproved': true,
          },
        },
        {
          $project: {
            arName: 1,
            enName: 1,
            arTitle: 1,
            enTitle: 1,
            expiryDate: 1,
            maxBudget: 1,
            imgURL: 1,
            status: 1,
            feedType: 1,
            position: 1,
            'item.position': '$items.position',
            'item.productId': '$productData._id',
            'item.grade': '$productData.grade',
            'item.arGrade': '$productData.grade_ar',
            'item.sellPrice': '$productData.sell_price',
            'item.productImages': '$productData.product_images',
            'item.modelName': '$deviceModel.model_name',
            'item.modelId': '$productData.model_id',
            'item.varientId': '$productData.varient_id',
            'item.categoryId': '$productData.category_id',
            'item.conditionId': '$productData.condition_id',
            'item._id': '$productData._id',
            'item.arModelName': '$deviceModel.model_name_ar',
            'item.originalPrice': '$variantData.current_price',
            'item.variant': '$variantData.varient',
            'item.arVariant': '$variantData.varient_ar',
            'item.billingSettings': '$productData.billingSettings',
            'item.isBiddingProduct': '$productData.isBiddingProduct',
            'item.seller': '$seller',
          },
        },
        { $sort: { 'item.position': 1 } },
        {
          $group: {
            _id: '$_id',
            arName: { $first: '$arName' },
            enName: { $first: '$enName' },
            arTitle: { $first: '$arTitle' },
            enTitle: { $first: '$enTitle' },
            expiryDate: { $first: '$expiryDate' },
            maxBudget: { $first: '$maxBudget' },
            imgURL: { $first: '$imgURL' },
            feedType: { $first: '$feedType' },
            position: { $first: '$position' },
            status: { $first: '$status' },
            items: { $push: '$item' },
          },
        },
        {
          $set: {
            items: { $slice: ['$items', productRepoFilters.size || 10] },
          },
        },
        {
          $limit: productRepoFilters?.size,
        },
        {
          $sort: { position: 1, enName: 1 },
        },
      ]);

      const data = await FeedModel.aggregate(aggregate);
      if (data) {
        data.forEach((feed: GetFullFeedDto) => {
          feed.items.forEach((item: any) => getNewConditionName(item));
        });
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_FEED,
            message: Constants.MESSAGE.FAILED_TO_GET_FEED,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      console.log('Feed repository ', exception);
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          message: exception.message,
        },
      ];
    }
  }

  async getFeedByIdForSoumUser(
    feedId: string,
    page: number,
    size: number
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const aggregate = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(feedId),
          },
        },
        ...this.populationAggregation,
        {
          $match: {
            'items.status': FeedStatus.Active,
            'productData.sell_status': 'Available',
            'productData.status': 'Active',
            'productData.expiryDate': { $gt: moment().toDate() },
            'productData.isApproved': true,
          },
        },
        {
          $project: {
            arName: 1,
            enName: 1,
            arTitle: 1,
            enTitle: 1,
            feedType: 1,
            expiryDate: 1,
            maxBudget: 1,
            imgURL: 1,
            'item.position': '$items.position',
            'item.productId': '$productData._id',
            'item.grade': '$productData.grade',
            'item.arGrade': '$productData.grade_ar',
            'item.sellPrice': '$productData.sell_price',
            'item.productImages': '$productData.product_images',
            'item.modelName': '$deviceModel.model_name',
            'item.arModelName': '$deviceModel.model_name_ar',
            'item.originalPrice': '$variantData.current_price',
            'item.variant': '$variantData.varient',
            'item.arVariant': '$variantData.varient_ar',
            'item.variantId': '$variantData._id',
            'item.modelId': '$device_models._id',
            'item.categoryId': '$productData.category_id',
            'item.conditionId': '$productData.condition_id',
            'item.billingSettings': '$productData.billingSettings',
            'item.isBiddingProduct': '$productData.isBiddingProduct',
            'item.createdAt': '$productData.createdDate',
          },
        },
        {
          $skip: (page - 1) * size,
        },
        {
          $limit: size,
        },
        { $sort: { 'item.position': 1 } },
        {
          $group: {
            _id: '$_id',
            arName: { $first: '$arName' },
            enName: { $first: '$enName' },
            arTitle: { $first: '$arTitle' },
            enTitle: { $first: '$enTitle' },
            expiryDate: { $first: '$expiryDate' },
            maxBudget: { $first: '$maxBudget' },
            imgURL: { $first: '$imgURL' },
            position: { $first: '$position' },
            status: { $first: '$status' },
            feedType: { $first: '$feedType' },
            items: { $push: '$item' },
          },
        },
      ];
      let data = await FeedModel.aggregate(aggregate);
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          },
        ];
      } else if (data.length > 0) {
        data[0].items.map((item: any) => getNewConditionName(item));
      } else if (data.length == 0) {
        data = await FeedModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(feedId),
            },
          },
          {
            $project: {
              arName: 1,
              enName: 1,
              arTitle: 1,
              enTitle: 1,
              expiryDate: 1,
              maxBudget: 1,
              imgURL: 1,
              items: [],
            },
          },
        ]);
      }

      if (!data || data.length == 0) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_FEED,
            message: Constants.MESSAGE.FAILED_TO_GET_FEED,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data[0] }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          message: exception.message,
        },
      ];
    }
  }

  async getTotalActiveItem(feedId: string): Promise<number> {
    try {
      const aggregate = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(feedId),
          },
        },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productData',
          },
        },
        {
          $match: {
            'items.status': FeedStatus.Active,
            'productData.sell_status': 'Available',
            'productData.status': 'Active',
            'productData.expiryDate': { $gt: moment().toDate() },
            'productData.isApproved': true,
          },
        },
      ];
      const data = await FeedModel.aggregate(aggregate);

      return data?.length || 0;
    } catch (exception) {
      return 0;
    }
  }
  async getFullFeedById(
    id: any
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const aggregate = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        ...this.populationAggregation,
        {
          $project: {
            arName: 1,
            enName: 1,
            arTitle: 1,
            enTitle: 1,
            expiryDate: 1,
            maxBudget: 1,
            imgURL: 1,
            feedType: 1,
            status: 1,
            'item.position': '$items.position',
            'item.status': '$items.status',
            'item.productId': '$productData._id',
            'item.categoryId': '$items.categoryId',
            'item.brandId': '$items.brandId',
            'item.modelId': '$items.modelId',
            'item.sellPrice': '$productData.sell_price',
            'item.sellStatus': '$productData.sell_status',
            'item.productStatus': '$productData.status',
            'item.modelName': '$deviceModel.model_name',
            'item.expiryDate': '$productData.expiryDate',
          },
        },
        { $sort: { 'item.position': 1 } },
        {
          $group: {
            _id: '$_id',
            arName: { $first: '$arName' },
            enName: { $first: '$enName' },
            arTitle: { $first: '$arTitle' },
            enTitle: { $first: '$enTitle' },
            expiryDate: { $first: '$expiryDate' },
            maxBudget: { $first: '$maxBudget' },
            imgURL: { $first: '$imgURL' },
            feedType: { $first: '$feedType' },
            status: { $first: '$status' },
            items: { $push: '$item' },
          },
        },
      ];
      const data = await FeedModel.aggregate(aggregate);
      if (!data || data.length == 0)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_FEED,
            message: Constants.MESSAGE.FAILED_TO_GET_FEED,
          },
        ];
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data[0] }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          message: exception.message,
        },
      ];
    }
  }

  async getAllSummary(
    type: string,
    category: string = ''
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const data = await FeedModel.aggregate([
        ...this.populationAggregation,
        category === 'cars'
          ? {
              $match: {
                status: {
                  $in: [ProductFeedStatus.ACTIVE, ProductFeedStatus.INACTIVE],
                },
                feedType: {
                  $regex: new RegExp('^' + type, 'i'),
                },
                feedCategory: { $eq: 'cars' },
              },
            }
          : {
              $match: {
                status: {
                  $in: [ProductFeedStatus.ACTIVE, ProductFeedStatus.INACTIVE],
                },
                feedType: {
                  $regex: new RegExp('^' + type, 'i'),
                },
                feedCategory: { $ne: 'cars' },
              },
            },
        {
          $project: {
            arName: 1,
            enName: 1,
            arTitle: 1,
            enTitle: 1,
            expiryDate: 1,
            maxBudget: 1,
            imgURL: 1,
            status: 1,
            position: 1,
            createdAt: 1,
            'item.status': '$items.status',
            'item.productId': '$productData._id',
            'item.sellPrice': '$productData.sell_price',
            'item.sellStatus': '$productData.sell_status',
            'item.productStatus': '$productData.status',
            'item.modelName': '$deviceModel.model_name',
            'item.expiryDate': '$productData.expiryDate',
          },
        },
        {
          $group: {
            _id: '$_id',
            arName: { $first: '$arName' },
            enName: { $first: '$enName' },
            arTitle: { $first: '$arTitle' },
            enTitle: { $first: '$enTitle' },
            expiryDate: { $first: '$expiryDate' },
            createdAt: { $first: '$createdAt' },
            maxBudget: { $first: '$maxBudget' },
            imgURL: { $first: '$imgURL' },
            status: { $first: '$status' },
            items: { $push: '$item' },
            position: { $first: '$position' },
          },
        },
        {
          $sort: { position: 1, enName: 1 },
        },
      ]);
      if (!data)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_FEED,
            message: Constants.MESSAGE.FAILED_TO_GET_FEED,
          },
        ];
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_FEED,
          message: exception.message,
        },
      ];
    }
  }

  async createOne(
    feedDocument: FeedDocument
  ): Promise<
    [boolean, { code: number; result: FeedDocument | string; message?: string }]
  > {
    try {
      const data: FeedDocument = await FeedModel.create(feedDocument);
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_CREATE_FEED,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_CREATE_FEED,
          message: exception.message,
        },
      ];
    }
  }
  async updateFeedStatus(
    id: string,
    status: number
  ): Promise<
    [boolean, { code: number; result: string | FeedDocument; message?: string }]
  > {
    try {
      if (status === ProductFeedStatus.DELETE) {
        await FeedModel.findByIdAndDelete(id).exec();
        return [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: 'Feed removed successfully',
          },
        ];
      } else {
        const data: FeedDocument = await FeedModel.findOneAndUpdate(
          { _id: id },
          { $set: { status: status } }
        );
        if (!data) {
          return [
            true,
            {
              code: Constants.ERROR_CODE.BAD_REQUEST,
              result: Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED,
            },
          ];
        }
        return [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: data,
          },
        ];
      }
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED,
          message: exception.message,
        },
      ];
    }
  }

  async feedsCount(
    feedType: string = FeedType.HOME_PAGE,
    feedCategory: string = ''
  ) {
    if (feedCategory === 'cars') {
      return await FeedModel.find({
        status: ProductFeedStatus.ACTIVE as number,
        feedType: {
          $regex: new RegExp('^' + feedType, 'i'),
        },
        feedCategory: 'cars',
      }).count();
    }
    return await FeedModel.find({
      status: ProductFeedStatus.ACTIVE as number,
      feedType: {
        $regex: new RegExp('^' + feedType, 'i'),
      },
    }).count();
  }

  async updateOne(
    id: string,
    feedDocument: FeedDocument
  ): Promise<
    [boolean, { code: number; result: string | FeedDocument; message?: string }]
  > {
    try {
      const data: FeedDocument = await FeedModel.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        feedDocument
      );
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED,
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: feedDocument,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED,
          message: exception.message,
        },
      ];
    }
  }

  async updateFeedCollectionType(): Promise<
    [boolean, { code: number; result: string; message?: string }]
  > {
    try {
      await FeedModel.updateMany({}, { feedType: FeedType.HOME_PAGE });
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: Constants.MESSAGE.UPDATE_HOME_PAGE_FEED_TYPE_SUCCESSFULLY,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED,
          message: exception.message,
        },
      ];
    }
  }

  async getIntersectedFeeds(
    id: Types.ObjectId,
    feedTypes: FeedType[],
    prodIds: Types.ObjectId[]
  ) {
    return await FeedModel.find({
      _id: { $ne: id },
      status: ProductFeedStatus.ACTIVE as number,
      feedType: { $in: feedTypes },
      $or: [
        { expiryDate: { $eq: null } },
        { expiryDate: { $gte: new Date() } },
      ],
      items: {
        $elemMatch: {
          productId: {
            $in: prodIds,
          },
        },
      },
    });
  }

  async deactivateOfferFeeds() {
    try {
      const feeds = await FeedModel.find({
        status: ProductFeedStatus.ACTIVE as number,
        feedType: FeedType.OFFERS,
        expiryDate: { $lte: new Date() },
      });
      if (feeds?.length) {
        await FeedModel.updateMany(
          {
            _id: { $in: feeds.map(elem => elem._id) },
          },
          {
            $set: { status: ProductFeedStatus.INACTIVE as number },
          }
        );
      }
      return feeds || [];
    } catch (error) {
      return [];
    }
  }

  async getByIds(ids: string[]): Promise<FeedDocument[]> {
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    const query = await FeedModel.find({ _id: { $in: validIds } }).exec();
    return query;
  }

  async getByProductId(productId: string): Promise<FeedDocument[]> {
    const feeds = await FeedModel.find({
      items: {
        $elemMatch: {
          productId: new mongoose.Types.ObjectId(productId),
        },
      },
    });
    return feeds;
  }
}
