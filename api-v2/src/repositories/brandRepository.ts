import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { mappingMongoError } from '../libs/mongoError';
import {
  Brand,
  BrandDocument,
  BrandFilterOptions,
  BrandInput,
} from '../models/Brand';
import { CategoryStatus } from '../enums/CategoryStatus';
import { BaseRepository } from './BaseRepository';
import { Category } from '../models/Category';
@Service()
export class BrandRepository extends BaseRepository {
  async getById(
    brandId: string
  ): Promise<
    [
      boolean,
      { code: number; result: BrandDocument | string; message?: string }
    ]
  > {
    try {
      if (!brandId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.BRAND_NOT_FOUND,
          },
        ];
      }
      const data = await Brand.findById(brandId).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.BRAND_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
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

  async getAllBrands(
    filterOptions: BrandFilterOptions = {}
  ): Promise<
    [boolean, { code: number; result: BrandDocument[]; message?: string }]
  > {
    try {
      const filter: any = { status: 'Active' };

      if (filterOptions.migratedToCategory !== undefined) {
        if (filterOptions.migratedToCategory) {
          filter.migrated_to_category = true;
        } else {
          filter.$or = [
            { migrated_to_category: { $exists: false } },
            { migrated_to_category: false },
          ];
        }
      }

      const query = Brand.find(filter);
      if (filterOptions.limit) {
        query.limit(filterOptions.limit);
      }
      const data = await query.exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: [],
            message: Constants.ERROR_MAP.BRAND_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: [],
          message: exception.message,
        },
      ];
    }
  }

  async getBrandListViaCategory(
    categoryId: string
  ): Promise<
    [
      boolean,
      { code: number; result: BrandDocument[] | string; message?: string }
    ]
  > {
    try {
      let option = {};
      if (categoryId) {
        option = {
          category_id: new mongoose.Types.ObjectId(categoryId),
          status: CategoryStatus.ACTIVE,
        };
      }
      const data = await Brand.find(option).sort({ position: 1 }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.BRAND_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
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

  async createBrand(
    brand: BrandInput
  ): Promise<
    [
      boolean,
      { code: number; result: BrandDocument | string; message?: string }
    ]
  > {
    try {
      const existingCategoryId = await Category.exists({
        _id: new mongoose.Types.ObjectId(brand.category_id),
      });

      if (!existingCategoryId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.CATEGORY_ID_NOT_FOUND,
            message: Constants.MESSAGE.FAILED_TO_CREATE_BRAND,
          },
        ];
      }

      const where = {
        brand_name: { $regex: '.*' + brand.brand_name + '.*', $options: 'i' },
        brand_name_ar: {
          $regex: '.*' + brand.brand_name_ar + '.*',
          $options: 'i',
        },
        status: { $ne: 'Delete' },
      };
      const existingBrand = await Brand.findOne(where).exec();
      if (existingBrand) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ALREADY_EXISTING_BRAND,
            message: Constants.MESSAGE.FAILED_TO_CREATE_BRAND,
          },
        ];
      }

      const createdBrand = new Brand({
        brand_name: brand.brand_name,
        brand_name_ar: brand.brand_name_ar,
        brand_icon: brand.brand_icon,
        category_id: brand.category_id
          ? new mongoose.Types.ObjectId(brand.category_id)
          : null,
        status: brand.status,
        position: brand.position,
      });
      const data = await createdBrand.save();

      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
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
            result: Constants.ERROR_MAP.FAILED_TO_CREATE_BRAND,
            message: exception.message,
          },
        ];
      }
    }
  }

  async updateBrand(
    brand: BrandInput
  ): Promise<
    [
      boolean,
      { code: number; result: BrandDocument | string; message?: string }
    ]
  > {
    try {
      if (!brand.brand_id) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.BRAND_ID_NOT_FOUND,
          },
        ];
      }
      const existingBrand = await Brand.findById(brand.brand_id).exec();
      if (!existingBrand) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.BRAND_ID_NOT_FOUND,
          },
        ];
      }

      existingBrand.migrated_to_category =
        brand?.migrated_to_category || existingBrand?.migrated_to_category;
      existingBrand.brand_name = brand.brand_name || existingBrand.brand_name;
      existingBrand.brand_name_ar =
        brand.brand_name_ar || existingBrand.brand_name_ar;
      existingBrand.brand_icon = brand.brand_icon || existingBrand.brand_icon;
      existingBrand.status = brand.status || existingBrand.status;
      existingBrand.position = brand.position || existingBrand.position;
      existingBrand.category_id = brand.category_id
        ? new mongoose.Types.ObjectId(brand.category_id)
        : existingBrand.category_id;

      const data = await existingBrand.save();
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
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
            result: Constants.ERROR_MAP.FAILED_TO_UPDATED_BRAND,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getByIds(ids: string[]): Promise<BrandDocument[]> {
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    const query = await Brand.find({ _id: { $in: validIds } }).exec();
    return query;
  }
}
