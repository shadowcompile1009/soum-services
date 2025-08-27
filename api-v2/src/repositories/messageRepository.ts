import moment from 'moment';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { mappingMongoError } from '../libs/mongoError';
import { Message } from '../models/Message';

@Service()
export class MessageRepository {
  constructor() {}
  async getMessage(language: string, client_type: string, key: string) {
    try {
      const msg = (await Message.findOne({
        client_type: client_type,
        message: {
          $exists: true,
          $elemMatch: {
            [key]: {
              $exists: true,
            },
          },
        },
        deleted_date: {
          $eq: null,
        },
      })
        .select('client_type message')
        .exec()) as any;

      if (!msg) {
        return [true, Constants.ERROR_MAP.CONTENT_MSG_NOT_FOUND];
      }

      const data = msg.message[0][key][language];
      if (!data) {
        return [true, Constants.ERROR_MAP.SUPPORTED_LANGUAGE_NOT_FOUND];
      }

      return [false, data];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_GET_MESSAGE];
    }
  }

  async updateMessage(
    language: string,
    client_type: string,
    key: string,
    value: string
  ) {
    try {
      const condition = {
        client_type: client_type,
        message: {
          $exists: true,
          $elemMatch: {
            [key]: {
              $exists: true,
            },
          },
        },
      };
      const msg = (await Message.findOne(condition).exec()) as any;

      if (!msg) {
        return [true, Constants.ERROR_MAP.CONTENT_MSG_NOT_FOUND];
      }

      msg.message[0][key][language] = value;
      msg.markModified('message');
      await msg.save();

      return [false, 'Update message successfully'];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_UPDATE_MESSAGE];
    }
  }

  async createMessage(client_type: string, value: string) {
    try {
      const msg = new Message({
        client_type: client_type,
        message: [JSON.parse(value)],
      });
      const newMsg = await msg.save();
      return [false, newMsg];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, Constants.ERROR_MAP.FAILED_TO_CREATE_MESSAGE];
      }
    }
  }

  async removeMessage(id: string) {
    try {
      const msg = (await Message.findOne({
        _id: id,
        deleted_date: null,
      }).exec()) as any;

      if (!msg) {
        return [true, Constants.ERROR_MAP.CONTENT_MSG_NOT_FOUND];
      }

      msg.deleted_date = moment().toDate();
      await msg.save();
      return [false, 'Deleted message'];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_DELETE_MESSAGE];
    }
  }
}
