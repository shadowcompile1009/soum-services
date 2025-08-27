import { Service } from 'typedi';
import mongoose from 'mongoose';
import { Constants } from '../constants/constant';
import {
  PriceNudgingHistory,
  PriceNudgingHistoryDocument,
} from '../models/PriceNudgingHistory';
import { formatPriceInDecimalPoints } from '../util/common';
import logger from '../util/logger';
@Service()
export class PriceNudgingHistoryRepository {
  async addPriceNudgingHistory(
    productId: string,
    sellPrice: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: PriceNudgingHistoryDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      await PriceNudgingHistory.updateMany(
        {
          status: 'Active',
          product: new mongoose.Types.ObjectId(productId),
        },
        { status: 'Deleted' }
      );
      const priceNudgingLogDocument = new PriceNudgingHistory({
        product: new mongoose.Types.ObjectId(productId),
        recommendedPrice: formatPriceInDecimalPoints(Number(sellPrice), 2),
      });
      const data = await priceNudgingLogDocument.save();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      logger.error(exception);
    }
  }

  async getPriceNudgingHistoryByProductId(productId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: PriceNudgingHistoryDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await PriceNudgingHistory.find({
        product: new mongoose.Types.ObjectId(productId),
      }).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PRICE_NUDGING_HISTORY,
          message: exception.message,
        },
      ];
    }
  }
}
