import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { Brand } from '../models/Brand';
@Service()
export class AddOnRepository {
  async getAddOns(
    brandId: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const option = {
        _id: new mongoose.Types.ObjectId(brandId),
        is_add_on_enabled: true,
      };

      const data = await Brand.find(option).select('add_ons').exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.BRAND_NOT_FOUND,
          },
        ];
      }
      const addOns = data.map(addOn => addOn.add_ons);
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: addOns }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_BRAND,
          message: exception.message,
        },
      ];
    }
  }
  async addOnSummary(
    brandId: string,
    selectedIds: string[]
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const aggregationPipeline: any[] = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(brandId),
            is_add_on_enabled: true,
          },
        },
        {
          $project: {
            _id: 0,
            add_ons: {
              $filter: {
                input: '$add_ons',
                as: 'addOn',
                cond: { $in: ['$$addOn.id', selectedIds] },
              },
            },
          },
        },
      ];

      const data = await Brand.aggregate(aggregationPipeline);
      if (!data?.length || !data[0]?.add_ons?.length) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: null,
          },
        ];
      }

      const addOns = data[0].add_ons;

      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: addOns }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: null,
          message: exception.message,
        },
      ];
    }
  }
}
