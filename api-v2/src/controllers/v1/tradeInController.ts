import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import Container from 'typedi';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { TradeInStatus } from '../../enums/TradeInStatus';
import { AuthGuard } from '../../middleware/authGuard';
import { AuthGuardDM } from '../../middleware/authGuardDM';
import { TradeInService } from '../../services/tradeInService';
import { isAdminAccess } from '../../util/authentication';
import IController from './IController';

export class TradeInController implements IController {
  path = 'tradein';
  router: Router;
  tradeInService: TradeInService;
  constructor(router: Router) {
    this.router = router;
    this.tradeInService = Container.get(TradeInService);
  }

  initializeRoutes() {
    this.router.get('/', AuthGuard, this.getList);
    this.router.get('/my-trade-ins', AuthGuard, this.getMyTradeIns);
    this.router.get('/:id', AuthGuardDM, this.load);
    this.router.put(
      '/:id/status',
      AuthGuardDM,
      [
        body('status')
          .notEmpty()
          .isString()
          .isIn([TradeInStatus.ACCEPTED, TradeInStatus.REJECTED])
          .withMessage(Constants.VALIDATE_REQUEST_MSG.TRADE_IN_STATUS),
      ],
      this.updateStatus
    );
    this.router.put(
      '/cap',
      AuthGuard,
      [
        body('modelId')
          .notEmpty()
          .isString()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.MODEL_ID),
      ],
      this.updateTradeInCap
    );
  }

  updateTradeInCap = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_TRADE_IN_CAP,
            JSON.stringify(errors.array())
          )
        );
      }
      const modelId = req.body.modelId;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const userId = (req?.userInfo as any)._id;
      const data = await this.tradeInService.updateTradeInCap(modelId, userId);
      res.sendOk(data, Constants.MESSAGE.SUCCESSFULLY_UPDATED_TRADE_IN_CAP);
    } catch (exception) {
      console.log(exception);
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_TRADE_IN_CAP,
            exception.message
          )
        );
      }
    }
  };

  getList = async (req: Request, res: Response) => {
    try {
      if (!isAdminAccess(req)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            Constants.MESSAGE.ALLOW_ONLY_ADMIN_ACCESS
          )
        );
      }
      const limit = parseInt(req?.query?.limit?.toString()) || 20;
      const offset = parseInt(req?.query?.offset?.toString()) || 0;
      const productId = req?.query?.productId?.toString() || '';

      const data = await this.tradeInService.getList({
        limit,
        offset,
        productId,
      });
      res.sendOk(data);
    } catch (exception) {
      console.log(exception);
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PRODUCTS,
            exception.message
          )
        );
      }
    }
  };

  getMyTradeIns = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req?.query?.limit?.toString()) || 20;
      const offset = parseInt(req?.query?.offset?.toString()) || 0;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const userId = (req?.userInfo as any)._id;

      const data = await this.tradeInService.getMyTradeInsList({
        limit,
        offset,
        userId,
      });
      res.sendOk(data);
    } catch (exception) {
      console.log(exception);
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PRODUCTS,
            exception.message
          )
        );
      }
    }
  };

  load = async (req: Request, res: Response) => {
    try {
      const productId = req?.params?.id?.toString();

      const data = await this.tradeInService.load(productId);
      res.sendOk(data);
    } catch (exception) {
      console.log(exception);
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PRODUCTS,
            exception.message
          )
        );
      }
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      if (!isAdminAccess(req)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            Constants.MESSAGE.ALLOW_ONLY_ADMIN_ACCESS
          )
        );
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = req?.params?.id?.toString();
      const status: TradeInStatus = req?.body?.status?.toString();

      const data = await this.tradeInService.updateTradeInStatus(
        productId,
        status
      );
      res.sendOk(data);
    } catch (exception) {
      console.log(exception);
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };
}
