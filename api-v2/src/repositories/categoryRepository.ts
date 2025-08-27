import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { mappingMongoError } from '../libs/mongoError';
import { Category, CategoryDocument, CategoryInput } from '../models/Category';
import { BaseRepository } from './BaseRepository';

@Service()
export class CategoryRepository extends BaseRepository {
  async getById(
    categoryId: string
  ): Promise<
    [
      boolean,
      { code: number; result: CategoryDocument | string; message?: string }
    ]
  > {
    try {
      if (!categoryId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.CATEGORY_ID_NOT_FOUND,
          },
        ];
      }
      const data = await Category.findById(categoryId).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.CATEGORY_ID_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY,
          message: exception.message,
        },
      ];
    }
  }

  async uploadListingPhoto(
    categoryId: string,
    filePath: string
  ): Promise<
    [
      boolean,
      { code: number; result: CategoryDocument | string; message?: string }
    ]
  > {
    try {
      const data = await Category.findById(categoryId).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.CATEGORY_ID_NOT_FOUND,
          },
        ];
      }
      data.listing_photo = filePath;
      const updatedCat = await data.save();

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: updatedCat },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPLOAD,
          message: exception.message,
        },
      ];
    }
  }

  async uploadBrowsingPhoto(
    categoryId: string,
    filePath: string
  ): Promise<
    [
      boolean,
      { code: number; result: CategoryDocument | string; message?: string }
    ]
  > {
    try {
      const data = await Category.findById(categoryId).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.CATEGORY_ID_NOT_FOUND,
          },
        ];
      }
      data.browsing_photo = filePath;
      const updatedCat = await data.save();

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: updatedCat },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPLOAD,
          message: exception.message,
        },
      ];
    }
  }

  async getAllCategory(
    like?: string,
    isSuperCategory?: boolean
  ): Promise<
    [
      boolean,
      { code: number; result: CategoryDocument[] | string; message?: string }
    ]
  > {
    try {
      const query = { status: 'Active' };

      if (like) {
        const subQuery = {
          $or: [
            { category_name: { $regex: '.*' + like + '.*', $options: 'i' } },
          ],
        };
        Object.assign(query, subQuery);
      }

      Object.assign(query, {
        parent_super_category_id: isSuperCategory ? null : { $ne: null },
      });
      const data = await Category.find(query).sort({ position: 1 }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.CATEGORY_ID_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY,
          message: exception.message,
        },
      ];
    }
  }

  async createCategory(
    category: CategoryInput
  ): Promise<
    [
      boolean,
      { code: number; result: CategoryDocument | string; message?: string }
    ]
  > {
    try {
      const where = {
        category_name: {
          $regex: '.*' + category.category_name + '.*',
          $options: 'i',
        },
        category_name_ar: {
          $regex: '.*' + category.category_name_ar + '.*',
          $options: 'i',
        },
        status: { $ne: 'Delete' },
      };
      const existingCategory = await Category.findOne(where).exec();
      if (existingCategory) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ALREADY_EXISTING_CATEGORY,
          },
        ];
      }
      const createdCategory = new Category({
        category_name: category.category_name,
        category_name_ar: category.category_name_ar,
        category_icon: category.category_icon,
        listing_photo: category.listing_photo,
        browsing_photo: category.browsing_photo,
        active: category.active,
        position: category.position,
        max_percentage: category.max_percentage,
        parent_super_category_id: category.parent_super_category_id
          ? new mongoose.Types.ObjectId(category.parent_super_category_id)
          : null,
      });
      const data = await createdCategory.save();
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
            result: Constants.ERROR_MAP.FAILED_TO_CREATE_CATEGORY,
            message: exception.message,
          },
        ];
      }
    }
  }

  async updateCategory(
    category: CategoryInput
  ): Promise<
    [
      boolean,
      { code: number; result: CategoryDocument | string; message?: string }
    ]
  > {
    try {
      if (!category.category_id) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.CATEGORY_ID_NOT_FOUND,
          },
        ];
      }
      const existingCategory = await Category.findById(
        category.category_id
      ).exec();
      if (!existingCategory) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.CATEGORY_ID_NOT_FOUND,
          },
        ];
      }

      existingCategory.category_name_ar =
        category.category_name_ar || existingCategory.category_name_ar;
      existingCategory.category_name =
        category.category_name || existingCategory.category_name;
      existingCategory.category_icon =
        category.category_icon || existingCategory.category_icon;
      existingCategory.listing_photo =
        category.listing_photo || existingCategory.listing_photo;
      existingCategory.browsing_photo =
        category.browsing_photo || existingCategory.browsing_photo;
      existingCategory.active = category.active || existingCategory.active;
      existingCategory.position =
        category.position || existingCategory.position;
      existingCategory.max_percentage =
        category.max_percentage || existingCategory.max_percentage;
      existingCategory.status = category.status || existingCategory.status;

      const data = await existingCategory.save();
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
            result: Constants.ERROR_MAP.FAILED_TO_UPDATED_CATEGORY,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getBySuperCategoryId(
    categoryId: string
  ): Promise<
    [
      boolean,
      { code: number; result: CategoryDocument[] | string; message?: string }
    ]
  > {
    try {
      if (!categoryId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.CATEGORY_ID_NOT_FOUND,
          },
        ];
      }
      const data = await Category.find({
        parent_super_category_id: categoryId,
      }).exec();

      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.CATEGORY_ID_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY,
          message: exception.message,
        },
      ];
    }
  }

  async deleteCategory(
    categoryID: string
  ): Promise<
    [
      boolean,
      { code: number; result: CategoryDocument | string; message?: string }
    ]
  > {
    try {
      const data = await Category.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(categoryID) },
        { $set: { status: 'Delete', updated_at: new Date() } },
        { new: true }
      );

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
            result: Constants.ERROR_MAP.FAILED_TO_UPDATED_CATEGORY,
            message: exception.message,
          },
        ];
      }
    }
  }
  async getByIds(ids: string[]): Promise<CategoryDocument[]> {
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    const query = await Category.find({ _id: { $in: validIds } }).exec();
    return query;
  }
}
