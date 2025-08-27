import { Request, Response, Router } from 'express';
import {
  body,
  header,
  param,
  query,
  validationResult,
} from 'express-validator';
import _isEmpty from 'lodash/isEmpty';
import multer from 'multer';
import { Container } from 'typedi';
import { Constants } from '../../constants/constant';
import { NewPriceProductDto } from '../../dto/condition/priceNudgeVarientDto';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { readFileFromS3, upload } from '../../libs/multer';
import {
  createKey,
  deleteWithPattern,
  getCache,
  setCache,
} from '../../libs/redis';
import { AuthGuard } from '../../middleware/authGuard';
import { VariantService } from '../../services/variantService';
import IController from './IController';
const csvPath = '/csv';
const UploadCSVFile = upload(csvPath).single('new_prices');

export class VariantController implements IController {
  path = 'variant/';
  router: Router;
  variantService: VariantService;

  constructor(router: Router) {
    this.router = router;
    this.variantService = Container.get(VariantService);
  }

  initializeRoutes() {
    this.router.get('/', AuthGuard, this.getVariantViaLinkedIds);
    this.router.get(
      '/attribute',
      [
        AuthGuard,
        query('modelId')
          .trim()
          .isString()
          .notEmpty()
          .withMessage(
            'modelId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getBaseAttributeVariant
    );
    this.router.get(
      '/filter/attribute',
      [
        AuthGuard,
        query('modelId')
          .trim()
          .isString()
          .notEmpty()
          .withMessage(
            'modelId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        query('filterId')
          .trim()
          .isString()
          .notEmpty()
          .withMessage(
            'filterId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        query('optionId')
          .trim()
          .isString()
          .notEmpty()
          .withMessage(
            'optionId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        query('attributeId')
          .trim()
          .isString()
          .notEmpty()
          .withMessage(
            'attributeId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getFilterAttributeVariant
    );
    this.router.get(
      '/attributes',
      [
        AuthGuard,
        query('modelId')
          .trim()
          .isString()
          .notEmpty()
          .withMessage(
            'modelId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        query('filterIds')
          .trim()
          .isString()
          .optional()
          .withMessage(
            'filterIds' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        query('optionId')
          .trim()
          .isString()
          .notEmpty()
          .withMessage(
            'optionId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        query('attributeId')
          .trim()
          .isString()
          .notEmpty()
          .withMessage(
            'attributeId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getVariantViaFilterAttributes
    );
    this.router.get(
      '/:variantId',
      [
        AuthGuard,
        param('variantId')
          .trim()
          .isString()
          .withMessage(
            'variantId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        query('grade')
          .trim()
          .optional()
          .isString()
          .withMessage(
            'grade' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getVariantViaId
    );
    this.router.post(
      '/csv/product/price',
      header('client-id').notEmpty().equals('api-v1'),
      this.updateSavedAmountProducts
    );
    this.router.post(
      '/',
      [
        AuthGuard,
        body('categoryId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.CATEGORY_ID),
        body('brandId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.BRAND_ID),
        body('modelId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.MODEL_ID),
        body('currentPrice'),
        body('varientEn')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.VARIENT_NAME),
        body('varientAr')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.VARIENT_NAME),
      ],
      this.createVarient
    );
    this.router.put(
      '/:variantId',
      [
        AuthGuard,
        param('variantId')
          .trim()
          .isString()
          .withMessage(
            'variantId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('categoryId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.CATEGORY_ID),
        body('brandId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.BRAND_ID),
        body('modelId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.MODEL_ID),
        body('currentPrice')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.PRICE_FIELD),
        body('varientEn')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.VARIENT_NAME),
        body('varientAr')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.VARIENT_NAME),
      ],
      this.updateVarient
    );
    this.router.delete(
      '/:variantId',
      [
        AuthGuard,
        param('variantId')
          .trim()
          .isString()
          .withMessage(
            'variantId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.removeVarient
    );
    this.router.get(
      '/attribute/options',
      [
        query('modelId')
          .trim()
          .isString()
          .withMessage(
            'modelId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        query('categoryId')
          .trim()
          .isString()
          .withMessage(
            'modelId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        query('brandId')
          .trim()
          .isString()
          .withMessage(
            'brandId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getAttributeOptionsVariant
    );
  }

  getVariantViaId = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
            JSON.stringify(errors.array())
          )
        );
      }
      const variantId = req.params.variantId || null;
      const grade: string =
        req?.query?.grade?.toString()?.replace('_', ' ') || '';
      const result = await this.variantService.getVariantViaId(
        variantId,
        grade
      );
      res.sendOk(result, Constants.MESSAGE.GET_VARIANT_BY_ID_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
            exception.message
          )
        );
      }
    }
  };

  getVariantViaLinkedIds = async (req: Request, res: Response) => {
    try {
      const modelId = req.query.modelId?.toString() || null;
      const offset = req.query.offset || 0;
      const limit = req.query.limit || 10;

      const result = await this.variantService.getVariantViaModelId(
        modelId,
        offset,
        limit
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

  getBaseAttributeVariant = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.MODEL_ID_NOT_FOUND,
            JSON.stringify(errors.array())
          )
        );
      }
      const modelId = req.query.modelId?.toString() || null;
      const key = `base_attribute_${modelId}`;
      const cacheData = await getCache<any>(key);
      if (cacheData) {
        res.sendOk(
          cacheData,
          Constants.MESSAGE.GET_BASE_ATTRIBUTE_SUCCESSFULLY
        );
      } else {
        const result = await this.variantService.getBaseAttributeVariant(
          modelId
        );
        await setCache(key, result);
        res.sendOk(result, Constants.MESSAGE.GET_BASE_ATTRIBUTE_SUCCESSFULLY);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ATTRIBUTE,
            exception.message
          )
        );
      }
    }
  };

  getFilterAttributeVariant = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS,
            JSON.stringify(errors.array())
          )
        );
      }
      const modelId = req.query.modelId?.toString() || null;
      const filterId = req.query.filterId?.toString() || null;
      const optionId = req.query.optionId?.toString() || null;
      const previousOptions =
        (req.query.previousOptions as string)?.split(',') || null;
      const attributeId = req.query.attributeId?.toString() || null;
      const key = `filter_attribute_${modelId}_${filterId}_${optionId}_${previousOptions
        ?.toString()
        ?.replace(/,/, '_')}`;
      const cacheData = await getCache<any>(key);

      if (cacheData) {
        res.sendOk(
          cacheData,
          Constants.MESSAGE.GET_FILTERED_ATTRIBUTE_SUCCESSFULLY
        );
      } else {
        const objFilterQuery = {
          modelId,
          filterId,
          optionId,
          attributeId,
          previousOptions,
        };
        const result = await this.variantService.getFilterAttributeVariant(
          objFilterQuery
        );
        setCache(key, result);
        res.sendOk(
          result,
          Constants.MESSAGE.GET_FILTERED_ATTRIBUTE_SUCCESSFULLY
        );
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ATTRIBUTE,
            exception.message
          )
        );
      }
    }
  };

  getVariantViaFilterAttributes = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS,
            JSON.stringify(errors.array())
          )
        );
      }
      const modelId = req.query.modelId?.toString() || null;
      const filterIds = (req.query.filterIds as string)?.split(',') || null;
      const optionId = req.query.optionId?.toString() || null;
      const attributeId = req.query.attributeId?.toString() || null;
      const objFilterQuery = { modelId, attributeId, optionId, filterIds };
      const result = await this.variantService.getVariantViaFilterAttributes(
        objFilterQuery
      );
      res.sendOk(result, Constants.MESSAGE.GET_LISTING_VARIANT_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ATTRIBUTE,
            exception.message
          )
        );
      }
    }
  };

  createVarient = async (req: Request, res: Response) => {
    try {
      await deleteWithPattern(`variant_modelId*`);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_VARIANT,
            JSON.stringify(errors.array())
          )
        );
      }
      const newVarient = this.variantService.mapFromGetVariantDtoToCreateModel(
        req.body
      );
      const result = await this.variantService.createVarient(newVarient);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_VARIANT,
            exception.message
          )
        );
      }
    }
  };

  updateVarient = async (req: Request, res: Response) => {
    try {
      await deleteWithPattern(`variant_modelId*`);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_VARIANT,
            JSON.stringify(errors.array())
          )
        );
      }
      const updatedVarient =
        this.variantService.mapFromGetVariantDtoToUpdateModel(req.body);
      const variantId = req.params.variantId || null;
      const result = await this.variantService.updateVarient(
        variantId,
        updatedVarient
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_VARIANT,
            exception.message
          )
        );
      }
    }
  };

  removeVarient = async (req: Request, res: Response) => {
    try {
      await deleteWithPattern(`variant_modelId*`);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_DELETE_VARIANT,
            JSON.stringify(errors.array())
          )
        );
      }
      const variantId = req.params.variantId || null;
      const result = await this.variantService.removeVarient(variantId);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_DELETE_VARIANT,
            exception.message
          )
        );
      }
    }
  };

  getAttributeOptionsVariant = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.MODEL_ID_NOT_FOUND,
            JSON.stringify(errors.array())
          )
        );
      }
      const modelId = req.query.modelId.toString() || null;
      const categoryId = req.query.categoryId.toString() || null;
      const brandId = req.query.brandId.toString() || null;

      if (!modelId && !categoryId && !brandId) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.MODEL_ID_AND_CATEGORY_ID_EMPTY,
            Constants.MESSAGE.MODEL_ID_AND_CATEGORY_ID_EMPTY
          )
        );
      }

      const key = createKey(Constants.CACHE_KEYS.ATTRIBUTE_OPTIONS, [
        'attr_opts',
        modelId,
        categoryId,
        brandId,
      ]);

      let results = await getCache(key);

      if (_isEmpty(results)) {
        results = await this.variantService.getAttributeOptionsVariant(
          modelId,
          categoryId,
          brandId
        );
        await setCache(key, results, 1800); // cached for 30mins
      }

      res.sendOk(results, Constants.MESSAGE.GET_ATTRIBUTE_OPTIONS_SUCCESSFUL);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.GET_ATTRIBUTE_OPTIONS_FAILED,
            exception.message
          )
        );
      }
    }
  };

  updateSavedAmountProducts = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      UploadCSVFile(req, res, async (error: any) => {
        if (error) {
          if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: error.message });
          }
          return res.status(400).json({
            error: new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPLOAD
            ),
          });
        }
        const fileName = (req.file as any)?.key || '';
        const csvData = await readFileFromS3(fileName, csvPath);
        const mappingCSV = csvData?.map(data => {
          return {
            variantId: data['variant_id'],
            newPrice: data['new_price'],
          } as NewPriceProductDto;
        });
        const result = await this.variantService.requestToSyncMarketProducts(
          mappingCSV
        );
        return res.sendOk(result);
      });
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPLOAD_CSV_FILE,
          exception.message
        )
      );
    }
  };
}
