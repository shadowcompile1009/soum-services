import { Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator';
import _isEmpty from 'lodash/isEmpty';
import multer from 'multer';
import { Container } from 'typedi';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { upload } from '../../libs/multer';
import { CategoryInput } from '../../models/Category';
import { CategoryService } from '../../services/categoryService';
import IController from './IController';
import {
  createKey,
  deleteWithPattern,
  getCache,
  setCache,
} from '../../libs/redis';
import { AuthGuard } from '../../middleware/authGuard';
import { AuthGuardDM } from '../../middleware/authGuardDM';

// const CategoryUpload = upload("category").single('category_icon');
const ListingPhoto = upload('/category').single('listing_photo');
const BrowsingPhoto = upload('/category').single('browsing_photo');
const UploadCategoryPhotos = upload('/category').fields([
  { name: 'category_icon', maxCount: 1 },
  { name: 'listing_photo', maxCount: 1 },
  { name: 'browsing_photo', maxCount: 1 },
]);
export class CategoryController implements IController {
  path = 'category/';
  router: Router;
  categoryService: CategoryService;

  constructor(router: Router) {
    this.router = router;
    this.categoryService = Container.get(CategoryService);
  }

  initializeRoutes() {
    this.router.get('/migrate-categories/', this.migrateCategories);
    this.router.get('/', this.getAllCategory);
    this.router.post('/', [AuthGuardDM], this.createCategory);
    this.router.get(
      '/:categoryId',
      check('categoryId')
        .notEmpty()
        .withMessage(Constants.VALIDATE_REQUEST_MSG.CATEGORY_ID),
      this.getCategory
    );
    this.router.put('/:categoryId', [AuthGuardDM], this.updateCategory);
    this.router.delete('/:categoryId', AuthGuard, this.deleteCategory);
    this.router.put('/:categoryId/listing-photo', this.uploadListingPhoto);
    this.router.put('/:categoryId/browsing-photo', this.uploadBrowsingPhoto);
    this.router.get(
      '/super/:categoryId',
      check('categoryId')
        .notEmpty()
        .withMessage(Constants.VALIDATE_REQUEST_MSG.CATEGORY_ID),
      this.getCategoryBySuperCategory
    );
  }

  getAllCategory = async (req: any, res: any) => {
    try {
      const like = req.query.like || null;
      const isSuperCategory =
        req?.query?.isSuperCategory?.toString()?.toLowerCase() === 'true';
      const key = createKey(`${isSuperCategory ? 'super-c-list' : 'c-list'}`, [
        like ? like : '',
      ]);
      const cachedCategories = await getCache<any>(key);

      if (!_isEmpty(cachedCategories)) {
        return res.sendOk(cachedCategories);
      }
      const result = await this.categoryService.getAllCategory(
        like,
        isSuperCategory
      );
      setCache(key, result, 300);

      return res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY,
            exception.message
          )
        );
      }
    }
  };

  getCategory = async (req: Request, res: Response) => {
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
      const result = await this.categoryService.getCategory(categoryId);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY,
            exception.message
          )
        );
      }
    }
  };

  mappingToCreateCategoryRequest(req: Request) {
    try {
      const filePath = ((req.files as any)['category_icon'] || [])[0] || '';
      const listingFilePath =
        ((req.files as any)['listing_photo'] || [])[0] || '';
      const browsingFilePath =
        ((req.files as any)['browsing_photo'] || [])[0] || '';
      const mappingRequest: CategoryInput = {
        category_id: req.params.categoryId || null,
        category_name: req.body.category_name_en,
        category_name_ar: req.body.category_name_ar,
        category_icon:
          filePath !== ''
            ? process.env.IMAGES_AWS_S3_ENDPOINT_CDN +
              '/' +
              filePath.bucket.split('/')[1] +
              '/' +
              filePath.key
            : filePath,
        active: req.body.active || true,
        position: req.body.position,
        max_percentage: req.body.max_percentage,
        status: req.body.status || 'Active',
        listing_photo:
          listingFilePath !== ''
            ? process.env.IMAGES_AWS_S3_ENDPOINT_CDN +
              '/' +
              listingFilePath.bucket.split('/')[1] +
              '/' +
              listingFilePath.key
            : listingFilePath,
        browsing_photo:
          browsingFilePath !== ''
            ? process.env.IMAGES_AWS_S3_ENDPOINT_CDN +
              '/' +
              browsingFilePath.bucket.split('/')[1] +
              '/' +
              browsingFilePath.key
            : listingFilePath,
        parent_super_category_id: req?.body?.parent_super_category_id,
      };

      return mappingRequest;
    } catch (exception) {
      throw exception;
    }
  }

  createCategory = async (req: any, res: any) => {
    try {
      UploadCategoryPhotos(req, res, async (error: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_CREATE_CATEGORY,
              JSON.stringify(errors.array())
            )
          );
        }
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
          const objCategory = this.mappingToCreateCategoryRequest(req);
          const result = await this.categoryService.createCategory(objCategory);
          deleteWithPattern('c-list_*');
          deleteWithPattern('super-c-list_*');
          res.sendCreated(result, Constants.MESSAGE.CATEGORY_CREATE_SUCCESS);
        } catch (exception) {
          if (exception instanceof ErrorResponseDto) {
            return res.sendError(exception);
          }
          throw exception;
        }
      });
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) res.sendError(exception);
      else
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_CATEGORY
          )
        );
    }
  };

  uploadBrowsingPhoto = async (req: any, res: any) => {
    try {
      BrowsingPhoto(req, res, async (error: any) => {
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
          const categoryId = req.params.categoryId || null;
          const browsing_photo = (req.file as any)?.location || '';

          const result = await this.categoryService.uploadBrowsingPhoto(
            categoryId,
            browsing_photo
          );
          deleteWithPattern('c-list_*');
          deleteWithPattern('super-c-list_*');
          res.sendOk(result);
        } catch (exception) {
          if (exception instanceof ErrorResponseDto) {
            return res.sendError(exception);
          }
          throw exception;
        }
      });
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) res.sendError(exception);
      else
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_CATEGORY
          )
        );
    }
  };

  uploadListingPhoto = async (req: any, res: any) => {
    try {
      ListingPhoto(req, res, async (error: any) => {
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
          const categoryId = req.params.categoryId || null;
          const listing_photo = (req.file as any)?.location || '';

          const result = await this.categoryService.uploadListingPhoto(
            categoryId,
            listing_photo
          );
          res.sendOk(result);
        } catch (exception) {
          if (exception instanceof ErrorResponseDto) {
            return res.sendError(exception);
          }
          throw exception;
        }
      });
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) res.sendError(exception);
      else
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_CATEGORY
          )
        );
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      UploadCategoryPhotos(req, res, async (error: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPDATED_CATEGORY,
              JSON.stringify(errors.array())
            )
          );
        }
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
          const objCategory = this.mappingToCreateCategoryRequest(req);
          const result = await this.categoryService.updateCategory(objCategory);
          deleteWithPattern('c-list_*');
          deleteWithPattern('super-c-list_*');
          res.sendOk(result);
        } catch (exception) {
          if (exception instanceof ErrorResponseDto) {
            return res.sendError(exception);
          }
          throw exception;
        }
      });
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) res.sendError(exception);
      else
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATED_CATEGORY,
            exception.message
          )
        );
    }
  };

  getCategoryBySuperCategory = async (req: Request, res: Response) => {
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
      const result = await this.categoryService.getCategoryBySuperCategory(
        categoryId
      );
      res.sendOk(result, Constants.MESSAGE.ALL_CATEGORIES_GET_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY,
            exception.message
          )
        );
      }
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const categoryId = req.params.categoryId || null;
      const result = await this.categoryService.deleteCategory(categoryId);
      deleteWithPattern('c-list_*');
      deleteWithPattern('super-c-list_*');

      return res.sendOk(result, Constants.MESSAGE.DELETE_CATEGORY_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY,
            exception.message
          )
        );
      }
    }
  };
  migrateCategories = async (req: Request, res: Response) => {
    try {
      const transformedCategories =
        await this.categoryService.migrateCategories();
      res.sendOk(transformedCategories);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            'Failed to migrate categories',
            exception.message
          )
        );
      }
    }
  };
}
