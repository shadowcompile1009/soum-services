import { Request, Response, Router } from 'express';
import { body, check, validationResult } from 'express-validator';
import _isEmpty from 'lodash/isEmpty';
import multer from 'multer';
import { Container } from 'typedi';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { upload } from '../../libs/multer';
import { deleteCache, getCache, setCache } from '../../libs/redis';
import { AuthGuardDM } from '../../middleware/authGuardDM';
import { BrandInput } from '../../models/Brand';
import { BrandService } from '../../services/brandService';
import IController from './IController';

const UploadBrandPhoto = upload('/brands').single('brand_icon');

export class BrandController implements IController {
  path = 'brand/';
  router: Router;
  brandService: BrandService;
  constructor(router: Router) {
    this.router = router;
    this.brandService = Container.get(BrandService);
  }

  initializeRoutes() {
    this.router.get('/migrate-brands', this.migrateBrands);
    this.router.get('/brands', [], this.getAllBrands);
    this.router.get(
      '/:brandId',
      check('brandId')
        .notEmpty()
        .withMessage(Constants.VALIDATE_REQUEST_MSG.BRAND_ID),
      this.getBrandViaId
    );
    this.router.get(
      '/category/:categoryId',
      check('categoryId')
        .notEmpty()
        .optional()
        .withMessage(Constants.VALIDATE_REQUEST_MSG.CATEGORY_ID),
      this.getBrandListViaCategory
    );
    this.router.post(
      '/',
      [
        AuthGuardDM,
        body('category_id')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.CATEGORY_ID),
        body('brand_name')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.BRAND_NAME),
        body('brand_name_ar')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.BRAND_NAME),
      ],
      this.createBrand
    );
    this.router.put(
      '/:brandId',
      [
        AuthGuardDM,
        check('brandId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.BRAND_ID),
        body('category_id')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.CATEGORY_ID),
        body('brand_name')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.BRAND_NAME),
        body('brand_name_ar')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.BRAND_NAME),
      ],
      this.updateBrand
    );
  }

  getAllBrands = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ALL_BRANDS,
            JSON.stringify(errors.array())
          )
        );
      }

      let result = await getCache('all_brands');

      if (_isEmpty(result)) {
        result = await this.brandService.getAllBrands();
        await setCache('all_brands', result, 60 * 60 * 24);
      }

      res.sendOk(result, Constants.MESSAGE.ALL_BRANDS_GET_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ALL_BRANDS,
            exception.message
          )
        );
      }
    }
  };

  getBrandViaId = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_BRAND,
            JSON.stringify(errors.array())
          )
        );
      }
      const brandId = req.params.brandId || null;
      const result = await this.brandService.getBrandViaId(brandId);
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

  getBrandListViaCategory = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY,
            JSON.stringify(errors.array())
          )
        );
      }
      const categoryId = req.params.categoryId || null;
      const result = await this.brandService.getBrandListViaCategory(
        categoryId
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

  mappingToCreteBrandRequest(req: Request) {
    try {
      const filePath = (req.file as any)?.key || '';
      const mappingRequest: BrandInput = {
        brand_id: req.params.brandId || null,
        category_id: req.body.category_id || null,
        brand_name: req.body.brand_name,
        brand_name_ar: req.body.brand_name_ar,
        brand_icon:
          filePath !== ''
            ? process.env.IMAGES_AWS_S3_ENDPOINT_CDN +
              '/' +
              filePath.bucket.split('/')[1] +
              '/' +
              filePath.key
            : filePath,
        position: req.body.position,
        status: req.body.status || 'Active',
      };
      return mappingRequest;
    } catch (exception) {
      throw exception;
    }
  }

  createBrand = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_BRAND,
            JSON.stringify(errors.array())
          )
        );
      }
      UploadBrandPhoto(req, res, async (error: any) => {
        if (error instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.sendError(error);
        } else if (error) {
          // An unknown error occurred when uploading.
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPLOAD
            )
          );
        }
        try {
          const objBrand = this.mappingToCreteBrandRequest(req);
          const result = await this.brandService.createBrand(objBrand);
          res.sendCreated(result, Constants.MESSAGE.BRAND_CREATE_SUCCESS);
        } catch (exception) {
          if (exception instanceof ErrorResponseDto) {
            return res.sendError(exception);
          }
          throw exception;
        }
      });
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_BRAND,
            exception.message
          )
        );
      }
    }
  };

  updateBrand = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATED_BRAND,
            JSON.stringify(errors.array())
          )
        );
      }
      UploadBrandPhoto(req, res, async (error: any) => {
        if (error instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.sendError(error);
        } else if (error) {
          // An unknown error occurred when uploading.
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPLOAD
            )
          );
        }
        try {
          const objBrand = this.mappingToCreteBrandRequest(req);
          const result = await this.brandService.updateBrand(objBrand);
          await deleteCache(['all_brands']);
          res.sendOk(result);
        } catch (exception) {
          if (exception instanceof ErrorResponseDto) {
            return res.sendError(exception);
          }
          throw exception;
        }
      });
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATED_BRAND,
            exception.message
          )
        );
      }
    }
  };
  migrateBrands = async (req: Request, res: Response) => {
    try {
      const transformedBrands = await this.brandService.migrateBrands();
      res.sendOk(transformedBrands);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            'Failed to migrate brands',
            exception.message
          )
        );
      }
    }
  };
}
