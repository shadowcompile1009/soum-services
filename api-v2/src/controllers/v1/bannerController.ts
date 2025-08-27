import { Request, Response, Router } from 'express';
import Container from 'typedi';
import mongoose from 'mongoose';
import _isEmpty from 'lodash/isEmpty';
import multer from 'multer';
import { param, validationResult } from 'express-validator';
import IController from './IController';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { AuthGuard } from '../../middleware/authGuard';
import { BannerService } from '../../services/bannerService';
import {
  setCache,
  getCache,
  deleteCache,
  deleteWithPattern,
} from '../../libs/redis';
import { upload } from '../../libs/multer';
import { BannerDocument, BannerInput } from '../../models/Banner';
import { BannerFilterDto } from '../../dto/banner/BannerFilterDto';
import { isFromAdminRequest } from '../../util/authentication';
import { BannerType } from '../../enums/Banner';
const UploadBannerPhoto = upload('/banners').single('banner_image');
export class BannerController implements IController {
  path = 'banner/';
  router: Router;
  bannerService: BannerService;
  error: ErrorResponseDto;
  constructor(router: Router) {
    this.router = router;
    this.bannerService = Container.get(BannerService);
    this.error = Container.get(ErrorResponseDto);
  }
  initializeRoutes() {
    this.router.get('/', this.getBanners);
    this.router.post('/', [AuthGuard], this.addBanner);
    this.router.delete(
      '/:bannerId',
      param('bannerId').custom(value => {
        return mongoose.isValidObjectId(value);
      }),
      AuthGuard,
      this.removeBanner
    );
    this.router.put('/position', AuthGuard, this.updateBannerPosition);
    this.router.put('/:id', AuthGuard, this.updateBanner);
  }

  validateBannerInput(obj: BannerInput): boolean {
    const { bannerName, bannerValue, bannerType, bannerPage, lang } = obj;

    if (
      bannerValue != '' &&
      obj.bannerType == BannerType.COLLECTION &&
      !mongoose.Types.ObjectId.isValid(bannerValue)
    ) {
      return false;
    }
    if (
      bannerValue != '' &&
      obj.bannerType == BannerType.EXTERNAL_LINK &&
      !bannerValue.match(
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
      )
    ) {
      return false;
    }

    if (
      bannerValue != '' &&
      obj.bannerType == BannerType.DEEP_LINK &&
      !bannerValue.match(
        /^soum:\/\/soum\.sa\/(collection\/[a-fA-F0-9]{24}\/home|MyBidsAndPurchases|MySalesScreen)$/
      )
    ) {
      return false;
    }

    if (bannerType !== '' && bannerValue == '') {
      return false;
    }

    if (!bannerName || !bannerPage || !lang) {
      return false;
    }
    if (lang !== 'ar' && lang !== 'en') {
      return false;
    }

    return true;
  }
  addBanner = async (req: Request, res: Response) => {
    try {
      const isValidReq = isFromAdminRequest(req);
      if (!isValidReq) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.INVALID_CLIENT_ID,
          Constants.MESSAGE.INVALID_CLIENT_ID
        );
      }

      UploadBannerPhoto(req, res, async (error: any) => {
        if (error instanceof multer.MulterError && req.body.banner_image) {
          return res.sendError(error);
        } else if (error && req.body.banner_image) {
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPLOAD
            )
          );
        }

        try {
          const fileUrl =
            process.env.IMAGES_AWS_S3_ENDPOINT_CDN +
            '/' +
            (req?.file as any)?.bucket.split('/')[1] +
            '/' +
            (req?.file as any)?.key;

          const objBanner: BannerInput = {
            bannerName: req.body.banner_name,
            bannerPage: req.body?.banner_page,
            bannerType: req.body.banner_type,
            bannerValue: req.body?.banner_value || '',
            bannerPosition: req.body?.banner_position,
            bannerImage: fileUrl,
            lang: req.body.lang,
            type: req.body.type || '',
          };

          if (!this.validateBannerInput(objBanner)) {
            throw new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_CREATE_BANNER,
              Constants.MESSAGE.FAILED_TO_CREATE_BANNER
            );
          }

          const result = await this.bannerService.addBanner(objBanner);

          if (!result) {
            throw new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_CREATE_BANNER,
              Constants.MESSAGE.FAILED_TO_CREATE_BANNER
            );
          }

          deleteCache(['banners']);
          deleteWithPattern('banners_*');

          return res.sendCreated(
            result,
            Constants.MESSAGE.BANNER_CREATE_SUCCESS
          );
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
            Constants.ERROR_MAP.FAILED_TO_CREATE_BANNER,
            exception.message
          )
        );
      }
    }
  };

  updateBanner = async (req: Request, res: Response) => {
    try {
      const isValidReq = isFromAdminRequest(req);
      if (!isValidReq) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.INVALID_CLIENT_ID,
          Constants.MESSAGE.INVALID_CLIENT_ID
        );
      }

      UploadBannerPhoto(req, res, async (error: any) => {
        if (error instanceof multer.MulterError) {
          return res.sendError(error);
        } else if (error) {
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPLOAD
            )
          );
        }
        try {
          const fileUrl = req?.file
            ? process.env.IMAGES_AWS_S3_ENDPOINT_CDN +
              '/' +
              (req?.file as any)?.bucket.split('/')[1] +
              '/' +
              (req?.file as any)?.key
            : null;

          const objBanner: BannerInput = {
            bannerName: req.body.banner_name,
            bannerPage: req.body?.banner_page,
            bannerType: req.body.banner_type,
            bannerValue: req.body?.banner_value || '',
            bannerPosition: req.body?.banner_position,
            bannerImage: fileUrl,
            lang: req.body.lang,
            type: req.body.type || '',
          };
          const id = req.params.id;
          if (!this.validateBannerInput(objBanner)) {
            throw new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPDATE_BANNER,
              Constants.MESSAGE.FAILED_TO_UPDATE_BANNER
            );
          }

          const result = await this.bannerService.updateBanner(id, objBanner);

          if (!result) {
            throw new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPDATE_BANNER,
              Constants.MESSAGE.FAILED_TO_UPDATE_BANNER
            );
          }

          deleteCache(['banners']);
          deleteWithPattern('banners_*');

          return res.sendOk(result, Constants.MESSAGE.BANNER_UPDATE_SUCCESS);
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_BANNER,
            exception.message
          )
        );
      }
    }
  };
  getBanners = async (req: Request, res: Response) => {
    try {
      const filter = {
        bannerPage: (req.query.bannerPage as string)?.split(',') || [],
        bannerPosition: (req.query.bannerPosition as string)?.split(',') || '',
        region: (req.query.region as string)?.split(',') || '',
        lang: (req.query.lang as string)?.split(',') || '',
        type: (req.query.type as string) || '',
      } as BannerFilterDto;
      const key = `banners_${Object.values(filter).filter(Boolean).join('_')}`;
      const cacheData = await getCache<BannerDocument[]>(key);
      if (_isEmpty(cacheData)) {
        const result = await this.bannerService.getBanners(filter);
        await setCache(key, result);
        res.sendOk(result, Constants.MESSAGE.GET_BANNER_SUCCESS);
      } else {
        res.sendOk(cacheData, Constants.MESSAGE.GET_BANNER_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_BANNERS,
            exception.message
          )
        );
      }
    }
  };
  removeBanner = async (req: Request, res: Response) => {
    try {
      const isValidReq = isFromAdminRequest(req);
      if (!isValidReq) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.message = Constants.MESSAGE.INVALID_CLIENT_ID;
        throw this.error;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.BANNER_ID_NOT_FOUND;
        this.error.message = `${errors.array()[0].msg} ${
          errors.array()[0].param
        }`;
        throw this.error;
      }
      const bannerId = req.params.bannerId;
      const [err, data] = await this.bannerService.removeBanner(bannerId);
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            data.result.toString()
          )
        );
      }
      deleteCache(['banners']);
      deleteWithPattern('banners_*');
      res.sendOk(data, Constants.MESSAGE.BANNER_REMOVED_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_BANNER,
            exception.message
          )
        );
      }
    }
  };
  updateBannerPosition = async (req: any, res: Response) => {
    try {
      const isValidReq = isFromAdminRequest(req);
      if (!isValidReq) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.message = Constants.MESSAGE.INVALID_CLIENT_ID;
        throw this.error;
      }
      const positions = req.body;
      const result = await this.bannerService.updateBannerPosition(positions);
      deleteCache(['banners']);
      deleteWithPattern('banners_*');
      res.sendOk(result, Constants.MESSAGE.BANNER_UPDATE_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_BANNER_POSITION,
            exception.message
          )
        );
      }
    }
  };
}
