import { Service } from 'typedi';
import mongoose from 'mongoose';
import { Constants } from '../constants/constant';
import { RefundDocument, Refund } from '../models/Refund';
import moment from 'moment';
import { OrderModel } from '../models/Order';
@Service()
export class RefundRepository {
  async getByOrderId(
    orderId: string
  ): Promise<
    [
      boolean,
      { code: number; result: RefundDocument[] | string; message?: string }
    ]
  > {
    try {
      const data = await Refund.where({
        order: mongoose.Types.ObjectId(orderId),
      }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_REFUNDS_FOR_ORDER,
          message: exception.message,
        },
      ];
    }
  }

  async createRefundAction(
    refundDocument: RefundDocument
  ): Promise<
    [
      boolean,
      { code: number; result: RefundDocument | string; message?: string }
    ]
  > {
    try {
      const data = await Refund.create(refundDocument);
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_CREATE_REFUND_ORDER,
            message: Constants.MESSAGE.FAILED_TO_CREATE_REFUND_ORDER,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_CREATE_REFUND_ORDER,
          message: exception.message,
        },
      ];
    }
  }

  async updateRefundAction(
    refundActionId: mongoose.Types.ObjectId,
    updateObject: any
  ): Promise<
    [
      boolean,
      { code: number; result: RefundDocument | string; message?: string }
    ]
  > {
    try {
      const data = await Refund.updateOne(
        { _id: refundActionId },
        updateObject
      ).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_REFUND_ACTION,
            message: Constants.MESSAGE.FAILED_TO_UPDATE_REFUND_ACTION,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_REFUND_ACTION,
          message: exception.message,
        },
      ];
    }
  }

  async getRefundOrdersWithinPeriod(
    dateUnit: string,
    interval: number = 1
  ): Promise<
    [
      boolean,
      { code: number; result: RefundDocument[] | string; message?: string }
    ]
  > {
    try {
      const startingDate = moment()
        .subtract(interval as any, dateUnit as any)
        .toDate();
      const data = await Refund.where({
        created_at: { $gte: startingDate },
      })
        .populate({
          path: 'order',
          model: OrderModel,
          populate: [
            {
              path: 'product',
              populate: ['model_id', 'varient_id'],
            },
            {
              path: 'buyer',
            },
          ],
        })
        .exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_REFUND_ORDERS,
            message: Constants.MESSAGE.FAILED_TO_GET_REFUND_ORDERS,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_REFUND_ORDERS,
          message: exception.message,
        },
      ];
    }
  }
}
