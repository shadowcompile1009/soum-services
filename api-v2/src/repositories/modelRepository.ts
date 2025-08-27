import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { PaginationDto } from '../dto/paginationDto';
import { UserStatus } from '../enums/UserStatus';
import {
  DeviceModel,
  DeviceModelDocument,
  DeviceModelPaginated,
  ModelFilterOptions,
  ModelSuggestion,
} from '../models/Model';
import { ModelSetting, ModelSettingDocument } from '../models/ModelSetting';
import { BaseRepository } from './BaseRepository';
interface ModelFilter {
  category_id?: mongoose.Types.ObjectId;
  brand_id?: mongoose.Types.ObjectId;
}

@Service()
export class ModelRepository extends BaseRepository {
  async updateTotalAvailableProducts(
    _id: mongoose.Types.ObjectId,
    totalAvailableProducts: any
  ) {
    try {
      const data = await DeviceModel.updateOne(
        { _id },
        { $set: { totalAvailableProducts } },
        { upsert: true }
      );
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_MODEL_SUMMARY,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: null }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_MODEL_SUMMARY,
          message: exception.message,
        },
      ];
    }
  }
  async searchModel(
    keyword: string,
    lang: string,
    page: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: PaginationDto<DeviceModelDocument> | string;
        message?: string;
      }
    ]
  > {
    try {
      const filterObj = {
        status: 'Active',
        totalAvailableProducts: { $gt: 0 },
      } as any;

      if (lang === 'ar') {
        filterObj.model_name_ar = { $regex: keyword, $options: 'i' };
      } else {
        filterObj.model_name = { $regex: keyword, $options: 'i' };
      }

      const options: mongoose.PaginateOptions = {
        sort: { totalAvailableProducts: -1, positionPerCategory: 1 },
        limit: 1,
        page: page,
      };
      const data = await DeviceModelPaginated.paginate(filterObj, options);
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: {
            docs: data.docs as DeviceModelDocument[],
            totalDocs: data.totalDocs as number,
            hasNextPage: data.hasNextPage as boolean,
          },
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          message: exception.message,
        },
      ];
    }
  }
  async getModelSuggestions(
    keyword: string,
    lang: string,
    limit: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: ModelSuggestion[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const output: ModelSuggestion[] = [];
      const filterObj = {
        status: UserStatus.ACTIVE,
        totalAvailableProducts: { $gt: 0 },
      } as any;
      if (lang === 'ar') {
        filterObj.model_name_ar = { $regex: keyword, $options: 'i' };
      } else {
        filterObj.model_name = { $regex: keyword, $options: 'i' };
      }
      await DeviceModel.find(filterObj)
        .limit(limit)
        .sort({ position: 1 })
        .then(models => {
          if (models?.length) {
            models.forEach(model => {
              let model_name = model.model_name_ar;
              if (lang === 'en') {
                model_name = model.model_name;
              }
              const obj = {
                id: model._id,
                model_name_suggestion: model_name,
              };
              output.push(obj);
            });
          }
        });

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: output as ModelSuggestion[],
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          message: exception.message,
        },
      ];
    }
  }
  async updateCategoryModelPosition(
    id: string,
    positionPerCategory: any
  ): Promise<[boolean, { code: number; result: string; message?: string }]> {
    try {
      const data = await DeviceModel.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { positionPerCategory } },
        { upsert: true }
      );
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_MODEL_SUMMARY,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: null }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_MODEL_SUMMARY,
          message: exception.message,
        },
      ];
    }
  }
  async getAllActive(): Promise<
    [
      boolean,
      {
        code: number;
        result: DeviceModelDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DeviceModel.find({ status: 'Active' }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_MODELS,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_MODELS,
          message: exception.message,
        },
      ];
    }
  }
  async getById(
    id: string
  ): Promise<
    [
      boolean,
      { code: number; result: DeviceModelDocument | string; message?: string }
    ]
  > {
    try {
      const data = await DeviceModel.findById(id).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
            message: Constants.MESSAGE.MODEL_ID_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          message: exception.message,
        },
      ];
    }
  }

  async getByName(
    name: string
  ): Promise<
    [
      boolean,
      { code: number; result: DeviceModelDocument | string; message?: string }
    ]
  > {
    try {
      const data = await DeviceModel.findOne({ model_name: name }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          message: exception.message,
        },
      ];
    }
  }

  async getModelsViaLinkedIdOfCategoryBrand(
    categoryId: string,
    brandId: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: DeviceModelDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const option: ModelFilter = {};
      let sortOption: any = { positionPerCategory: 1 };

      if (categoryId) {
        option.category_id = new mongoose.Types.ObjectId(categoryId);
      }
      if (brandId) {
        option.brand_id = new mongoose.Types.ObjectId(brandId);
        sortOption = { position: 1 };
      }
      const data = await DeviceModel.find(option).sort(sortOption).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          message: exception.message,
        },
      ];
    }
  }

  async filter(
    categoryId: string,
    brands: string[],
    models: string[],
    page: number,
    size: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: PaginationDto<DeviceModelDocument> | string;
        message?: string;
      }
    ]
  > {
    try {
      const filterObj = {
        category_id: mongoose.Types.ObjectId(categoryId),
        status: 'Active',
        totalAvailableProducts: { $gt: 0 },
      } as any;
      let options: any = {
        sort: { positionPerCategory: 1 },
      };
      if (brands) {
        filterObj.brand_id = {
          $in: brands.map(elem => mongoose.Types.ObjectId(elem)),
        };
        options = {
          sort: { position: 1 },
        };
      }
      if (models) {
        filterObj._id = {
          $in: models.map(elem => mongoose.Types.ObjectId(elem)),
        };
      }

      if (page && size) {
        options.page = page;
        options.limit = size;
      } else {
        options.pagination = false;
      }
      const data = await DeviceModelPaginated.paginate(filterObj, options);

      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: {
            docs: data.docs as DeviceModelDocument[],
            totalDocs: data.totalDocs as number,
            hasNextPage: data.hasNextPage as boolean,
          },
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          message: exception.message,
        },
      ];
    }
  }
  async getAllModels(
    filterOptions: ModelFilterOptions = {}
  ): Promise<
    [boolean, { code: number; result: DeviceModelDocument[]; message?: string }]
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

      const query = DeviceModel.find(filter);
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
            message: Constants.ERROR_MAP.FAILED_TO_GET_MODELS,
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

  async deleteModelById(
    modelId: string
  ): Promise<
    [
      boolean,
      { code: number; result: DeviceModelDocument | string; message?: string }
    ]
  > {
    try {
      const data = await DeviceModel.findByIdAndUpdate(
        new mongoose.Types.ObjectId(modelId),
        { $set: { status: 'Delete' } },
        { new: true }
      ).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: 'Can not soft delete model',
            message: Constants.ERROR_MAP.FAILED_TO_GET_MODELS,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: 'Can not soft delete model',
          message: exception.message,
        },
      ];
    }
  }

  async softDeleteModels(condition: any): Promise<number> {
    return await DeviceModel.updateMany(condition, {
      $set: { status: 'Delete', migration_source: 'unused_model_cleanup' },
    }).exec();
  }
  async getModelCommissionSetting(
    modelId: string
  ): Promise<
    [
      boolean,
      { code: number; result: ModelSettingDocument | string; message?: string }
    ]
  > {
    try {
      // const data = await ModelSetting.findOne({ modelId }).exec();
      const aggregate = [
        {
          $match: { modelId: mongoose.Types.ObjectId(modelId) },
        },
        {
          $lookup: {
            from: 'device_models',
            localField: 'modelId',
            foreignField: '_id',
            as: 'model',
          },
        },
        {
          $unwind: {
            path: '$model',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            id: '$_id',
            commissionSettings: 1,
            keySellerCommissionSettings: 1,
            priceNudgingSettings: 1,
            tradeInSettings: 1,
            modelId: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            categoryId: '$model.category_id',
          },
        },
      ];
      const data = await ModelSetting.aggregate(aggregate).exec();
      if (data.length < 1) {
        const model = await DeviceModel.findOne({ _id: modelId }).exec();
        return [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: {
              categoryId: model.category_id,
            } as any as ModelSettingDocument,
          },
        ];
      }
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: data.pop() },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_MODEL_COMMISSION_SETTING,
          message: exception.message,
        },
      ];
    }
  }
  async updateModelCommissionSetting(
    modelId: string,
    modelCommissionSetting: ModelSettingDocument
  ): Promise<
    [
      boolean,
      { code: number; result: ModelSettingDocument | string; message?: string }
    ]
  > {
    try {
      const modelSetting = (await ModelSetting.findOneAndUpdate(
        { modelId },
        modelCommissionSetting,
        {
          upsert: true,
          new: true,
        }
      ).exec()) as ModelSettingDocument;
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: modelSetting },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_MODEL_COMMISSION_SETTING,
          message: exception.message,
        },
      ];
    }
  }

  // to be removed after migration is done
  async updateModelMigration(
    id: string
  ): Promise<[boolean, { code: number; result: string; message?: string }]> {
    try {
      const data = await DeviceModel.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { migrated_to_category: true } }
      );
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_MODEL_SUMMARY,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: null }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_MODEL_SUMMARY,
          message: exception.message,
        },
      ];
    }
  }
  async getDeviceModelByIds(ids: string[]): Promise<DeviceModelDocument[]> {
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    const query = await DeviceModel.find({ _id: { $in: validIds } }).exec();
    return query;
  }
}
