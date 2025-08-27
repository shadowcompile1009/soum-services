import { Service } from 'typedi';
import mongoose from 'mongoose';
import { Constants } from '../constants/constant';
import { PaymentLogs } from '../models/PaymentLogs';
import { BaseRepository } from './BaseRepository';

@Service()
export class PaymentLogRepository extends BaseRepository {
  async getById(
    id: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const data = await PaymentLogs.findById(id).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT_LOG,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT_LOG,
          message: exception.message,
        },
      ];
    }
  }
  async addNewPaymentLogs(
    orderId: string,
    data: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const paymentLogs = new PaymentLogs({
        order: new mongoose.Types.ObjectId(orderId),
        data: data,
      });
      await paymentLogs.save();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: 'Created payment logs successfully',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_CREATE_PAYMENT_LOG,
          message: exception.message,
        },
      ];
    }
  }
}
