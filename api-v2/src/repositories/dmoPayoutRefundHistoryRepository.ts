import { Service } from 'typedi';
import mongoose from 'mongoose';
import { Constants } from '../constants/constant';
import {
  DmoPayoutRefundHistory,
  DmoPayoutRefundHistoryDocument,
  PayoutRefundHistoryInput,
} from '../models/DmoPayoutRefundHistory';
import { BaseRepository } from './BaseRepository';
import { ErrorResponseDto } from '../dto/errorResponseDto';

@Service()
export class DmoPayoutRefundHistoryRepository implements BaseRepository {
  async getById(id: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DmoPayoutRefundHistoryDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DmoPayoutRefundHistory.findById(id).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PAYOUT_REFUND_HISTORY,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PAYOUT_REFUND_HISTORY,
          message: exception.message,
        },
      ];
    }
  }

  async getExistingTransactionId(
    transactionId: string
  ): Promise<
    [boolean, { code: number; result: boolean | string; message?: string }]
  > {
    try {
      const data = await DmoPayoutRefundHistory.findOne({
        dmoTransactionId: transactionId,
      }).exec();

      if (!data) {
        return [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: false,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: true }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PAYOUT_REFUND_HISTORY,
          message: exception.message,
        },
      ];
    }
  }
  async addPayoutRefundHistory(
    inputLog: PayoutRefundHistoryInput
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const paymentLog = new DmoPayoutRefundHistory({
        dmoTransactionId: inputLog.dmoTransactionId,
        orderId: new mongoose.Types.ObjectId(inputLog.orderId),
        transactionType: inputLog.transactionType,
        transactionStatus: inputLog.transactionStatus,
        paymentMethod: inputLog.paymentMethod,
        amount: inputLog.amount,
        paymentGatewayTransactionId: inputLog.paymentGatewayTransactionId,
        transactionTimestamp: inputLog.transactionTimestamp,
        transactionTimestampFromHyperpay:
          inputLog.transactionTimestampFromHyperpay,
        doneBy: inputLog.doneBy,
        swift: inputLog?.swift,
      });
      await paymentLog.save();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: 'Payment history is added successfully',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_CREATE_PAYMENT_HISTORY,
          message: exception.message,
        },
      ];
    }
  }
  async getSuccessPayoutRefundTransaction(
    orderId: string,
    transactionType?: string,
    paymentMethod?: string
  ): Promise<boolean> {
    try {
      const filterOption: mongoose.FilterQuery<DmoPayoutRefundHistoryDocument> =
        {
          orderId: new mongoose.Types.ObjectId(orderId),
          $or: [
            { transactionStatus: 'Success' },
            { transactionStatus: 'Completed' },
          ],
        };
      if (transactionType) {
        filterOption.transactionType = transactionType;
      }
      if (paymentMethod) {
        filterOption.paymentMethod = paymentMethod;
      }
      const data = await DmoPayoutRefundHistory.findOne(filterOption).exec();

      if (!data) {
        return false;
      }
      return true;
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_SUCCESS_PAYOUT_REFUND_TRANSACTION,
        exception.message
      );
    }
  }
}
