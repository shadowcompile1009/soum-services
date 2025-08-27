import { Constants } from '../constants/constant';
import { Service } from 'typedi';
import { Types } from 'mongoose';
import { BannerDocument, BannerInput, BannerModel } from '../models/Banner';
import { BannerFilterDto } from '../dto/banner/BannerFilterDto';
import { BaseRepository } from './BaseRepository';
@Service()
export class BannerRepository extends BaseRepository {
  async getById(
    bannerId: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      if (!bannerId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.BANNER_ID_NOT_FOUND,
            message: Constants.MESSAGE.BANNER_NOT_FOUND,
          },
        ];
      }
      const data = await BannerModel.findById(bannerId).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.BANNER_ID_NOT_FOUND,
            message: Constants.MESSAGE.BANNER_NOT_FOUND,
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
          message: Constants.MESSAGE.BANNER_UPDATE_SUCCESS,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.BANNER_ID_NOT_FOUND,
          message: Constants.MESSAGE.FAILED_TO_UPDATE_BANNER_POSITION,
        },
      ];
    }
  }
  async addBanner(
    bannerInput: BannerInput
  ): Promise<
    [
      boolean,
      { code: number; result: BannerDocument | string; message?: string }
    ]
  > {
    try {
      const createBanner = new BannerModel({
        banner_name: bannerInput.bannerName,
        banner_image: bannerInput.bannerImage,
        banner_type: bannerInput.bannerType,
        banner_page: bannerInput.bannerPage,
        banner_position: bannerInput.bannerPosition,
        banner_value: bannerInput.bannerValue,
        lang: bannerInput.lang,
        type: bannerInput.type,
      });
      const data = await createBanner.save();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
          message: Constants.MESSAGE.BANNER_CREATE_SUCCESS,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_CREATE_BANNER,
          message: exception.message,
        },
      ];
    }
  }
  async removeBanner(
    bannerId: string
  ): Promise<[boolean, { code: number; result: string; message?: string }]> {
    try {
      await BannerModel.findOneAndDelete({
        _id: bannerId,
      }).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: bannerId,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_REMOVE_BANNER,
          message: exception.message,
        },
      ];
    }
  }
  async getBanners(
    filter: BannerFilterDto
  ): Promise<
    [boolean, { code: number; result: BannerDocument[]; message?: string }]
  > {
    try {
      const option: Record<string, unknown> = {};

      if (filter.bannerPage[0] !== '' && filter.bannerPage.length > 0) {
        option.banner_page = { $in: filter.bannerPage };
      }
      if (filter.bannerPosition[0] !== '' && filter.bannerPosition !== '') {
        option.banner_position = { $in: filter.bannerPosition };
      }
      if (filter.region[0] !== '' && filter.region !== '') {
        option.region = { $in: filter.region };
      }
      if (filter.lang[0] !== '' && filter.lang !== '') {
        option.lang = { $in: filter.lang };
      }
      if (filter.type !== '') {
        option.type = { $eq: filter.type };
      } else {
        option.type = { $ne: 'cars' };
      }
      const banners = await BannerModel.find(option)
        .sort({ position: 1 })
        .exec();
      if (!banners) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: [],
            message: Constants.ERROR_MAP.BANNER_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: banners }];
    } catch (exception) {
      return [true, exception.message];
    }
  }
  async updateBannerPosition(
    id: string,
    position: any
  ): Promise<[boolean, { code: number; result: string; message?: string }]> {
    try {
      const data = await BannerModel.updateOne(
        { _id: Types.ObjectId(id) },
        { $set: { position } },
        { upsert: true }
      );
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_BANNER_POSITION,
            message: Constants.MESSAGE.FAILED_TO_UPDATE_BANNER_POSITION,
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: Constants.MESSAGE.BANNER_UPDATE_SUCCESS,
          message: Constants.MESSAGE.BANNER_UPDATE_SUCCESS,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_BANNER_POSITION,
          message: exception.message,
        },
      ];
    }
  }

  async updateBanner(
    bannerId: string,
    updateData: BannerDocument
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      // Attempt to update the banner
      const result = await BannerModel.updateOne(
        { _id: bannerId },
        { $set: updateData },
        { new: true }
      ).exec();

      // Check if the update was successful
      if (!result) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.NOT_FOUND,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_BANNER,
            message: Constants.MESSAGE.FAILED_TO_UPDATE_BANNER,
          },
        ];
      }

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: updateData,
          message: Constants.MESSAGE.BANNER_UPDATE_SUCCESS,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_BANNER,
          message: exception.message,
        },
      ];
    }
  }
}
