import { Router } from 'express';
import { Container } from 'typedi';
import {
  body,
  query,
  header,
  param,
  validationResult,
} from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { MessageService } from '../../services/messageService';
import IController from './IController';

export class MessageController implements IController {
  path = 'message/';
  router: Router;
  messageService: MessageService;

  constructor(router: Router) {
    this.router = router;
    this.messageService = Container.get(MessageService);
  }

  initializeRoutes() {
    this.router.get(
      '/',
      [
        query('key')
          .trim()
          .notEmpty()
          .withMessage(
            'key' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        header('language')
          .trim()
          .notEmpty()
          .withMessage(
            'language' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        header('client-type')
          .trim()
          .notEmpty()
          .withMessage(
            'client-type' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getMessage
    );
    this.router.put(
      '/',
      [
        body('key')
          .trim()
          .notEmpty()
          .withMessage(
            'key' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('value')
          .trim()
          .notEmpty()
          .withMessage(
            'value' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        header('language')
          .trim()
          .notEmpty()
          .withMessage(
            'language' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        header('client-type')
          .trim()
          .notEmpty()
          .withMessage(
            'client-type' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.updateMessage
    );
    this.router.post(
      '/',
      [
        body('value')
          .trim()
          .notEmpty()
          .withMessage(
            'value' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        header('client-type')
          .trim()
          .notEmpty()
          .withMessage(
            'client-type' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.createMessage
    );
    this.router.delete(
      '/:id',
      [
        param('id')
          .trim()
          .notEmpty()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.deleteMessage
    );
  }

  getMessage = async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MESSAGE,
            JSON.stringify(errors.array())
          )
        );
      }
      const key = req.query.key || null;
      const language = req.headers.language || null;
      const clientType = req.headers['client-type'] || null;
      const [err, result] = await this.messageService.getMessage(
        language,
        clientType,
        key
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
            Constants.ERROR_MAP.FAILED_TO_GET_MESSAGE,
            exception.message
          )
        );
      }
    }
  };

  updateMessage = async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_MESSAGE,
            JSON.stringify(errors.array())
          )
        );
      }
      const key = req.body.key || null;
      const value = req.body.value || null;
      const language = req.headers.language || null;
      const clientType = req.headers['client-type'] || null;
      const [err, result] = await this.messageService.updateMessage(
        language,
        clientType,
        key,
        value
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_MESSAGE,
            exception.message
          )
        );
      }
    }
  };

  createMessage = async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_MESSAGE,
            JSON.stringify(errors.array())
          )
        );
      }
      const value = req.body.value || null;
      const clientType = req.headers['client-type'] || null;
      const [err, result] = await this.messageService.createMessage(
        clientType,
        value
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
            Constants.ERROR_MAP.FAILED_TO_CREATE_MESSAGE,
            exception.message
          )
        );
      }
    }
  };

  deleteMessage = async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_DELETE_MESSAGE,
            JSON.stringify(errors.array())
          )
        );
      }
      const id = req.params.id || null;
      const [err, result] = await this.messageService.removeMessage(id);
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
            Constants.ERROR_MAP.FAILED_TO_DELETE_MESSAGE,
            exception.message
          )
        );
      }
    }
  };
}
