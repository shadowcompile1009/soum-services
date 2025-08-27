import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { body, header, validationResult } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import IController from './IController';
import { AuthGuard } from '../../middleware/authGuard';
import { DMSecurityFeeService } from '../../services/dmSecurityFeeService';
import { getUserIdFromTokenForNonAdminUsers } from '../../util/deltaMachineAuthentication';
import { DMSecurityFeeDocument } from '../../models/DMSecurityFee';
import { AuthGuardDM } from '../../middleware/authGuardDM';

export class DMSecurityFeeController implements IController {
  path = 'dm-securityfee/';
  router: Router;
  dmSecurityFeeService: DMSecurityFeeService;

  constructor(router: Router) {
    this.router = router;
    this.dmSecurityFeeService = Container.get(DMSecurityFeeService);
  }

  initializeRoutes() {
    this.router.get('/status', AuthGuard, this.getByUserId);
    this.router.put(
      '/deposit',
      [
        body('userId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.USER_ID),
        header('client-id').notEmpty().equals('api-v1'),
      ],
      this.updateSecurityFeeStatusAndDeposit
    );
    this.router.put(
      '/withdraw',
      [
        body('userId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.USER_ID),
        header('client-id').notEmpty().equals('api-v1'),
      ],
      this.updateSecurityFeeStatusAndWithdraw
    );
    this.router.get('/status/:userId', this.getSecurityFeeStatus);
    this.router.put(
      '/deduct-fee',
      [
        AuthGuardDM,
        body('userId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.USER_ID),
        body('orderId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
      ],
      this.deductSecurityFee
    );
  }

  getByUserId = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DM_SECURITY_FEE,
            JSON.stringify(errors.array())
          )
        );
      }
      const token = req.headers['token'] as string;
      const userId = getUserIdFromTokenForNonAdminUsers(token);
      const result = await this.dmSecurityFeeService.getByUserId(userId);
      const securityFeeObj = result.result as DMSecurityFeeDocument;
      if (securityFeeObj) {
        result.result =
          await this.dmSecurityFeeService.updateSecurityFeeIfApplicable(
            securityFeeObj
          );
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
            Constants.ERROR_MAP.FAILED_TO_GET_DM_SECURITY_FEE,
            exception.message
          )
        );
      }
    }
  };

  getSecurityFeeStatus = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DM_SECURITY_FEE,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = req.params.userId;
      const result = await this.dmSecurityFeeService.getByUserId(userId);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DM_SECURITY_FEE,
            exception.message
          )
        );
      }
    }
  };

  updateSecurityFeeStatusAndDeposit = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
            JSON.stringify(errors.array())
          )
        );
      }
      const result =
        this.dmSecurityFeeService.updateSecurityFeeStatusAndDeposit(
          req.body.userId
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
            exception.message
          )
        );
      }
    }
  };

  updateSecurityFeeStatusAndWithdraw = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
            JSON.stringify(errors.array())
          )
        );
      }
      const result =
        this.dmSecurityFeeService.updateSecurityFeeStatusAndWithdraw(
          req.body.userId
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
            exception.message
          )
        );
      }
    }
  };

  deductSecurityFee = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
            JSON.stringify(errors.array())
          )
        );
      }
      const result = await this.dmSecurityFeeService.deductSecurityFee(
        req.body.userId,
        req.body.orderId
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
            exception.message
          )
        );
      }
    }
  };
}
