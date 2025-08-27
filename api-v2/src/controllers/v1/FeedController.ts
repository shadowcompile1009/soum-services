import { Request, Response, Router } from 'express';
import Container from 'typedi';
import mongoose from 'mongoose';
import { query } from 'express-validator';
import IController from './IController';
import { Constants } from '../../constants/constant';
import { FeedService } from '../../services/feedService';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { body, param, validationResult } from 'express-validator';
import { CreateFeedDto } from '../../dto/AdminCollection/CreateFeedDto';
import { AuthGuard } from '../../middleware/authGuard';
import { AuthGuardDM } from '../../middleware/authGuardDM';
import { UpdateFeedDto } from '../../dto/AdminCollection/UpdateFeedDto';
import { redisCache } from '../../middleware/redisCache';
import { deleteWithPattern, getCache, setCache } from '../../libs/redis';
import { UpdateFeedStatusDto } from '../../dto/AdminCollection/UpdateFeedStatusDto';
import { UpdateAction } from '../../enums/UpdateAction';
import { FeedType } from '../../enums/FeedType';
import { ProductRepoFilters } from '../../repositories/productRepository';
import _isEmpty from 'lodash/isEmpty';

export class FeedController implements IController {
  path = 'feed/';
  router: Router;
  feedService: FeedService;
  error: ErrorResponseDto;
  constructor(router: Router) {
    this.router = router;
    this.feedService = Container.get(FeedService);
    this.error = Container.get(ErrorResponseDto);
  }
  initializeRoutes() {
    this.router.get(
      '/',
      [
        AuthGuard,
        query('type').default(FeedType.HOME_PAGE.toLowerCase()),
        query('type').trim().optional(),
        query('type').isIn([
          FeedType.HOME_PAGE.toLowerCase(),
          FeedType.MPP.toLowerCase(),
          FeedType.SPP.toLowerCase(),
          FeedType.BANNER.toLowerCase(),
          FeedType.OFFERS.toLowerCase(),
          FeedType.BUDGET.toLocaleLowerCase(),
        ]),
      ],
      this.getAllFeedsForListing
    );
    this.router.get(
      '/collection-type',
      AuthGuard,
      this.getAllFeedCollectionType
    );
    this.router.get(
      '/:id',
      param('id').custom(value => {
        return mongoose.isValidObjectId(value);
      }),
      AuthGuardDM,
      this.getFeedById
    );
    this.router.get('/preview/feeds', redisCache, this.getFeeds);
    this.router.get(
      '/preview/:id',
      param('id').custom(value => {
        return mongoose.isValidObjectId(value);
      }),
      this.getFeedByIdForSoumUser
    );

    this.router.post(
      '/',
      [
        body('arName').notEmpty(),
        body('enName').notEmpty(),
        body('arTitle').custom((value, { req }) => {
          const feedType = req.body.feedType;
          if (feedType === FeedType.OFFERS && !value) {
            throw new Error('arTitle is required when feedType is offers');
          }
          return true;
        }),
        body('enTitle').custom((value, { req }) => {
          const feedType = req.body.feedType;
          if (feedType === FeedType.OFFERS && !value) {
            throw new Error('enTitle is required when feedType is offers');
          }
          return true;
        }),
        body('expiryDate').custom((value, { req }) => {
          const feedType = req.body.feedType;
          if (
            feedType === FeedType.OFFERS &&
            (new Date(value) <= new Date() || !value)
          ) {
            throw new Error(
              'expiryDate is required in future when feedType is offers'
            );
          }
          return true;
        }),
        body('maxBudget').custom((value, { req }) => {
          const feedType = req.body.feedType;
          if (feedType === FeedType.BUDGET && !value) {
            throw new Error(
              'maxBudget is required in future when feedType is budget'
            );
          }
          return true;
        }),
        body('imgURL').custom((value, { req }) => {
          const feedType = req.body.feedType;
          if (feedType === FeedType.BUDGET && !value) {
            throw new Error(
              'imgURL is required in future when feedType is budget'
            );
          }
          return true;
        }),
        body('items').custom((items, { req }) => {
          const feedType = req.body.feedType;
          const min = feedType === FeedType.BUDGET ? 4 : 5;
          const max = 1000;
          if (!Array.isArray(items)) {
            throw new Error('Items must be an array');
          }
          if (items.length < min) {
            throw new Error(`Items must contain at least ${min} elements`);
          }
          if (items.length > max) {
            throw new Error(`Items must contain at most ${max} elements`);
          }
          return true;
        }),
        // body('items').isArray({ min: 5, max: 1000 }),
        body('feedType').default(FeedType.HOME_PAGE),
        body('feedType').trim().optional(),
        body('feedType').isIn([
          FeedType.HOME_PAGE,
          FeedType.MPP,
          FeedType.SPP,
          FeedType.BANNER,
          FeedType.OFFERS,
          FeedType.BUDGET,
        ]),
      ],
      AuthGuardDM,
      this.createNewFeed
    );

    this.router.put(
      '/',
      [
        body('feedId').notEmpty(),
        body('arName').notEmpty(),
        body('enName').notEmpty(),
        body('arTitle').custom((value, { req }) => {
          const feedType = req.body.feedType;
          if (feedType === FeedType.OFFERS && !value) {
            throw new Error('arTitle is required when feedType is offers');
          }
          return true;
        }),
        body('enTitle').custom((value, { req }) => {
          const feedType = req.body.feedType;
          if (feedType === FeedType.OFFERS && !value) {
            throw new Error('enTitle is required when feedType is offers');
          }
          return true;
        }),
        body('expiryDate').custom((value, { req }) => {
          const feedType = req.body.feedType;
          if (
            feedType === FeedType.OFFERS &&
            (new Date(value) <= new Date() || !value)
          ) {
            throw new Error(
              'expiryDate is required in future when feedType is offers'
            );
          }
          return true;
        }),
        body('maxBudget').custom((value, { req }) => {
          const feedType = req.body.feedType;
          if (feedType === FeedType.BUDGET && !value) {
            throw new Error(
              'maxBudget is required in future when feedType is budget'
            );
          }
          return true;
        }),
        body('imgURL').custom((value, { req }) => {
          const feedType = req.body.feedType;
          if (feedType === FeedType.BUDGET && !value) {
            throw new Error(
              'imgURL is required in future when feedType is budget'
            );
          }
          return true;
        }),
        body('items').custom((items, { req }) => {
          const feedType = req.body.feedType;
          const min = feedType === FeedType.BUDGET ? 4 : 5;
          const max = 1000;
          if (!Array.isArray(items)) {
            throw new Error('Items must be an array');
          }
          if (items.length < min) {
            throw new Error(`Items must contain at least ${min} elements`);
          }
          if (items.length > max) {
            throw new Error(`Items must contain at most ${max} elements`);
          }
          return true;
        }),
      ],
      AuthGuardDM,
      this.updateFeed
    );
    this.router.post(
      '/products/validate',
      [body('productIds').isArray({ min: 1, max: 1000 })],
      AuthGuard,
      this.validateProducts
    );
    this.router.put(
      '/status',
      [body('feedId').notEmpty(), body('status').notEmpty()],
      AuthGuard,
      this.updateFeedStatus
    );
    this.router.put('/collection-type', AuthGuardDM, this.updateFeedType);
    this.router.post(
      '/change-order',
      [body('collectionIds').notEmpty()],
      AuthGuardDM,
      this.updateFeedsOrder
    );
  }
  getFeedById = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FEED_ID_NOT_FOUND;
        this.error.message = `${errors.array()[0].msg} ${
          errors.array()[0].param
        }`;
        throw this.error;
      }
      const feedId = req.params.id || null;
      const result = await this.feedService.getFeedById(feedId);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_FEED,
            exception.message
          )
        );
      }
    }
  };
  getFeeds = async (req: Request, res: Response) => {
    try {
      const categoryIds = (req.query.categories as string)?.split(',') || null;
      const modelIds = (req.query.models as string)?.split(',') || null;
      const brandIds = (req.query.brands as string)?.split(',') || null;
      const size = +req.query.size || 15;
      const feedType = (req.query.feedType as FeedType) || FeedType.HOME_PAGE;

      const productRepoFilters = {
        categoryIds: categoryIds,
        modelIds: modelIds,
        brandIds: brandIds,
        size: size,
      } as ProductRepoFilters;

      const key = `feeds_${categoryIds}_${modelIds}_${brandIds}_${size}_${feedType}`;

      let result = await getCache(key);
      if (_isEmpty(result)) {
        result = await this.feedService.getFeeds(
          [feedType],
          productRepoFilters
        );
        await setCache(key, result, 60);
      }
      res.sendOk(result, Constants.MESSAGE.GET_FEEDS_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_FEED,
            exception.message
          )
        );
      }
    }
  };

  getFeedByIdForSoumUser = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FEED_ID_NOT_FOUND;
        this.error.message = `${errors.array()[0].msg} ${
          errors.array()[0].param
        }`;
        throw this.error;
      }
      const feedId = req.params.id || null;
      const page = +req.query.page || 1;
      const size = +req.query.size || 20;
      const key = `feeds_by_id_${feedId}_${page}_${size}`;
      let result = await getCache(key);
      if (_isEmpty(result)) {
        result = await this.feedService.getFeedByIdForSoumUser(
          feedId,
          page,
          size
        );
        await setCache(key, result, 60 * 10);
      }
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_FEED,
            exception.message
          )
        );
      }
    }
  };
  createNewFeed = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.message = `${errors.array()[0].msg} ${
          errors.array()[0].param
        }`;
        throw this.error;
      }
      const {
        arName,
        enName,
        items,
        feedType,
        feedCategory,
        arTitle,
        enTitle,
        expiryDate,
        maxBudget,
        imgURL,
      } = req.body;
      const postFeedDto: CreateFeedDto = {
        arName,
        enName,
        items,
        feedType,
        feedCategory,
        arTitle,
        enTitle,
        expiryDate,
        maxBudget,
        imgURL,
      };
      const result = await this.feedService.createNewFeed(postFeedDto);
      res.sendCreated(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_FEED,
            exception.message
          )
        );
      }
    }
  };
  updateFeed = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.message = errors.array()[0].msg;
        throw this.error;
      }
      const {
        arName,
        enName,
        items,
        feedId,
        arTitle,
        enTitle,
        expiryDate,
        maxBudget,
        imgURL,
        feedType,
        feedCategory,
      } = req.body;
      const FeedDto: UpdateFeedDto = {
        arName,
        enName,
        items,
        feedId,
        arTitle,
        enTitle,
        feedType,
        feedCategory,
        expiryDate,
        maxBudget,
        imgURL,
      };
      const result = await this.feedService.updateFeed(
        FeedDto,
        UpdateAction.FULL_UPDATE
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED,
            exception.message
          )
        );
      }
    }
  };
  updateFeedsOrder = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.message = JSON.stringify(errors.array());
        throw this.error;
      }
      const { collectionIds } = req.body;
      await Promise.all(
        (collectionIds as string[]).map(
          async (feedId: string, index: number) => {
            const updateFeedDto = {
              position: index + 1,
              feedId: feedId,
            } as UpdateFeedDto;

            return await this.feedService.updateFeed(
              updateFeedDto,
              UpdateAction.CHANGE_ORDER
            );
          }
        )
      );
      await deleteWithPattern('home_*');
      res.sendOk(null, 'Updated SuccessFully');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED,
            exception.message
          )
        );
      }
    }
  };
  updateFeedStatus = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.message = JSON.stringify(errors.array());
        throw this.error;
      }
      const { status, feedId, feedType } = req.body;
      const FeedStatusDto: UpdateFeedStatusDto = {
        feedId: feedId,
        status: status,
        feedType: feedType,
      };
      const result = await this.feedService.updateFeedStatus(FeedStatusDto);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED_STATUS,
            exception.message
          )
        );
      }
    }
  };
  getAllFeedsForListing = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
            JSON.stringify(errors.array())
          )
        );
      }
      const type: string = req.query?.type?.toString();
      const category: string = req.query?.category?.toString() || '';
      const clientType = req?.headers['client-id'] as string;
      const result = await this.feedService.getAllFeedsForListing(
        type,
        clientType,
        category
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
            Constants.ERROR_MAP.FAILED_TO_GET_FEED,
            exception.message
          )
        );
      }
    }
  };

  getAllFeedCollectionType = async (_: Request, res: Response) => {
    try {
      res.sendOk(Object.values(FeedType) || {});
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_FEED,
            exception.message
          )
        );
      }
    }
  };

  validateProducts = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND;
        this.error.message = `${errors.array()[0].msg} ${
          errors.array()[0].param
        }`;
        throw this.error;
      }
      const { productIds } = req.body;
      const result = await this.feedService.validateProductToCollection(
        productIds,
        req.body?.categoryId?.toString(),
        req.body?.isCategorySpecific
      );
      if (result && result?.length == 0)
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_FEED,
            "All products was't in correct status"
          )
        );
      res.sendOk(result, 'Products was validated successfully');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_FEED,
            exception.message
          )
        );
      }
    }
  };

  updateFeedType = async (req: Request, res: Response) => {
    try {
      const result = await this.feedService.updateFeedCollectionType();
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_FEED,
            exception.message
          )
        );
      }
    }
  };
}
