import moment from 'moment';
import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { mappingMongoError } from '../libs/mongoError';
import { Bid } from '../models/Bid';
import { BaseRepository } from './BaseRepository';

@Service()
export class BidRepository extends BaseRepository {
  async getById(
    bidId: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      if (!bidId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.BID_ID_NOT_FOUND,
          },
        ];
      }
      const data = await Bid.findById(bidId).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.BID_ID_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_BID,
          message: exception.message,
        },
      ];
    }
  }

  async updateBidStatus(
    bidIds: string[],
    state: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      if (bidIds.length === 0) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.BID_ID_NOT_FOUND,
          },
        ];
      }
      const query = {
        bidId: { $in: bidIds.map(elem => mongoose.Types.ObjectId(elem)) },
      };
      const updatedBid = await Bid.updateMany(query, {
        $set: {
          bid_status: state,
          lastStatusUpdatedDate: moment().toDate(),
        },
      });

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: updatedBid },
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
            result: Constants.ERROR_MAP.FAILED_TO_UPDATED_BID,
            message: exception.message,
          },
        ];
      }
    }
  }
}
