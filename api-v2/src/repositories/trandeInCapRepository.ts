import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { BaseRepository } from './BaseRepository';
import { TradeInCap, TradeInCapDocument } from '../models/TradeInCap';
import moment from 'moment';

@Service()
export class TradeInCapRepository extends BaseRepository {
  async getById(id: any): Promise<[boolean, TradeInCapDocument | string]> {
    try {
      const item = await TradeInCap.findById(id).exec();
      if (!item) {
        return [true, Constants.MESSAGE.DEVICE_TOKEN_NOT_FOUND];
      }
      return [false, item];
    } catch (exception) {
      return [true, exception.message];
    }
  }

  async createTradeInCap(
    modelId: string,
    userIds: string[]
  ): Promise<TradeInCapDocument> {
    return TradeInCap.create({
      modelId,
      userIds,
    });
  }

  async updateTradeInCap(
    modelId: string,
    userIds: string[]
  ): Promise<TradeInCapDocument> {
    const item: TradeInCapDocument = await TradeInCap.findOne({ modelId }).sort(
      {
        createdAt: -1,
      }
    );
    item.userIds = userIds;
    return item.save();
  }

  async getLatestInCurrentHour(
    modelId: string
  ): Promise<TradeInCapDocument | null> {
    return new Promise(async resolve => {
      const item = await TradeInCap.findOne({ modelId }).sort({
        createdAt: -1,
      });
      if (!item) {
        resolve(null);
      }
      const hour = moment(item.createdAt).format('YYYY-MM-DD HH');
      const currentHour = moment(new Date()).format('YYYY-MM-DD HH');
      if (!moment(hour).isSame(currentHour)) {
        resolve(null);
      }
      resolve(item);
    });
  }
}
