import { Service } from 'typedi';
import moment from 'moment';
import mongoose from 'mongoose';
import { Constants } from '../constants/constant';
import { PayoutHistory, PayoutHistoryInput } from '../models/PayoutHistory';
import { BaseRepository } from './BaseRepository';
import { DailyPayoutSellerReportDto } from '../dto/order/DailyPayoutSellerReportDto';

type Periods = 'day' | 'week' | 'month';
@Service()
export class PayoutHistoryRepository extends BaseRepository {
  async getById(
    id: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const data = await PayoutHistory.findById(id).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PAYOUT_HISTORY,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PAYOUT_HISTORY,
          message: exception.message,
        },
      ];
    }
  }
  async checkSuccessPayout(
    orderId: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const data = await PayoutHistory.findOne({
        order: new mongoose.Types.ObjectId(orderId),
        status: 'Successful',
      }).exec();
      if (data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.PAYOUT_ALREADY_COMPLETED,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: null }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PAYOUT_HISTORY,
          message: exception.message,
        },
      ];
    }
  }
  async addNewPayoutHistory(
    payout: PayoutHistoryInput
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const paymentLogs = new PayoutHistory({
        order: new mongoose.Types.ObjectId(payout.order),
        product: new mongoose.Types.ObjectId(payout.product),
        seller: new mongoose.Types.ObjectId(payout.seller),
        hyper_splits_id: payout.hyper_splits_id,
        pay_amount: payout.pay_amount,
        commission: Number(payout.commission),
        commission_amount: Number(payout.commission_amount),
        vat: Number(payout.vat),
        shipping_charge: Number(payout.shipping_charge),
        bank_name: payout.bank_name,
        iban: payout.iban,
        made_by: payout.made_by,
        status: payout.status,
        transaction_timestamp: payout.transaction_timestamp,
        swift: payout?.swift,
      });
      await paymentLogs.save();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: 'New payout history is added successfully',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_CREATE_PAYOUT_HISTORY,
          message: exception.message,
        },
      ];
    }
  }

  async getPayoutHistory(
    orderId: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const data = await PayoutHistory.find({
        order: new mongoose.Types.ObjectId(orderId),
      }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PAYOUT_HISTORY,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PAYOUT_HISTORY,
          message: exception.message,
        },
      ];
    }
  }

  async getAllPayoutWithinPeriod(period: Periods = 'day'): Promise<
    [
      boolean,
      {
        code: number;
        result: DailyPayoutSellerReportDto[] | string;
        message?: string;
      }
    ]
  > {
    try {
      let payouts: DailyPayoutSellerReportDto[] = [];
      if (period === 'day') {
        const startDate = moment().subtract(1, 'days').toDate();
        const aggregate = [
          {
            $match: {
              created_at: { $gte: startDate, $lt: new Date() },
            },
          },
          {
            $lookup: {
              from: 'orders',
              localField: 'order',
              foreignField: '_id',
              as: 'order',
            },
          },
          {
            $unwind: {
              path: '$order',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'products',
              localField: 'product',
              foreignField: '_id',
              as: 'product',
            },
          },
          {
            $unwind: {
              path: '$product',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'seller',
              foreignField: '_id',
              as: 'seller',
            },
          },
          {
            $unwind: {
              path: '$seller',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'device_models',
              localField: 'product.model_id',
              foreignField: '_id',
              as: 'model',
            },
          },
          {
            $unwind: {
              path: '$model',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'varients',
              localField: 'product.varient_id',
              foreignField: '_id',
              as: 'varient_id',
            },
          },
          {
            $unwind: {
              path: '$varient',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 0,
              order_id: '$order.order_number',
              hyper_splits_id: 1,
              transaction_timestamp: 1,
              made_by: 1,
              product_id: '$product._id',
              product_name: '$model.model_name',
              variant: '$varient_id.varient',
              seller_name: '$seller.name',
              seller_mobile: '$seller.mobileNumber',
              product_sell_price: '$product.sell_price',
              commission: 1,
              commission_amount: 1,
              vat: 1,
              shipping_charge: 1,
              pay_amount: 1,
              bank_name: 1,
              iban: 1,
            },
          },
        ];
        payouts = await PayoutHistory.aggregate(aggregate).exec();
      }

      return [
        false,
        { code: 200, result: payouts, message: 'Get daily payout successful' },
      ];
    } catch (exception) {
      return [true, { code: 400, result: [], message: exception.toString() }];
    }
  }
}
