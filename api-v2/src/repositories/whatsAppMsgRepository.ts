import { Service } from 'typedi';
import moment from 'moment';
import { mappingMongoError } from '../libs/mongoError';
import { Constants } from '../constants/constant';
import { BaseRepository } from './BaseRepository';
import { WhatsAppMsg, WhatsAppMsgDocument } from '../models/WhatsAppMsg';
import { WhatsAppMsgReportDto } from '../dto/whatsappMsg/whatsAppMsgDto';
@Service()
export class WhatsAppMsgRepository implements BaseRepository {
  async getList(
    offset: number,
    limit: number,
    searchOption: string = ''
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any | string;
        message?: string;
      }
    ]
  > {
    try {
      let queryDMOFunc = WhatsAppMsg.find()
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 });
      const matchCondition: any = {};
      if (searchOption.length > 0) {
        const order = await WhatsAppMsg.findOne({
          orderNumber: searchOption,
        });
        if (order) {
          matchCondition.orderId = order._id;
          queryDMOFunc = WhatsAppMsg.find(matchCondition as any).sort({
            createdAt: -1,
          });
        }
      }
      const data = await queryDMOFunc.exec();
      const total = await WhatsAppMsg.countDocuments(
        matchCondition as any
      ).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: {
            total,
            limit,
            offset,
            data,
          },
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
            result: Constants.ERROR_MAP.FAILED_TO_GET_WAMSG,
            message: exception.message,
          },
        ];
      }
    }
  }
  async getListByDmoIds(dmoIds: string[]): Promise<
    [
      boolean,
      {
        code: number;
        result: WhatsAppMsgDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const msgs = await WhatsAppMsg.find({ dmoId: { $in: dmoIds } })
        .sort({ createdAt: -1 })
        .exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: msgs,
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
            result: Constants.ERROR_MAP.FAILED_TO_GET_WAMSG,
            message: exception.message,
          },
        ];
      }
    }
  }
  async getById(id: string): Promise<
    [
      boolean,
      {
        code: number;
        result: WhatsAppMsgDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await WhatsAppMsg.findById(id).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_WAMSG,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_WAMSG,
          message: exception.message,
        },
      ];
    }
  }

  async update(
    condition: any,
    data: any
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const doc = await WhatsAppMsg.findOneAndUpdate(
        condition,
        {
          $set: data,
        },
        {
          new: true,
        }
      ).exec();

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: doc.toObject() },
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
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_WAMSG,
            message: exception.message,
          },
        ];
      }
    }
  }

  async find(condition: Record<string, unknown>): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const doc = await WhatsAppMsg.findOne(condition);

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: doc.toObject() },
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
            result: Constants.ERROR_MAP.FAILED_TO_GET_WAMSG,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getByPhone(
    phoneNumber: string,
    templateName: string,
    productId: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: WhatsAppMsgDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      let data;
      if (productId !== '') {
        data = await WhatsAppMsg.findOne({
          phoneNumber,
          templateName,
          productId,
        }).exec();
      } else {
        const messages = await WhatsAppMsg.find({
          phoneNumber,
          templateName,
        })
          .sort({ createdAt: -1 })
          .exec();
        if (messages?.length) {
          data = messages[0];
        }
      }
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_WAMSG,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_WAMSG,
          message: exception.message,
        },
      ];
    }
  }

  async getSellerEngagementMessageByPhone(phoneNumber: string): Promise<
    [
      boolean,
      {
        code: number;
        result: WhatsAppMsgDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await WhatsAppMsg.findOne({
        phoneNumber,
        templateType: 'seller_engagement_message',
      }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_WAMSG,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_WAMSG,
          message: exception.message,
        },
      ];
    }
  }

  async getWAMResponseWithinPeriod(period: string = 'day'): Promise<
    [
      boolean,
      {
        code: number;
        result: WhatsAppMsgReportDto[] | string;
        message?: string;
      }
    ]
  > {
    try {
      let wamResponses: WhatsAppMsgReportDto[] = [];
      if (period === 'day') {
        const startDate = moment().subtract(1, 'days').toDate();
        const aggregate = [
          {
            $match: {
              updatedAt: { $gte: startDate, $lt: new Date() },
              templateName: 'seller_deletion_nudge',
            },
          },
          {
            $project: {
              _id: 0,
              phoneNumber: 1,
              updatedAt: 1,
              userResponse: 1,
            },
          },
        ];
        wamResponses = await WhatsAppMsg.aggregate(aggregate).exec();
      }

      return [
        false,
        {
          code: 200,
          result: wamResponses,
          message: 'Get daily payout successful',
        },
      ];
    } catch (exception) {
      return [true, { code: 400, result: [], message: exception.toString() }];
    }
  }

  async sellerReceivedReminderForAProductAskSeller(
    userId: string,
    productId: string,
    senderId: string
  ) {
    try {
      return await WhatsAppMsg.exists({
        userId: userId,
        productId: productId,
        senderId: senderId,
        templateName: process.env.FRESHCHAT_SELLER_REMINDER,
      });
    } catch (exception) {
      return false;
    }
  }
}
