import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import {
  DeviceModelDocument,
  ModelFilterOptions,
  ModelSuggestion,
} from '../models/Model';
import { SettingInput } from '../models/Setting';
import { BrandRepository } from '../repositories/brandRepository';
import { CategoryRepository } from '../repositories/categoryRepository';
import { ModelRepository } from '../repositories/modelRepository';
import { DeviceModelSummaryDto } from '../dto/deviceModel/DeviceModelSummaryDto';
import { MostSoldModelsDto } from '../dto/deviceModel/MostSoldModelsDto';
import { ProductRepository } from '../repositories/productRepository';
import { UpdatePositionDto } from '../dto/deviceModel/UpdatePositionDto';
import { SettingRepository } from '../repositories/settingRepository';
import { PaginationDto } from '../dto/paginationDto';
import { CategoryDocument } from '../models/Category';
import { DeviceModelSearchDto } from '../dto/deviceModel/DeviceModelSearchDto';
import { VariantRepository } from '../repositories/variantRepository';
import {
  detectTextLang,
  removeMultipleWhiteSpace,
  sanitizeText,
} from '../util/common';
import { VariantDocument } from '../models/Variant';
import { ModelSettingDocument } from '../models/ModelSetting';
import { createCategory } from '../grpc/category';
import { CreateCategoryRequest } from '../grpc/proto/category.pb';
import { CategoryType } from '../enums/CategoryType';
import { CategoryIconType } from '../enums/CategoryIconType';
import { Icon } from '../grpc/proto/category.pb';
@Service()
export class ModelService {
  constructor(
    private error: ErrorResponseDto,
    private brandRepository: BrandRepository,
    private productRepository: ProductRepository,
    private modelRepository: ModelRepository,
    private categoryRepository: CategoryRepository,
    public settingRepository: SettingRepository,
    private variantRepository: VariantRepository
  ) {}
  async getModelsViaLinkedIdOfCategoryBrand(
    categoryId: string,
    brandId: string
  ) {
    try {
      if (categoryId) {
        const [errCat, category] = await this.categoryRepository.getById(
          categoryId
        );
        if (errCat) {
          this.error.errorCode = category.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = category.result.toString();
          this.error.message = category.message;
          throw this.error;
        }
      }
      if (brandId) {
        const [errBrand, brand] = await this.brandRepository.getById(brandId);
        if (errBrand) {
          this.error.errorCode = brand.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = brand.result.toString();
          this.error.message = brand.message;
          throw this.error;
        }
      }
      const [errModel, models] =
        await this.modelRepository.getModelsViaLinkedIdOfCategoryBrand(
          categoryId,
          brandId
        );
      if (errModel) {
        this.error.errorCode = models.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = models.result.toString();
        this.error.message = models.message;
        throw this.error;
      }
      return models.result as DeviceModelDocument[];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          exception.message
        );
      }
    }
  }
  async updateModelSettings() {
    try {
      const [err, modelsData] = await this.modelRepository.getAllActive();
      if (err) {
        this.error.errorCode = modelsData.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = modelsData.result.toString();
        this.error.message = modelsData.message;
        throw this.error;
      }

      const activeModels = (modelsData.result as DeviceModelDocument[])
        .filter(elem => elem.totalAvailableProducts > 0)
        .map((elem: DeviceModelDocument) => {
          return {
            _id: elem._id,
            model_name: elem.model_name,
            model_name_ar: elem.model_name_ar,
          };
        });

      const reqData: SettingInput = {
        name: Constants.MODEL_SETTING.FULL_MODEL_LIST.NAME,
        description: Constants.MODEL_SETTING.FULL_MODEL_LIST.DESCRIPTION,
        type: Constants.MODEL_SETTING.FULL_MODEL_LIST.TYPE,
        setting_category:
          Constants.MODEL_SETTING.FULL_MODEL_LIST.SETTING_CATEGORY,
        value: JSON.stringify(activeModels),
        possible_values: '',
        status: Constants.MODEL_SETTING.FULL_MODEL_LIST.STATUS,
      };

      const [errSetting, dataSetting] =
        await this.settingRepository.getSettingByKey(
          Constants.MODEL_SETTING.FULL_MODEL_LIST.NAME
        );
      if (errSetting) {
        await this.settingRepository.addSetting(reqData);
        return [false, Constants.MESSAGE.MODEL_SETTING_UPDATE_SUCCESS];
      }

      await this.settingRepository.updateSetting(dataSetting._id, {
        value: JSON.stringify(activeModels),
      });
      return [false, Constants.MESSAGE.MODEL_SETTING_UPDATE_SUCCESS];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_UPDATE_MODEL_SETTINGS,
          JSON.stringify(exception)
        );
      }
    }
  }
  async getModelViaId(modelId: string) {
    try {
      const [errModel, models] = await this.modelRepository.getById(modelId);
      if (errModel) {
        this.error.errorCode = models.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = models.result.toString();
        this.error.message = models.message;
        throw this.error;
      }
      return models.result as DeviceModelDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          exception.message
        );
      }
    }
  }
  async getModelsSummary(
    categoryId: string,
    brands: string[],
    models: string[],
    priceMin: number,
    priceMax: number,
    page: number,
    size: number
  ) {
    try {
      const [catErr, catResult] = await this.categoryRepository.getById(
        categoryId
      );
      if (catErr) {
        this.error.errorCode = catResult.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = catResult.result.toString();
        this.error.message = catResult.message;
        throw this.error;
      }
      const [err, data] = await this.modelRepository.filter(
        categoryId,
        brands,
        models,
        page,
        size
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const { docs, hasNextPage, totalDocs } = data.result as any;
      const result: DeviceModelSummaryDto[] = this.mapToModelSummaryDto(
        docs as DeviceModelDocument[],
        (catResult.result as CategoryDocument).max_percentage
      );
      if (!isNaN(priceMin) && !isNaN(priceMax)) {
        const [errCount, totalProductsCountPerModel] =
          await this.productRepository.getTotalCountPerModel(
            result.map(elem => elem.id),
            priceMin,
            priceMax
          );
        if (errCount) {
          this.error.errorCode = data.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = data.result.toString();
          this.error.message = data.message;
          throw this.error;
        }

        for (const iterator of result) {
          const obj = totalProductsCountPerModel.result.find(
            elem => elem._id.toString() == iterator.id
          );

          iterator.totalAvailableProducts = obj
            ? obj.totalAvailableProducts
            : 0;
        }
      }
      return {
        docs: result?.filter(elem => elem.totalAvailableProducts > 0) || [],
        hasNextPage,
        totalDocs,
      } as PaginationDto<DeviceModelSummaryDto>;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          exception.message
        );
      }
    }
  }

  async getModelsSummaryByCatergory() {
    try {
      const [catErr, catResult] =
        await this.categoryRepository.getAllCategory();
      if (catErr) {
        this.error.errorCode = catResult.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = catResult.result.toString();
        this.error.message = catResult.message;
        throw this.error;
      }
      const categories = catResult?.result as CategoryDocument[];
      const carCategory = categories.find(
        category => category.category_name === 'Cars'
      );
      const [errCount, totalProductsCountPerModel] =
        await this.productRepository.getTotalCountPerModelByCategory(
          carCategory._id
        );
      if (errCount) {
        this.error.errorCode = totalProductsCountPerModel.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = totalProductsCountPerModel.result.toString();
        this.error.message = totalProductsCountPerModel.message;
        throw this.error;
      }
      return {
        categoryId: carCategory._id,
        modelData: totalProductsCountPerModel.result,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          exception.message
        );
      }
    }
  }

  async updateTotalAvailableProductsPerModel() {
    try {
      const [err, data] = await this.modelRepository.getAllActive();
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const [errCount, totalProductsCountPerModel] =
        await this.productRepository.getTotalCountPerModel(
          (data.result as DeviceModelDocument[]).map(elem =>
            elem._id.toString()
          ),
          0,
          Number.MAX_VALUE
        );
      if (errCount) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      for (const iterator of data.result as DeviceModelDocument[]) {
        const obj = totalProductsCountPerModel.result.find(elem =>
          elem._id.equals(iterator._id)
        );
        iterator.totalAvailableProducts = obj ? obj.totalAvailableProducts : 0;
        this.modelRepository.updateTotalAvailableProducts(
          iterator._id,
          iterator.totalAvailableProducts
        );
      }
      return Constants.MESSAGE.TOTAL_PRODUCTS_PER_MODEL_UPDATED;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_MODEL_SUMMARY,
          exception.message
        );
      }
    }
  }

  async updateModelCategoryPosition(positions: UpdatePositionDto[]) {
    try {
      for (const iterator of positions) {
        const [err, data] =
          await this.modelRepository.updateCategoryModelPosition(
            iterator.id,
            iterator.position
          );
        if (err) {
          this.error.errorCode = data.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = data.result.toString();
          this.error.message = data.message;
          throw this.error;
        }
      }
      return positions;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_MODEL_SUMMARY,
          exception.message
        );
      }
    }
  }
  mapToModelSummaryDto(
    deviceModels: DeviceModelDocument[],
    maxPercentage: number
  ): DeviceModelSummaryDto[] {
    if (!deviceModels) return [];
    const modelsSummaryDto: DeviceModelSummaryDto[] = [];
    for (const element of deviceModels) {
      modelsSummaryDto.push({
        id: element._id,
        arName: element.model_name_ar,
        enName: element.model_name,
        modelIcon: element.model_icon,
        totalAvailableProducts: element.totalAvailableProducts,
        positionPerCategory: element.positionPerCategory,
        maxPercentage: maxPercentage,
      });
    }
    return modelsSummaryDto;
  }
  async getModelSuggestions(keyword: string, limit: number) {
    try {
      keyword = removeMultipleWhiteSpace(keyword);
      const lang = detectTextLang(keyword);
      if (lang === 'ar') {
        keyword = sanitizeText(keyword);
      }
      const [err, data] = await this.modelRepository.getModelSuggestions(
        keyword,
        lang,
        limit
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }

      return data.result as ModelSuggestion[];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          exception.message
        );
      }
    }
  }
  async getAllModels(filter?: ModelFilterOptions) {
    try {
      const [errModel, models] = await this.modelRepository.getAllModels(
        filter
      );
      if (errModel) {
        this.error.errorCode = models.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = models.result.toString();
        this.error.message = models.message;
        throw this.error;
      }
      return models.result as DeviceModelDocument[];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MODELS,
          exception.message
        );
      }
    }
  }
  async getMostSoldModels(category: string = '') {
    try {
      let mostSoldModels, models, err;
      if (category !== '') {
        [err, mostSoldModels] = await this.settingRepository.getSettingByKey(
          Constants.MODEL_SETTING.MOST_SOLD_MODELS.CARS
        );
        models = JSON.parse(mostSoldModels?.value);
      } else {
        [err, mostSoldModels] = await this.settingRepository.getSettingByKey(
          Constants.MODEL_SETTING.MOST_SOLD_MODELS.NAME
        );
        models = JSON.parse(mostSoldModels?.value);
      }
      if (err) {
        this.error.errorCode = mostSoldModels.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = mostSoldModels.result.toString();
        this.error.message = mostSoldModels.message;
        throw this.error;
      }
      const result: MostSoldModelsDto[] = this.mapToMostSoldModelsDto(
        models as DeviceModelDocument[]
      );
      return {
        docs: result || [],
        message: Constants.MESSAGE.FETCH_MODELS_SUCCESS,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          exception.message
        );
      }
    }
  }
  mapToMostSoldModelsDto(
    deviceModels: DeviceModelDocument[]
  ): MostSoldModelsDto[] {
    if (!deviceModels) return [];
    const mostSoldModelsDto: MostSoldModelsDto[] = [];
    for (const element of deviceModels) {
      mostSoldModelsDto.push({
        id: element.id,
        arName: element.model_name_ar,
        enName: element.model_name,
        modelIcon: element.model_icon,
      });
    }
    return mostSoldModelsDto;
  }
  async getModelSearch(keyword: string, page: number) {
    try {
      keyword = removeMultipleWhiteSpace(keyword);
      const lang = detectTextLang(keyword);
      if (lang === 'ar') {
        keyword = sanitizeText(keyword);
      }
      const [err, data] = await this.modelRepository.searchModel(
        keyword,
        lang,
        page
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const { docs, hasNextPage, totalDocs } = data.result as any;
      const result: DeviceModelSearchDto[] = this.mapToModelSearchDto(
        docs as DeviceModelDocument[]
      );
      return {
        docs: result || [],
        hasNextPage,
        totalDocs,
      } as PaginationDto<DeviceModelSummaryDto>;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
          exception.message
        );
      }
    }
  }
  mapToModelSearchDto(
    deviceModels: DeviceModelDocument[]
  ): DeviceModelSearchDto[] {
    if (!deviceModels) return [];
    const modelsSearchDto: DeviceModelSearchDto[] = [];
    for (const element of deviceModels) {
      modelsSearchDto.push({
        id: element._id,
      });
    }
    return modelsSearchDto;
  }
  async getModelCommissionSetting(modelId: string) {
    try {
      const [err, data] = await this.modelRepository.getModelCommissionSetting(
        modelId
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MODEL_COMMISSION_SETTING,
          exception.message
        );
      }
    }
  }
  async updateModelCommissionSetting(
    modelId: string,
    modelCommissionSetting: ModelSettingDocument
  ) {
    try {
      const [err, data] =
        await this.modelRepository.updateModelCommissionSetting(
          modelId,
          modelCommissionSetting
        );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MODEL_COMMISSION_SETTING,
          exception.message
        );
      }
    }
  }

  async getPriceNudgeSettingViaVariantId(variantId: string) {
    try {
      const [, data] = await this.variantRepository.getVariantById(variantId);
      const variant = data.result as VariantDocument;
      const [err, settingData] =
        await this.modelRepository.getModelCommissionSetting(
          variant.model_id?.toString()
        );
      if (err) {
        this.error.errorCode = settingData.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = settingData.result.toString();
        this.error.message = settingData.message;
        throw this.error;
      }
      return settingData.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PRICE_NUDGE_SETTINGS,
          exception.message
        );
      }
    }
  }
  async migrateModels() {
    const models = await this.getAllModels({
      limit: 4000,
      migratedToCategory: false,
    });
    const transformedBrands = models.map(model => {
      const icons: Icon[] = [
        {
          url: model?.model_icon,
          type: CategoryIconType.CATEGORY_ICON,
          source: '',
        },
      ];

      return {
        id: model?.id,
        name: model?.model_name,
        nameAr: model?.model_name_ar,
        position: model?.position,
        status: model.status.toLowerCase(),
        type: CategoryType.MODEL,
        parentId: model?.brand_id,
        icons: icons,
      } as CreateCategoryRequest;
    });
    for (const createCategoryInput of transformedBrands) {
      await createCategory(createCategoryInput);
      await this.modelRepository.updateModelMigration(createCategoryInput.id);
    }
  }
}
