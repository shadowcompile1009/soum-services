import { Request, Response, Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import _isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose';
import Container from 'typedi';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { FavoriteDto } from '../../dto/favorite/FavoriteDto';
import {
  createKey,
  deleteWithPattern,
  getCache,
  setCache,
} from '../../libs/redis';
import { User } from '../../dto/User/User';
import { AuthGuard } from '../../middleware/authGuard';
import { FavoriteService } from '../../services/favoriteService';
import IController from './IController';

export class FavoriteController implements IController {
  path = 'favorite/';
  router: Router;
  favoriteService: FavoriteService;
  error: ErrorResponseDto;
  constructor(router: Router) {
    this.router = router;
    this.favoriteService = Container.get(FavoriteService);
    this.error = Container.get(ErrorResponseDto);
  }
  initializeRoutes() {
    this.router.get('/', AuthGuard, this.getUserFavorites);
    this.router.post(
      '/',
      [body('productId').notEmpty()],
      AuthGuard,
      this.addToFavorites
    );
    this.router.delete(
      '/:productId',
      param('productId').custom(value => {
        return mongoose.isValidObjectId(value);
      }),
      AuthGuard,
      this.removeFromFavorites
    );
  }
  addToFavorites = async (req: Request, res: Response) => {
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
      const { productId } = req.body;
      const userId = (req.user as User)?.id || null;
      const postFavoriteDto: FavoriteDto = {
        productId: productId,
        userId: userId,
      };
      const result = await this.favoriteService.addToFavorites(postFavoriteDto);
      deleteWithPattern(`fav_${userId}_*`);
      res.sendCreated(result, Constants.MESSAGE.FAVORITE_ADDED_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_TO_FAV,
            exception.message
          )
        );
      }
    }
  };
  getUserFavorites = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as User)?.id || null;
      const page = +req.query.page || 1;
      const size = +req.query.size || 10;

      const key: string = createKey(`fav_${userId}`, [
        userId,
        page?.toString(),
        size?.toString(),
      ]);
      let result = await getCache(key);
      if (_isEmpty(result)) {
        result = await this.favoriteService.getUserFavorites(
          userId,
          page,
          size
        );
        await setCache(key, result, 120);
      }
      res.sendOk(result, Constants.MESSAGE.FAVORITE_FETCHED_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_FAV,
            exception.message
          )
        );
      }
    }
  };

  removeFromFavorites = async (req: Request, res: Response) => {
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
      const productId = req.params.productId;
      const userId = (req.user as User)?.id || null;
      const favoriteDto: FavoriteDto = {
        productId: productId,
        userId: userId,
      };
      const [err, data] = await this.favoriteService.removeFromFavorites(
        favoriteDto
      );
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_FAV,
            'Favorite product is not found'
          )
        );
      }
      await deleteWithPattern(`fav_${userId}_*`);
      res.sendOk(data, Constants.MESSAGE.FAVORITE_REMOVED_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_FAV,
            exception.message
          )
        );
      }
    }
  };
}
