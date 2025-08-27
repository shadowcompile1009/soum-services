import { Request, Response, Router } from 'express';
import { check, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { Container } from 'typedi';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { AskSellerType } from '../../enums/AskSeller';
import { SellerUserType } from '../../grpc/proto/commission/sellerType.enum';
import { AuthGuard } from '../../middleware/authGuard';
import { AuthGuardDM } from '../../middleware/authGuardDM';
import { AskSellerService } from '../../services/askSellerService';
import { _get } from '../../util/common';
import IController from './IController';

export class AskSellerController implements IController {
  path = 'askSeller/';
  router: Router;
  askSellerService: AskSellerService;

  constructor(router: Router) {
    this.router = router;
    this.askSellerService = Container.get(AskSellerService);
  }

  initializeRoutes() {
    this.router.get(
      '/',
      [
        AuthGuardDM,
        query('sellerType')
          .isString()
          .optional()
          .withMessage(
            'sellerType' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        query('isAnswered')
          .isString()
          .optional()
          .withMessage(
            'isAnswered' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getAskSeller
    );
    this.router.get('/deleted', [AuthGuardDM], this.getDeletedAskSeller);
    this.router.get(
      '/:sellerId/pending',
      [AuthGuard],
      this.getPendingAskSeller
    );
    this.router.put(
      '/:questionID',
      [
        AuthGuard,
        check('questionID')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.QUESTION_ID),
      ],
      this.updateAskSeller
    );
    this.router.get('/:buyerId/ask', [AuthGuard], this.getAllQuestionOfBuyer);
    this.router.put(
      '/delete/:questionID',
      [
        AuthGuardDM,
        check('questionID')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.QUESTION_ID),
      ],
      this.deleteQuestion
    );

    this.router.post(
      '/send-reminder-notification',
      [AuthGuard],
      this.sendReminderNotification
    );
  }

  getAskSeller = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query?.page?.toString()) || 1;
      const size = parseInt(req.query?.size?.toString()) || 50;
      const sellerType = _get(req, 'query.sellerType', null);
      const isAnswered = _get(req, 'query.isAnswered', null);

      const parseBoolean = (value: any) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
      };

      let sellerTypeBoolean = null;
      const isAnsweredBoolean = parseBoolean(isAnswered);

      if (sellerType === SellerUserType.MERCHANT_SELLER) {
        sellerTypeBoolean = true;
      } else if (sellerType === SellerUserType.INDIVIDUAL_SELLER) {
        sellerTypeBoolean = false;
      }

      const result = await this.askSellerService.getAskSeller(
        page,
        size,
        'Active',
        sellerTypeBoolean,
        isAnsweredBoolean
      );

      res.sendOk(result, Constants.MESSAGE.GET_ASK_SELLER_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_GET_ASK_SELLER,
            exception.message
          )
        );
      }
    }
  };

  deleteQuestion = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_DELETE_QUESTION,
            JSON.stringify(errors.array())
          )
        );
      }
      const questionID = req.params.questionID;

      if (!mongoose.isValidObjectId(questionID)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.INVALID_ID_FORMAT,
            Constants.MESSAGE.INVALID_ID_FORMAT
          )
        );
      }
      const reason = !req.body.reason ? '' : req.body.reason;
      const result = await this.askSellerService.deleteQuestion(
        questionID,
        reason
      );
      res.sendOk(result, Constants.MESSAGE.DELETE_QUESTION_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_DELETE_QUESTION,
            exception.message
          )
        );
      }
    }
  };

  getDeletedAskSeller = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query?.page?.toString()) || 1;
      const size = parseInt(req.query?.size?.toString()) || 50;
      const result = await this.askSellerService.getAskSeller(
        page,
        size,
        'Delete'
      );
      res.sendOk(result, Constants.MESSAGE.GET_ASK_SELLER_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_GET_ASK_SELLER,
            exception.message
          )
        );
      }
    }
  };

  getPendingAskSeller = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query?.page?.toString()) || 1;
      const size = parseInt(req.query?.size?.toString()) || 50;
      const productID = req?.query?.productID?.toString() || '';
      const sellerId = req.params?.sellerId;
      const result = await this.askSellerService.getQuestionByUserId(
        sellerId,
        page,
        size,
        AskSellerType.SELLER_PENDING_QUESTIONS,
        productID
      );

      return res.sendOk(result.result, result.message);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_GET_ASK_SELLER,
            exception.message
          )
        );
      }
    }
  };

  updateAskSeller = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_ASK_SELLER,
            JSON.stringify(errors.array())
          )
        );
      }
      const questionID = req.params.questionID;
      const answer = !req.body.answer ? '' : req.body.answer;

      if (!mongoose.isValidObjectId(questionID)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.INVALID_ID_FORMAT,
            Constants.MESSAGE.INVALID_ID_FORMAT
          )
        );
      }
      const result = await this.askSellerService.updateAnswerByQuestionID(
        questionID,
        answer
      );

      res.sendOk(result, Constants.MESSAGE.UPDATE_QUESTION_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_UPDATE_ASK_SELLER,
            exception.message
          )
        );
      }
    }
  };

  getAllQuestionOfBuyer = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query?.page?.toString()) || 1;
      const size = parseInt(req.query?.size?.toString()) || 50;
      const buyerId = req.params?.buyerId;
      const result = await this.askSellerService.getQuestionByUserId(
        buyerId,
        page,
        size,
        AskSellerType.BUYER_QUESTIONS
      );

      return res.sendOk(result.result, result.message);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_GET_ASK_SELLER,
            exception.message
          )
        );
      }
    }
  };

  sendReminderNotification = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_DELETE_QUESTION,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = req.body.productId;
      const askSellerId = req.body.askSellerId;

      await this.askSellerService.sendReminderNotification(
        productId,
        askSellerId
      );
      return res.sendOk(true);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_GET_ASK_SELLER,
            exception.message
          )
        );
      }
    }
  };
}
