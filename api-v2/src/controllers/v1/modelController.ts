import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import _isEmpty from 'lodash/isEmpty';
import { query, param, validationResult } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { ModelService } from '../../services/modelService';
import { deleteWithPattern, getCache, setCache } from '../../libs/redis';
import { redisCache } from '../../middleware/redisCache';
import IController from './IController';
import { ProductService } from '../../services/productService';
import { ProductSortBy } from '../../enums/SortBy';
import { ProductFilterDto } from '../../dto/product/ProductFilterDto';
import { ILegacyProductModel } from '../../models/LegacyProducts';
import { AuthGuard } from '../../middleware/authGuard';
export class ModelController implements IController {
  path = 'model/';
  router: Router;
  modelService: ModelService;
  productService: ProductService;
  constructor(router: Router) {
    this.router = router;
    this.modelService = Container.get(ModelService);
    this.productService = Container.get(ProductService);
  }
  initializeRoutes() {
    this.router.get('/migrate-models', this.migrateModels);
    this.router.get('/', this.getModelListViaBrandCategory);
    this.router.get(
      '/:modelId',
      [
        param('modelId')
          .trim()
          .notEmpty()
          .withMessage(
            'modelId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getModelViaId
    );
    this.router.get(
      '/:modelId/commission',
      [
        AuthGuard,
        param('modelId')
          .trim()
          .notEmpty()
          .withMessage(
            'modelId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getModelCommissionSetting
    );
    this.router.put(
      '/:modelId/commission',
      AuthGuard,
      this.updateModelCommissionSetting
    );
    this.router.put('/summary', this.updateTotalProductsPerModel);
    this.router.put(
      '/change-category-position',
      this.updateModelCategoryPosition
    );
    this.router.get(
      '/summary/:categoryId',
      redisCache,
      this.validateModelSummaryInput(),
      this.getModelsSummary
    );
    this.router.put('/update-model-setting', this.updateModelSetting);
    this.router.get(
      '/search/:keyword',
      this.validateModelSearchInput(),
      this.searchModel
    );
    this.router.get(
      '/suggest/:keyword',
      redisCache,
      [
        param('keyword')
          .trim()
          .notEmpty()
          .isLength({ min: 2 })
          .withMessage(
            'keyword' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.suggestModel
    );
    this.router.get(
      '/variant/price-nudge-setting/:variantId',
      [
        param('variantId')
          .trim()
          .notEmpty()
          .withMessage(
            'variantId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getPriceNudgeSettingsViaVariantId
    );
    this.router.get(
      '/collection/:collectionType',
      redisCache,
      this.getMostSoldModels
    );
  }
  validateModelSearchInput() {
    return [
      param('keyword')
        .trim()
        .notEmpty()
        .withMessage(
          'keyword' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
    ];
  }
  searchModel = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
            JSON.stringify(errors.array())
          )
        );
      }
      const keyword = req.params.keyword as string;
      const size = Math.min(+req.query.size || 30, 30);
      const page = +req.query.page || 1;

      const key = `search_${keyword}_${size}_${page}`;
      const cacheSearch = await getCache<ILegacyProductModel>(key);

      if (_isEmpty(cacheSearch)) {
        const { docs, totalDocs } = await this.modelService.getModelSearch(
          keyword,
          page
        );

        const models: string[] | undefined = [];
        // todo: find a more optimum way to handle situations
        // where keyword doesn't match anything

        // let _docs = docs;
        // if (totalDocs == 0) {
        //   const { docs } = await this.modelService.getModelSearch(
        //     keyword.slice(0, 3)
        //   );
        //   _docs = docs;
        // }

        docs?.forEach(doc => {
          models?.push(`${doc.id}`);
        });
        if (models?.length && totalDocs !== 0) {
          const price = req.query.price as string;
          const filter = {
            models: models,
            brands: (req.query.brand as string)?.split(',') || '',
            deviceTypes: (req.query.deviceType as string)?.split(',') || '',
            grades: (req.query.grades as string)?.split(',') || '',
            userCity: req.query.userCity || '',
            size: size,
            page: page,
            price: price || '',
            sortBy: req.query.sortDirection as ProductSortBy,
          } as ProductFilterDto;
          const result = await this.productService.getProductsFilter(filter);
          const filterRes = result?.docs ? result.docs : [];
          setCache(key, filterRes, 180);
          res.sendOk(filterRes);
        } else {
          setCache(key, [], 180);
          res.sendOk([]);
        }
      } else {
        res.sendOk(cacheSearch, Constants.MESSAGE.FETCH_MODELS_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
            exception.message
          )
        );
      }
    }
  };
  suggestModel = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
            JSON.stringify(errors.array())
          )
        );
      }
      const keyword = req.params.keyword as string;
      const limit = +req.query.limit || 6;
      const cacheSuggestion = await getCache<ILegacyProductModel>(
        `suggestion_${keyword}`
      );
      if (_isEmpty(cacheSuggestion)) {
        let docs = await this.modelService.getModelSuggestions(keyword, limit);
        if (docs.length === 0) {
          const _docs = await this.modelService.getModelSuggestions(
            keyword.slice(0, 3),
            limit
          );
          docs = _docs;
        }
        setCache(`suggestion_${keyword}`, docs, 180);
        res.sendOk(docs);
      } else {
        res.sendOk(cacheSuggestion, Constants.MESSAGE.FETCH_MODELS_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
            exception.message
          )
        );
      }
    }
  };
  updateModelSetting = async (req: Request, res: Response) => {
    try {
      const result = await this.modelService.updateModelSettings();
      res.sendOk(result, Constants.MESSAGE.MODEL_SETTING_UPDATE_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_UPDATE_MODEL_SETTINGS,
            JSON.stringify(exception)
          )
        );
      }
    }
  };
  updateModelCategoryPosition = async (req: any, res: Response) => {
    try {
      const positions = req.body;
      const result = await this.modelService.updateModelCategoryPosition(
        positions
      );
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_MODEL_SUMMARY,
            exception.message
          )
        );
      }
    }
  };

  updateTotalProductsPerModel = async (_: any, res: Response) => {
    try {
      const result =
        await this.modelService.updateTotalAvailableProductsPerModel();

      deleteWithPattern('models_summary_*');
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_MODEL_SUMMARY,
            exception.message
          )
        );
      }
    }
  };

  getModelListViaBrandCategory = async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId?.toString() || null;
      const brandId = req.query.brandId?.toString() || null;
      const result =
        await this.modelService.getModelsViaLinkedIdOfCategoryBrand(
          categoryId,
          brandId
        );
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_BRAND,
            exception.message
          )
        );
      }
    }
  };

  validateModelSummaryInput() {
    return [
      param('categoryId')
        .trim()
        .notEmpty()
        .withMessage(
          'categoryId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      query('brands')
        .isString()
        .optional()
        .withMessage(
          'brands' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      query('models')
        .isString()
        .optional()
        .withMessage(
          'models' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      query('priceMax')
        .isNumeric()
        .optional()
        .withMessage(
          'priceMax' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
      query('priceMin')
        .isNumeric()
        .optional()
        .withMessage(
          'priceMin' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
    ];
  }
  getModelsSummary = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
            JSON.stringify(errors.array())
          )
        );
      }
      const categoryId = req.params.categoryId;
      const brands = req.query.brands as string;
      const models = req.query.models as string;
      const priceMax = +req.query.priceMax;
      const priceMin = +req.query.priceMin;
      const key = `models_summary_${categoryId}_${brands}_${models}_${priceMax}_${priceMin}`;
      let docs = await getCache(key);
      if (_isEmpty(docs)) {
        ({ docs } = await this.modelService.getModelsSummary(
          categoryId,
          brands?.split(','),
          models?.split(','),
          priceMin,
          priceMax,
          null,
          null
        ));
        await setCache(key, docs, 60);
      }
      res.sendOk(docs);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
            exception.message
          )
        );
      }
    }
  };

  getModelViaId = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
            JSON.stringify(errors.array())
          )
        );
      }
      const modelId = req.params.modelId || null;
      const result = await this.modelService.getModelViaId(modelId);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
            exception.message
          )
        );
      }
    }
  };
  getMostSoldModels = async (req: Request, res: Response) => {
    try {
      const key = 'most-sold-models';
      let docs = await getCache(key);
      if (_isEmpty(docs)) {
        ({ docs } = await this.modelService.getMostSoldModels());
        await setCache(key, docs, 60);
      }
      res.sendOk(docs, Constants.MESSAGE.FETCH_MODELS_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
            exception.message
          )
        );
      }
    }
  };
  getModelCommissionSetting = async (req: Request, res: Response) => {
    try {
      const modelId = req.params.modelId?.toString() || null;
      const result = await this.modelService.getModelCommissionSetting(modelId);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MODEL_COMMISSION_SETTING,
            exception.message
          )
        );
      }
    }
  };
  updateModelCommissionSetting = async (req: Request, res: Response) => {
    try {
      const modelId = req.params.modelId?.toString() || null;
      const result = await this.modelService.updateModelCommissionSetting(
        modelId,
        req.body
      );
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MODEL_COMMISSION_SETTING,
            exception.message
          )
        );
      }
    }
  };
  getPriceNudgeSettingsViaVariantId = async (req: Request, res: Response) => {
    try {
      const variantId = req.params.variantId?.toString() || null;
      const result = await this.modelService.getPriceNudgeSettingViaVariantId(
        variantId
      );
      return res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PRICE_NUDGE_SETTINGS,
            exception.message
          )
        );
      }
    }
  };
  migrateModels = async (req: Request, res: Response) => {
    try {
      const transformedModels = await this.modelService.migrateModels();
      res.sendOk(transformedModels);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            'Failed to migrate models',
            exception.message
          )
        );
      }
    }
  };
}
