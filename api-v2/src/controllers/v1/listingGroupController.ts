import { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import { Container } from 'typedi';
import multer from 'multer';
import { query, validationResult, body, param } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import IController from './IController';
import { AuthGuard } from '../../middleware/authGuard';
import { ListingGroupInput } from '../../models/ListingGroup';
import { ListingGroupService } from '../../services/listingGroupService';
import { upload } from '../../libs/multer';
import { mappingImagesRequest } from '../../util/imageHelper';
import { isUUIDv4 } from '../../util/common';

const UploadMultiple = upload('/images').fields([
  { name: 'product_images', maxCount: 10 },
]);
export class ListingGroupController implements IController {
  path = 'listingGroup/';
  router: Router;
  listingGroupService: ListingGroupService;
  constructor(router: Router) {
    this.router = router;
    this.listingGroupService = Container.get(ListingGroupService);
  }

  initializeRoutes() {
    this.router.get(
      '/',
      [
        AuthGuard,
        query('page')
          .isNumeric()
          .optional()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('size')
          .isNumeric()
          .optional()
          .withMessage(
            'size' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
      ],
      this.getAllListingGroups
    );

    this.router.get(
      '/:id',
      [
        AuthGuard,
        param('id')
          .trim()
          .isString()
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE),
      ],
      this.getListingGroupByID
    );

    this.router.post('/', [AuthGuard], this.createListingGroup);
    this.router.put(
      '/:id',
      [
        AuthGuard,
        param('id')
          .trim()
          .isString()
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE),
        body('sell_price')
          .optional()
          .isFloat({ min: 1 })
          .withMessage(Constants.VALIDATE_REQUEST_MSG.SELL_PRICE),
        body('quantity')
          .optional()
          .isInt({ min: 0, max: 1000 })
          .withMessage(Constants.VALIDATE_REQUEST_MSG.QUANTITY),
      ],
      this.updateListingGroup
    );
    this.router.delete(
      '/:id',
      [
        AuthGuard,
        param('id')
          .trim()
          .isString()
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE),
      ],
      this.deleteListingGroup
    );
    this.router.put('*', (req, res) => {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_LISTING_GROUP,
          Constants.MESSAGE.PATH_NOT_FOUND
        )
      );
    });
    this.router.delete('*', (req, res) => {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_LISTING_GROUP,
          Constants.MESSAGE.PATH_NOT_FOUND
        )
      );
    });
  }

  getAllListingGroups = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      const user_id = (req.user as any).id || null;

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ALL_LISTING_GROUPS,
            JSON.stringify(errors.array())
          )
        );
      }
      let page = parseInt(req.query?.page?.toString()) || 1;
      let size = parseInt(req.query?.size?.toString()) || 20;

      if (page <= 0) {
        page = 1;
      }

      if (size <= 0) {
        size = 20;
      }

      const [err, data] = await this.listingGroupService.getAllListingGroups(
        page,
        size,
        user_id
      );

      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ALL_LISTING_GROUPS,
            data.message
          )
        );
      }
      return res.sendOk(
        data.result,
        Constants.MESSAGE.GET_LISTING_GROUP_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ALL_LISTING_GROUPS,
            exception.message
          )
        );
      }
    }
  };

  getListingGroupByID = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      const user_id = (req.user as any).id || null;

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_LISTING_GROUP_BY_ID,
            JSON.stringify(errors.array())
          )
        );
      }

      const listingGroupID = req?.params?.id || '';

      if (!mongoose.isValidObjectId(listingGroupID)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_LISTING_GROUP_BY_ID,
            Constants.MESSAGE.INVALID_ID_FORMAT
          )
        );
      }

      const [err, data] = await this.listingGroupService.getListingGroupByID(
        listingGroupID?.toString(),
        user_id
      );

      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_LISTING_GROUP_BY_ID,
            data.message
          )
        );
      }
      return res.sendOk(
        data.result,
        Constants.MESSAGE.GET_LISTING_GROUP_BY_ID_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_LISTING_GROUP_BY_ID,
            exception.message
          )
        );
      }
    }
  };

  createListingGroup = async (req: Request, res: Response) => {
    try {
      UploadMultiple(req, res, async (error: any) => {
        const errors = [];

        if (!req?.body?.category_id || req?.body?.category_id === '') {
          errors.push(Constants.VALIDATE_REQUEST_MSG.CATEGORY_ID);
        }

        if (!req?.body?.brand_id || req?.body?.brand_id === '') {
          errors.push(Constants.VALIDATE_REQUEST_MSG.BRAND_ID);
        }

        if (!req?.body?.model_id || req?.body?.model_id === '') {
          errors.push(Constants.VALIDATE_REQUEST_MSG.MODEL_ID);
        }

        if (!req?.body?.variant_id || req?.body?.variant_id === '') {
          errors.push(Constants.VALIDATE_REQUEST_MSG.VARIANT_ID);
        }

        if (!req?.body?.sell_price || req?.body?.sell_price < 1) {
          errors.push(Constants.VALIDATE_REQUEST_MSG.SELL_PRICE);
        }

        if (
          (req?.body?.condition_id || '') !== '' &&
          !isUUIDv4(req?.body?.condition_id || '')
        ) {
          errors.push(Constants.VALIDATE_REQUEST_MSG.INVALID_PRESET_CONDITION);
        }

        if (
          !req?.body?.quantity ||
          req?.body?.quantity < 1 ||
          req?.body?.quantity > 1000
        ) {
          errors.push(Constants.VALIDATE_REQUEST_MSG.QUANTITY);
        }

        if (
          req.body.isUsingLegacyUpload &&
          (!req?.files ||
            !(req.files as any)?.product_images ||
            (req.files as any)?.product_images?.length < 3 ||
            (req.files as any)?.product_images?.length > 10)
        ) {
          errors.push(Constants.VALIDATE_REQUEST_MSG.INVALID_NUM_OF_IMAGES);
        }

        if (errors?.length > 0) {
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_CREATE_LISTING_GROUP,
              JSON.stringify(errors)
            )
          );
        }

        if (error instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.sendError(error);
        } else if (error) {
          // An unknown error occurred when uploading.
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPLOAD
            )
          );
        }
        try {
          const listingGroupInput: ListingGroupInput = {
            category_id: req?.body?.category_id || '',
            brand_id: req?.body?.brand_id || '',
            model_id: req?.body?.model_id || '',
            variant_id: req?.body?.variant_id || '',
            sell_price: req?.body?.sell_price || 0,
            quantity: req?.body?.quantity || 0,
            product_images: mappingImagesRequest(
              req,
              req.body.isUsingLegacyUpload
            ),
            isModelImage: req?.body?.isModelImage || false,
            condition_id: req?.body?.condition_id || '',
            description: req?.body?.description || '',
            isUsingLegacyUpload: req?.body?.isUsingLegacyUpload || false,
            productImageSections: req?.body?.product_images,
            inventoryId: req?.body?.inventoryId || '',
          };

          if (
            !mongoose.isValidObjectId(listingGroupInput.category_id) ||
            !mongoose.isValidObjectId(listingGroupInput.brand_id) ||
            !mongoose.isValidObjectId(listingGroupInput.model_id) ||
            !mongoose.isValidObjectId(listingGroupInput.variant_id)
          ) {
            return res.sendError(
              new ErrorResponseDto(
                Constants.ERROR_CODE.BAD_REQUEST,
                Constants.ERROR_TYPE.API,
                Constants.ERROR_MAP.FAILED_TO_CREATE_LISTING_GROUP,
                Constants.MESSAGE.INVALID_ID_FORMAT
              )
            );
          }

          const user_id = (req.user as any)?.id || '';
          const [createErr, createResult] =
            await this.listingGroupService.createListingGroup(
              listingGroupInput,
              user_id
            );

          if (createErr) {
            return res.sendError(
              new ErrorResponseDto(
                Constants.ERROR_CODE.BAD_REQUEST,
                Constants.ERROR_TYPE.API,
                Constants.ERROR_MAP.FAILED_TO_CREATE_LISTING_GROUP,
                createResult?.message
              )
            );
          }

          return res.sendOk(
            createResult.result,
            Constants.MESSAGE.CREATE_BULK_LISTING_SUCCESSFULLY
          );
        } catch (err) {
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_CREATE_LISTING_GROUP,
              err.message
            )
          );
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
            Constants.ERROR_MAP.FAILED_TO_CREATE_LISTING_GROUP,
            exception.message
          )
        );
      }
    }
  };

  updateListingGroup = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_LISTING_GROUP,
            JSON.stringify(errors.array())
          )
        );
      }
      const user_id = (req.user as any).id || null;
      const listingGroupID = req?.params?.id || '';

      if (!mongoose.isValidObjectId(listingGroupID)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_LISTING_GROUP,
            Constants.MESSAGE.INVALID_ID_FORMAT
          )
        );
      }

      const listingGroupInput: ListingGroupInput = {
        sell_price: req?.body?.sell_price || 0,
        quantity: req?.body?.quantity || 0,
      };

      const [err, data] = await this.listingGroupService.updateListingGroup(
        listingGroupID?.toString(),
        listingGroupInput,
        user_id
      );

      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_LISTING_GROUP,
            data.message
          )
        );
      }
      return res.sendOk(
        data.result,
        Constants.MESSAGE.UPDATE_LISTING_GROUP_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_LISTING_GROUP,
            exception.message
          )
        );
      }
    }
  };

  deleteListingGroup = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_DELETE_LISTING_GROUP,
            JSON.stringify(errors.array())
          )
        );
      }
      const user_id = (req.user as any).id || null;
      const listingGroupID = req?.params?.id || '';

      if (!mongoose.isValidObjectId(listingGroupID)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_DELETE_LISTING_GROUP,
            Constants.MESSAGE.INVALID_ID_FORMAT
          )
        );
      }

      const [err, data] = await this.listingGroupService.deleteListingGroup(
        listingGroupID?.toString(),
        user_id
      );

      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_DELETE_LISTING_GROUP,
            data.message
          )
        );
      }
      return res.sendOk(
        data.result,
        Constants.MESSAGE.DELETE_LISTING_GROUP_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_DELETE_LISTING_GROUP,
            exception.message
          )
        );
      }
    }
  };
}
