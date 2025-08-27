import { Request, Response, Router } from 'express';
import _isEmpty from 'lodash/isEmpty';
import { Container } from 'typedi';
import { param, body, validationResult } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { getCache, setCache } from '../../libs/redis';
import { ResponseInput } from '../../models/Response';
import { ResponseService } from '../../services/responseService';
import IController from './IController';
import { CheckTokenIfFound } from '../..//middleware/authGuard';

export class ResponseController implements IController {
  path = 'response/';
  router: Router;
  responseService: ResponseService;

  constructor(router: Router) {
    this.router = router;
    this.responseService = Container.get(ResponseService);
  }

  initializeRoutes() {
    this.router.get(
      '/:responseId',
      [
        param('responseId')
          .trim()
          .isString()
          .withMessage(
            'responseId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getResponse
    );
    this.router.get(
      '/get-full-response/:responseId',
      [
        CheckTokenIfFound,
        param('responseId')
          .trim()
          .isString()
          .withMessage(
            'responseId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getFullResponse
    );
    this.router.get(
      '/filter/:productId',
      [
        param('productId')
          .trim()
          .isString()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getFilterResponse
    );
    this.router.post(
      '/',
      [
        CheckTokenIfFound,
        body('product_id')
          .trim()
          .optional()
          .isString()
          .withMessage(
            'product_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('responses')
          .isArray()
          .optional()
          .withMessage(
            'responses' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('responses').default([]),
      ],
      this.createResponse
    );
    this.router.put(
      '/:responseId',
      [
        param('responseId')
          .trim()
          .isString()
          .withMessage(
            'responseId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('product_id')
          .trim()
          .isString()
          .withMessage(
            'product_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('responses')
          .isArray()
          .optional()
          .withMessage(
            'responses' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('responses').default([]),
      ],
      this.updateResponse
    );
    this.router.delete(
      '/:responseId',
      [
        param('responseId')
          .trim()
          .isString()
          .withMessage(
            'responseId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.removeResponse
    );
  }

  getResponse = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
            JSON.stringify(errors.array())
          )
        );
      }
      const responseId = req.params.responseId || null;
      const cacheProductResponse = await getCache(`response_${responseId}`);
      if (_isEmpty(cacheProductResponse)) {
        const [err, result] = await this.responseService.getResponse(
          responseId
        );
        if (err) {
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              result.toString()
            )
          );
        } else {
          await setCache(`response_${responseId}`, result);
          res.sendOk(result);
        }
      } else {
        res.sendOk(cacheProductResponse);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
            exception.message
          )
        );
      }
    }
  };

  getFullResponse = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
            JSON.stringify(errors.array())
          )
        );
      }
      const responseId = req.params.responseId || null;
      const userId = (req.user as any)?.id || null;
      const cacheProductResponse = await getCache(
        `${process.env.REDIS_ENV}_response_${responseId}`
      );
      if (_isEmpty(cacheProductResponse)) {
        const [err, result] = await this.responseService.getFullResponse(
          responseId,
          userId
        );

        if (err) {
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              result.toString()
            )
          );
        } else {
          await setCache(
            `${process.env.REDIS_ENV}_response_${responseId}`,
            result
          );
          res.sendOk(result);
        }
      } else {
        res.sendOk(cacheProductResponse);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
            exception.message
          )
        );
      }
    }
  };

  getFilterResponse = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = req.params.productId || null;
      const cacheProductResponse = await getCache(
        `filter_response_${productId}`
      );
      if (_isEmpty(cacheProductResponse)) {
        const [err, result] = await this.responseService.getFilterResponse(
          productId
        );
        if (err) {
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              result.toString()
            )
          );
        } else {
          await setCache(`response_${productId}`, result);
          res.sendOk(result, Constants.MESSAGE.RESPONSE_GET_SUCCESS);
        }
      } else {
        res.sendOk(
          cacheProductResponse,
          Constants.MESSAGE.RESPONSE_GET_SUCCESS
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
            Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
            exception.message
          )
        );
      }
    }
  };

  createResponse = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_RESPONSE,
            JSON.stringify(errors.array())
          )
        );
      }
      const request: ResponseInput = {
        product_id: req.body.product_id || null,
        responses: req.body.responses || [],
      };
      const [err, result, updatedScore] =
        await this.responseService.addResponse(request);

      if (updatedScore < 75) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_LIST_EXTENSIVELY_USED_PRODUCT,
            Constants.MESSAGE.FAILED_TO_LIST_EXTENSIVELY_USED_PRODUCTS
          )
        );
      } else {
        if (err) {
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              result.toString()
            )
          );
        } else {
          const data = Object.assign((result as any)._doc, {
            score: updatedScore,
          });
          res.sendCreated(data, Constants.MESSAGE.RESPONSE_CREATE_SUCCESS);
        }
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_RESPONSE,
            exception.message
          )
        );
      }
    }
  };

  updateResponse = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_RESPONSE,
            JSON.stringify(errors.array())
          )
        );
      }
      const responseId = req.params.responseId || null;
      const request: ResponseInput = {
        product_id: req.body.product_id || null,
        responses: req.body.responses || [],
      };
      const [err, result, updatedScore] =
        await this.responseService.updateResponse(responseId, request);
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            result.toString()
          )
        );
      } else {
        const data = Object.assign((result as any)._doc, {
          score: updatedScore,
        });
        res.sendOk(data);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_RESPONSE,
            exception.message
          )
        );
      }
    }
  };

  removeResponse = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_RESPONSE,
            JSON.stringify(errors.array())
          )
        );
      }
      const responseId = req.params.responseId || null;
      const [err, result] = await this.responseService.removeResponse(
        responseId
      );
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            result.toString()
          )
        );
      } else {
        res.sendOk(result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_RESPONSE,
            exception.message
          )
        );
      }
    }
  };
}
