import _isEmpty from 'lodash/isEmpty';
import { ObjectId } from 'mongodb';
import {
  ClientSession,
  FilterQuery,
  isValidObjectId,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { mappingMongoError } from '../libs/mongoError';
import {
  DeviceToken,
  DeviceTokenDocument,
  DeviceTokenInput,
} from '../models/DeviceToken';
import { LegacyUser } from '../models/LegacyUser';
import {
  Notification,
  NotificationWithPushTokens,
} from '../models/Notification';
import {
  NotificationLog,
  NotificationLogDocument,
} from '../models/NotificationLog';
import { BaseRepository } from './BaseRepository';

@Service()
export class NotificationRepository extends BaseRepository {
  async getById(id: any): Promise<[boolean, DeviceTokenDocument | string]> {
    try {
      const deviceToken = await DeviceToken.findById(id)
        .select(
          'user_id fcm_token platform app_version status created_at updated_at'
        )
        .exec();
      if (!deviceToken) {
        return [true, Constants.MESSAGE.DEVICE_TOKEN_NOT_FOUND];
      }
      return [false, deviceToken];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async getAllDeviceTokens(
    page: number,
    size: number
  ): Promise<[boolean, string | DeviceTokenDocument[]]> {
    try {
      const deviceTokens = await DeviceToken.find()
        .select(
          'user_id device_id fcm_token platform lang app_version status created_at updated_at'
        )
        .skip(size * (page - 1))
        .limit(size)
        .exec();
      if (!deviceTokens) {
        return [true, Constants.MESSAGE.DEVICE_TOKEN_NOT_FOUND];
      }
      return [false, deviceTokens];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async getUserDeviceTokens(
    userId: string
  ): Promise<[boolean, DeviceTokenDocument[] | string]> {
    try {
      const userFcmTokens = await DeviceToken.find({
        user_id: Types.ObjectId(userId),
      })
        .select(
          'user_id device_id fcm_token platform lang app_version status created_at updated_at'
        )
        .exec();
      if (!userFcmTokens) {
        return [true, Constants.MESSAGE.DEVICE_TOKEN_NOT_FOUND];
      }
      return [false, userFcmTokens];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async getDeviceTokensOfListUsers(
    userIds: string[]
  ): Promise<[boolean, DeviceTokenDocument[] | string]> {
    try {
      const now = new Date();
      const userFcmTokens = await DeviceToken.find({
        user_id: { $in: userIds.map(i => Types.ObjectId(i)) },
      })
        .where({ updated_at: { $gte: now.setMonth(now.getMonth() - 2) } }) // must be active within the last 2 months
        .select(
          'user_id device_id fcm_token platform app_version status created_at updated_at'
        )
        .exec();
      if (!userFcmTokens) {
        return [true, Constants.MESSAGE.DEVICE_TOKEN_NOT_FOUND];
      }
      return [false, userFcmTokens];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async validateDeviceTokenInput(
    obj: DeviceTokenInput,
    checkExisting: boolean = true
  ): Promise<[boolean, string]> {
    if (obj.user_id) {
      const user = await LegacyUser.findById(obj.user_id).exec();
      if (!user) {
        return [true, Constants.MESSAGE.USER_IS_NOT_FOUND];
      }
    }

    if (checkExisting) {
      const existing = await DeviceToken.exists({
        device_id: obj.device_id,
        fcm_token: obj.fcm_token,
      });
      if (existing) {
        return [true, Constants.MESSAGE.DEVICE_TOKEN_DUPLICATE];
      }
    }

    return [false, ''];
  }

  async addDeviceToken(
    obj: DeviceTokenInput,
    session?: ClientSession
  ): Promise<[boolean, DeviceTokenDocument | string]> {
    try {
      const [validateErr, errMessage] = await this.validateDeviceTokenInput(
        obj
      );
      if (validateErr) return [validateErr, errMessage];

      const newDeviceToken: DeviceTokenDocument = new DeviceToken();
      newDeviceToken.user_id = obj.user_id;
      newDeviceToken.device_id = obj.device_id;
      newDeviceToken.fcm_token = obj.fcm_token;
      newDeviceToken.platform = obj.platform;
      newDeviceToken.lang = obj.lang || 'ar';
      newDeviceToken.app_version = obj.app_version;
      newDeviceToken.status = obj.status;
      const query: FilterQuery<DeviceTokenDocument> = {
        device_id: obj.device_id,
      };
      const updateQuery: UpdateQuery<DeviceTokenDocument> = {
        user_id: obj.user_id,
        device_id: obj.device_id,
        fcm_token: obj.fcm_token,
        platform: obj.platform,
        lang: obj.lang || 'ar',
        app_version: obj.app_version,
        status: obj.status,
      };
      const options: QueryOptions = {
        new: true,
        upsert: true,
        lean: true,
        fields: 'user_id device_id fcm_token app_version platform lang',
        ...(session && { session: session }),
      };
      const data = await DeviceToken.findOneAndUpdate(
        query,
        updateQuery,
        options
      );

      return [false, data];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, exception.message];
      }
    }
  }

  async updateDeviceToken(
    updatingObj: DeviceTokenInput
  ): Promise<[boolean, string | DeviceTokenDocument]> {
    try {
      const updatingDeviceToken: DeviceTokenDocument =
        await DeviceToken.findOne({ fcm_token: updatingObj.fcm_token }).exec();
      if (!updatingDeviceToken) {
        return [true, Constants.MESSAGE.DEVICE_TOKEN_NOT_FOUND];
      }

      updatingDeviceToken.user_id =
        new Types.ObjectId(updatingObj.user_id) || updatingDeviceToken.user_id;
      updatingDeviceToken.device_id =
        updatingObj.device_id || updatingDeviceToken.device_id;
      updatingDeviceToken.fcm_token =
        updatingObj.fcm_token || updatingDeviceToken.fcm_token;
      updatingDeviceToken.platform =
        updatingObj.platform || updatingDeviceToken.platform;
      updatingDeviceToken.lang = updatingObj.lang || updatingDeviceToken.lang;
      updatingDeviceToken.app_version =
        updatingObj.app_version || updatingDeviceToken.app_version;
      updatingDeviceToken.status =
        updatingObj.status || updatingDeviceToken.status;
      updatingDeviceToken.updated_at = new Date();
      await updatingDeviceToken.save();
      return [false, updatingDeviceToken];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        return [true, Constants.ERROR_MAP.DUPLICATE_REQUEST];
      } else {
        return [true, exception.message];
      }
    }
  }

  async removeDeviceToken(
    deviceToken: string,
    userId?: string
  ): Promise<[boolean, string | DeviceTokenDocument]> {
    try {
      if (deviceToken === 'all') {
        await DeviceToken.deleteMany({});

        return [false, 'Delete all'];
      }
      const deletingDeviceToken: DeviceTokenDocument =
        await DeviceToken.findOne({
          fcm_token: deviceToken,
          user_id: userId,
        }).exec();
      if (!deletingDeviceToken) {
        return [true, Constants.MESSAGE.DEVICE_TOKEN_NOT_FOUND];
      }

      const deletedResult = await deletingDeviceToken.remove();

      return [false, deletedResult];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async removeUserDeviceToken(
    userId: string
  ): Promise<[boolean, string | DeviceTokenDocument]> {
    try {
      const { ok, deletedCount } = await DeviceToken.deleteMany({
        user_id: userId,
      }).exec();
      if (ok) {
        return [false, `There are ${deletedCount} tokens removed`];
      } else {
        return [true, Constants.MESSAGE.FAILED_TO_REMOVE_DEVICE_TOKEN];
      }
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async getAllNotificationLogs(
    page: number,
    size: number
  ): Promise<[boolean, string | NotificationLogDocument[]]> {
    try {
      const logs = await NotificationLog.find()
        .select('notificationInput activityType messages response createdDate')
        .skip(size * (page - 1))
        .limit(size)
        .exec();
      if (!logs) {
        return [true, Constants.MESSAGE.NOTIFICATION_LOG_NOT_FOUND];
      }
      return [false, logs];
    } catch (exception) {
      return [true, exception.message];
    }
  }
  async getNotificationList(
    activityTypes?: string[] | string,
    page?: number,
    pageSize?: number
  ): Promise<[boolean, string | NotificationWithPushTokens[]]> {
    try {
      if (!page) {
        page = 1;
        pageSize = 250;
      }
      const notificationResult: NotificationWithPushTokens[] =
        await Notification.aggregate([
          {
            $match: {
              pushMessageSent: { $in: [null, 0] },
              proceededByPushCron: { $in: [null, 0] },
              createdDate: {
                $gte: new Date(process.env.EFFECTIVE_DATE || '2022-05-09'),
              },
              ...(Array.isArray(activityTypes) && {
                activityType: { $in: activityTypes },
              }),
              ...(typeof activityTypes === 'string' && {
                activityType: activityTypes,
              }),
            },
          },
          {
            $lookup: {
              from: 'DeviceToken',
              localField: 'userData.id',
              foreignField: 'user_id',
              as: 'push_tokens',
            },
          },
          {
            $project: {
              _id: 1,
              productData: 1,
              userData: 1,
              activityType: 1,
              pushMessageSent: 1,
              proceededByPushCron: 1,
              seenDate: 1,
              createdDate: 1,
              push_tokens: {
                _id: 1,
                platform: 1,
                fcm_token: 1,
                status: 1,
              },
            },
          },
          {
            $sort: {
              createdDate: 1,
            },
          },
        ])
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .exec();

      if (!_isEmpty(notificationResult)) {
        return [false, notificationResult];
      }
      return [false, []];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async markNotificationProceeded(ids: ObjectId[]): Promise<[boolean, string]> {
    const result = await Notification.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          proceededByPushCron: true,
        },
      }
    ).exec();
    return [true, JSON.stringify(result)];
  }

  async markNotificationSent(ids: ObjectId[]): Promise<[boolean, string]> {
    const result = await Notification.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          proceededByPushCron: true,
          pushMessageSent: 1,
          pushMessageSentAt: new Date(),
        },
      }
    ).exec();
    return [true, JSON.stringify(result)];
  }

  async deleteNotificationLogs(id: string) {
    if (isValidObjectId(id)) {
      return NotificationLog.deleteOne({ _id: new Types.ObjectId(id) }).exec();
    } else {
      return await NotificationLog.deleteMany({});
    }
  }

  async saveNotificationLogs(
    inputList: any,
    messages: any,
    response: any,
    activityTypes: string[]
  ) {
    const notificationLog = new NotificationLog();
    notificationLog.notificationInput = inputList;
    notificationLog.messages = messages;
    notificationLog.response = response;
    notificationLog.activityType = activityTypes.join(',');
    const result = await notificationLog.save();
    return [false, result];
  }
}
