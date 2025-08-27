import moment from 'moment';
import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { mappingMongoError } from '../libs/mongoError';
import {
  AdminChangePriceHistoryModel,
  IAdminChangePriceHistoryModel,
} from '../models/AdminChangePriceHistory';
import { BaseRepository } from './BaseRepository';
import { ProductModel } from '../models/LegacyProducts';
import { Admin } from '../models/Admin';

@Service()
export class AdminChangePriceHistoryRepository extends BaseRepository {
  async getById(
    logId: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      if (!logId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ID_NOT_FOUND,
          },
        ];
      }
      const data = await AdminChangePriceHistoryModel.findById(logId).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ADMIN_ID_LOG_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_EDIT_PRICE_LOG,
          message: exception.message,
        },
      ];
    }
  }

  async createLog(
    userId: string,
    productId: string,
    des: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const log = new AdminChangePriceHistoryModel({
        userId: new mongoose.Types.ObjectId(userId),
        productId: new mongoose.Types.ObjectId(productId),
        description: des,
        createdDate: moment().toDate(),
      });
      const savedLog = await log.save();
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: savedLog },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_ADD_LOG,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getAdminLog(productId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: IAdminChangePriceHistoryModel[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const logs = await AdminChangePriceHistoryModel.find({
        productId: new mongoose.Types.ObjectId(productId),
      })
        .populate({
          path: 'userId',
          model: Admin,
          select: { _id: 1, name: 1 },
        })
        .populate({
          path: 'productId',
          model: ProductModel,
          select: { _id: 1, sell_price: 1, bid_price: 1 },
        })
        .exec();
      if (!logs) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: logs }];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_ADMIN_LOG,
            message: exception.message,
          },
        ];
      }
    }
  }
}
