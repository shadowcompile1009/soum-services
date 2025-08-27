import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { mappingMongoError } from '../libs/mongoError';
import { Activity } from '../models/Activity';
import { BaseRepository } from './BaseRepository';

@Service()
export class ActivityRepository extends BaseRepository {
  async getById(
    activityId: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      if (!activityId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ACTIVITY_ID_NOT_FOUND,
          },
        ];
      }
      const data = await Activity.findById(activityId).exec();
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

  async createActivity(
    creatorIds: string[],
    productId: string,
    activityType: string,
    questionId?: string
  ): Promise<[boolean, { code: number; result: string; message?: string }]> {
    try {
      const activityArr = [];
      for (const userId of creatorIds) {
        const activity = new Activity({
          creatorId: mongoose.Types.ObjectId(userId),
          productId: mongoose.Types.ObjectId(productId),
          activityType: activityType,
          questionId: mongoose.Types.ObjectId(questionId),
        });
        activityArr.push(activity);
      }
      await Activity.insertMany(activityArr);
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: 'Created activity' },
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
