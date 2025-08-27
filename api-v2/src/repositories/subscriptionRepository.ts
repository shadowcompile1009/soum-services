import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { mappingMongoError } from '../libs/mongoError';
import { Subscription } from '../models/Subscription';
import { BaseRepository } from './BaseRepository';

@Service()
export class SubscriptionRepository extends BaseRepository {
  async getById(
    subscriptionID: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      if (!subscriptionID) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ACTIVITY_ID_NOT_FOUND,
          },
        ];
      }
      const data = await Subscription.findById(subscriptionID).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ACTIVITY_ID_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.ACTIVITY_ID_NOT_FOUND,
          message: exception.message,
        },
      ];
    }
  }

  async createSubscription(
    creatorIds: string[],
    productId: string,
    activityType: string,
    questionId?: string
  ): Promise<[boolean, { code: number; result: string; message?: string }]> {
    try {
      const activityArr = [];
      for (const userId of creatorIds) {
        const activity = new Subscription({
          creatorId: mongoose.Types.ObjectId(userId),
          userId: mongoose.Types.ObjectId(userId),
          productId: mongoose.Types.ObjectId(productId),
          activityType: activityType,
          questionId: mongoose.Types.ObjectId(questionId),
        });
        activityArr.push(activity);
      }
      await Subscription.insertMany(activityArr);
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: 'Created subscription',
        },
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
            result: Constants.ERROR_MAP.FAILED_TO_CREATE_ACTIVITY,
            message: exception.message,
          },
        ];
      }
    }
  }
}
