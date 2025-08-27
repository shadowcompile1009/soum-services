import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { BaseRepository } from './BaseRepository';
import { ILegacyProductModel, ProductModel } from '../models/LegacyProducts';
import { lookup, unwind } from '../util/queryHelper';
import mongoose from 'mongoose';
import { TradeInStatus } from '../enums/TradeInStatus';

@Service()
export class TradeInRepository extends BaseRepository {
  async getById(id: any): Promise<[boolean, ILegacyProductModel | string]> {
    try {
      const item = await ProductModel.findById(id).exec();
      if (!item) {
        return [true, Constants.MESSAGE.PRODUCT_GET_NOT_FOUND];
      }
      return [false, item];
    } catch (exception) {
      return [true, exception.message];
    }
  }
  async listTradeIns(params: {
    limit: number;
    offset: number;
    productId?: string;
    userId?: string;
  }) {
    let matchCondition = {
      trade_in: true,
    };
    if (params.productId) {
      matchCondition = {
        _id: mongoose.Types.ObjectId(params.productId),
        trade_in: true,
      } as any;
    }

    if (params.userId) {
      matchCondition = {
        user_id: mongoose.Types.ObjectId(params.userId),
        trade_in: true,
      } as any;
    }

    const total = await ProductModel.countDocuments(
      matchCondition as any
    ).exec();
    const options = [
      {
        $match: matchCondition,
      },
      lookup('users', 'user_id', '_id', 'user'),
      unwind('$user'),
      lookup('device_models', 'model_id', '_id', 'model'),
      unwind('$model'),
      {
        $project: {
          id: '$_id',
          user_id: 1,
          product_images: 1,
          trade_in_status: 1,
          varient_id: 1,
          attributes: 1,
          createdDate: 1,
          'category.category_name': 1,
          'model.model_name': 1,
          'model.model_name_ar': 1,
          'user.name': 1,
          'user.countryCode': '$user.countryCode',
          'user.mobileNumber': '$user.mobileNumber',
        },
      },
      {
        $skip: params.offset,
      },
      {
        $limit: params.limit,
      },
    ];

    let tradeIns = await ProductModel.aggregate(options)
      .sort({ createdDate: -1 })
      .exec();
    tradeIns = tradeIns.map((item: any) => {
      item.id = item._id;
      item.user.phone = `+${item.user.countryCode}${item.user.mobileNumber}`;
      item.image = item.product_images.pop();
      delete item._id;
      delete item.user.countryCode;
      delete item.user.mobileNumber;
      delete item.product_images;
      item.status = item?.trade_in_status || 'InProgress';
      item.createdDate = item?.createdDate;
      return item;
    });
    return {
      total,
      limit: params.limit,
      offset: params.offset,
      items: tradeIns,
    };
  }

  async loadTradeIn(
    productId: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    const options = [
      {
        $match: {
          _id: mongoose.Types.ObjectId(productId),
          trade_in: true,
        },
      },
      lookup('categories', 'category_id', '_id', 'category'),
      unwind('$category'),
      lookup('brands', 'brand_id', '_id', 'brands'),
      unwind('$brands'),
      lookup('device_models', 'model_id', '_id', 'models'),
      unwind('$models'),
      lookup('varients', 'varient_id', '_id', 'varients'),
      unwind('$varients'),
      lookup('users', 'user_id', '_id', 'seller'),
      unwind('$seller'),
      {
        $project: {
          product_id: '$_id',
          user_id: 1,
          category_id: 1,
          brand_id: 1,
          model_id: 1,
          varient_id: 1,
          varient: 1,
          sell_price: 1,
          bid_price: 1,
          product_images: 1,
          defected_images: 1,
          body_cracks: 1,
          description: 1,
          answer_to_questions: 1,
          answer_to_questions_ar: 1,
          score: 1,
          grade: 1,
          grade_ar: 1,
          current_bid_price: 1,
          favourited_by: 1,
          code: 1,
          sell_status: 1,
          status: 1,
          expiryDate: 1,
          isListedBefore: 1,
          createdDate: 1,
          'category.category_name': 1,
          'category.category_name_ar': 1,
          'brands.brand_name': 1,
          'brands.brand_name_ar': 1,
          'brands.brand_icon': 1,
          'models.model_name': 1,
          'models.model_name_ar': 1,
          'models.model_icon': 1,
          'models.current_price': 1,
          seller_id: '$seller._id',
          seller_name: '$seller.name',
          'varients.varient': 1,
          'varients.current_price': 1,
          answer_to_questions_migration: 1,
          answer_to_questions_ar_migration: 1,
          attributes: 1,
        },
      },
    ];
    const products = await ProductModel.aggregate(options).exec();
    return products[0];
  }
  async updateTradeInStatus(
    productId: string,
    status: TradeInStatus
  ): Promise<ILegacyProductModel> {
    return ProductModel.findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          trade_in_status: status,
        },
      },
      {
        upsert: true,
        new: true,
      }
    ).exec();
  }
}
