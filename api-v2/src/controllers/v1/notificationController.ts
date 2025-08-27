import { Request, Response, Router } from 'express';
import _isEmpty from 'lodash/isEmpty';
import Container from 'typedi';
import { query, body, param, validationResult } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import {
  PushNotificationMessageInput,
  sendMulticastToDevices,
} from '../../libs/firebase';
import {
  DeviceTokenDocument,
  DeviceTokenInput,
} from '../../models/DeviceToken';
import { NotificationService } from '../../services/notificationService';
import { _get } from '../../util/common';
import IController from './IController';
import { AuthGuard } from '../../middleware/authGuard';
import {
  createNotificationEvent,
  NotificationRequestEvent,
} from '../../util/notificationLogs';

export class NotificationController implements IController {
  path = 'notification/';
  router: Router;
  notificationService: NotificationService;
  constructor(router: Router) {
    this.router = router;
    this.notificationService = Container.get(NotificationService);
  }

  initializeRoutes() {
    this.router.post(
      '/push-message-by-fcm',
      [
        body('registration_tokens')
          .isArray({ min: 1 })
          .withMessage(Constants.VALIDATE_REQUEST_MSG.EMPTY_REGISTRATION_TOKEN),
        body('title')
          .trim()
          .isString()
          .withMessage(
            'title' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('body')
          .trim()
          .isString()
          .withMessage(
            'body' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.pushMessageFcm
    );
    this.router.post(
      '/push-notify',
      [
        body('users')
          .isArray({ min: 1 })
          .withMessage(Constants.VALIDATE_REQUEST_MSG.EMPTY_USER_ID_ARRAY),
        body('title')
          .trim()
          .isString()
          .withMessage(
            'title' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('body')
          .trim()
          .isString()
          .withMessage(
            'body' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.pushNotify
    );
    this.router.put(
      '/refresh-fcm',
      [
        body('user_id')
          .trim()
          .notEmpty()
          .withMessage(
            'user_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('fcm_token')
          .trim()
          .notEmpty()
          .withMessage(
            'fcm_token' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.refreshFcmToken
    );
    this.router.post(
      '/fcm-registration',
      this.validateFcmTokenInput(),
      this.addFcmTokenWithDevice
    );
    this.router.put(
      '/fcm-registration/:fcmToken',
      this.validateUpdateFcmTokenInput(),
      this.updateFcmToken
    );
    this.router.delete(
      '/fcm-registration/:fcmToken',
      [
        AuthGuard,
        param('fcmToken')
          .trim()
          .notEmpty()
          .withMessage(
            'fcmToken' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        query('user-id')
          .trim()
          .notEmpty()
          .withMessage(
            'user-id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.deleteFcmToken
    );
    this.router.delete(
      '/notification-log/:logId',
      [
        param('logId')
          .trim()
          .notEmpty()
          .withMessage(
            'logId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.deleteNotificationLog
    );
    this.router.get(
      '/fcm-tokens',
      [
        query('page')
          .trim()
          .isNumeric()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('pageSize')
          .trim()
          .isNumeric()
          .withMessage(
            'pageSize' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
      ],
      this.getAllDeviceTokens
    );
    this.router.get(
      '/list-notification-data',
      [
        query('activityType')
          .trim()
          .isString()
          .withMessage(
            'activityType' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        query('page')
          .isNumeric()
          .optional()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('page').default(1),
        query('pageSize')
          .isNumeric()
          .optional()
          .withMessage(
            'pageSize' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('pageSize').default(100),
      ],
      this.getNotificationData
    );
    this.router.get(
      '/list-notification-log',
      [
        query('page')
          .isNumeric()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('page').default(1),
        query('pageSize')
          .isNumeric()
          .withMessage(
            'pageSize' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('pageSize').default(100),
      ],
      this.getNotificationLog
    );
    this.router.post('/send-msg-notification', this.testToSendMsgNotification);
  }

  pushMessageFcm = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_SETTING,
            JSON.stringify(errors.array())
          )
        );
      }
      const fcmTokens = req.body.registration_tokens || [];
      const title = req.body.title;
      const body = req.body.body;
      const data = req.body.data;
      if (_isEmpty(fcmTokens)) {
        res.sendError(Constants.MESSAGE.DEVICE_TOKEN_NOT_FOUND);
      }
      const params: PushNotificationMessageInput = {
        title,
        body,
        screenPage: data.type ? data.type : 'ProductDetailsScreen',
        fcmTokens,
      };

      const [err, result] = await sendMulticastToDevices(params, data);
      if (!err) {
        res.sendOk({ data: result, message: 'Sent Multicast push message' });
      } else {
        res.sendError(result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_SETTING,
            exception.message
          )
        );
      }
    }
  };

  pushNotify = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_SETTING,
            JSON.stringify(errors.array())
          )
        );
      }
      const users = req.body.users || [];
      const title = req.body.title;
      const body = req.body.body;
      const data = req.body.data;

      const [err, fcmTokenDocs] =
        await this.notificationService.getDeviceTokensOfListUsers(users);
      if (err) {
        res.sendError(fcmTokenDocs);
      }

      const fcmTokens = (fcmTokenDocs as DeviceTokenDocument[]).map(
        ft => ft.fcm_token
      );
      const params: PushNotificationMessageInput = {
        title,
        body,
        screenPage: data.type ? data.type : 'ProductDetailsScreen',
        fcmTokens,
      };
      const result = await sendMulticastToDevices(params);
      if (result) {
        res.sendOk({}, 'Sent push message');
      } else {
        res.sendError({ message: 'Cannot send push message' });
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_SETTING,
            exception.message
          )
        );
      }
    }
  };

  refreshFcmToken = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DEVICE_TOKEN,
            JSON.stringify(errors.array())
          )
        );
      }
      const updateToken: DeviceTokenInput = {
        user_id: req.body.user_id,
        fcm_token: req.body.fcm_token,
      };
      const result = await this.notificationService.updateDeviceToken(
        updateToken
      );
      if (result) {
        res.sendOk(updateToken, Constants.MESSAGE.DEVICE_TOKEN_UPDATED_SUCCESS);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.MESSAGE.FAILED_TO_UPDATE_DEVICE_TOKEN
          )
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DEVICE_TOKEN,
            exception.message
          )
        );
      }
    }
  };

  validateFcmTokenInput() {
    return [
      body('device_id')
        .trim()
        .notEmpty()
        .withMessage(
          'device_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('fcm_token')
        .trim()
        .notEmpty()
        .withMessage(
          'fcm_token' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('user_id')
        .trim()
        .notEmpty()
        .withMessage(
          'user_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('platform')
        .trim()
        .notEmpty()
        .withMessage(
          'platform' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('app_version')
        .trim()
        .notEmpty()
        .withMessage(
          'app_version' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('lang')
        .trim()
        .notEmpty()
        .withMessage(
          'lang' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('status')
        .trim()
        .isString()
        .withMessage(
          'status' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
    ];
  }
  addFcmTokenWithDevice = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_DEVICE_TOKEN,
            JSON.stringify(errors.array())
          )
        );
      }
      const creatingToken: DeviceTokenInput = {
        device_id: req.body.device_id,
        fcm_token: req.body.fcm_token,
        user_id: req.body.user_id,
        platform: req.body.platform,
        app_version: req.body.app_version,
        lang: req.body.lang,
        status: req.body.status || 'Enabled',
      };
      const [error, result] = await this.notificationService.addDeviceToken(
        creatingToken
      );
      if (!error) {
        res.sendCreated(result, Constants.MESSAGE.DEVICE_TOKEN_ADD_SUCCESS);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.MESSAGE.FAILED_TO_ADD_DEVICE_TOKEN,
            result.toString()
          )
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
            Constants.ERROR_MAP.FAILED_TO_ADD_DEVICE_TOKEN,
            exception.message
          )
        );
      }
    }
  };

  validateUpdateFcmTokenInput() {
    return [
      param('fcmToken')
        .trim()
        .notEmpty()
        .withMessage(
          'fcmToken' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('user_id')
        .trim()
        .notEmpty()
        .withMessage(
          'user_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('lang')
        .trim()
        .notEmpty()
        .withMessage(
          'lang' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('status')
        .trim()
        .notEmpty()
        .withMessage(
          'status' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
    ];
  }
  updateFcmToken = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DEVICE_TOKEN,
            JSON.stringify(errors.array())
          )
        );
      }
      const updatingToken: DeviceTokenInput = {
        fcm_token: req.params.fcmToken,
        user_id: req.body.user_id,
        lang: req.body.lang,
        status: req.body.status,
      };
      const [error, result] = await this.notificationService.updateDeviceToken(
        updatingToken
      );
      if (!error) {
        res.sendOk(result, Constants.MESSAGE.DEVICE_TOKEN_UPDATED_SUCCESS);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.MESSAGE.FAILED_TO_UPDATE_DEVICE_TOKEN,
            result.toString()
          )
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DEVICE_TOKEN,
            exception.message
          )
        );
      }
    }
  };

  deleteFcmToken = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_DEVICE_TOKEN,
            JSON.stringify(errors.array())
          )
        );
      }

      const fcmToken = _get(req.params, 'fcmToken', '');
      const userId = _get(req.query, 'user-id', '');

      // Disable for now, as we have remove all device token
      // const currentUser = _get(req, 'userInfo', null);
      // if (currentUser && currentUser.id !== userId) {
      //   return res.sendError(new ErrorResponseDto(
      //     Constants.ERROR_CODE.UNAUTHORIZED,
      //     Constants.ERROR_TYPE.API,
      //     Constants.ERROR_MAP.FAILED_TO_REMOVE_DEVICE_TOKEN,
      //     Constants.MESSAGE.FAILED_TO_REMOVE_DEVICE_TOKEN,
      //   ));
      // }

      const [error, result] = await this.notificationService.removeDeviceToken(
        fcmToken,
        userId
      );
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_DEVICE_TOKEN,
            result.toString()
          )
        );
      } else {
        res.sendOk(result, Constants.MESSAGE.DEVICE_TOKEN_REMOVED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_DEVICE_TOKEN,
            exception.message
          )
        );
      }
    }
  };

  deleteNotificationLog = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_NOTIFICATION_LOG,
            JSON.stringify(errors.array())
          )
        );
      }
      const id = req.params.logId;
      const [error, result] =
        await this.notificationService.deleteNotificationLog(id);
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            result.toString()
          )
        );
      } else {
        res.sendOk(result, Constants.MESSAGE.NOTIFICATION_LOG_REMOVED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_NOTIFICATION_LOG,
            exception.message
          )
        );
      }
    }
  };

  getNotificationData = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.NOTIFICATION_FAILURE,
            JSON.stringify(errors.array())
          )
        );
      }
      const activityTypes = _get(req.query, 'activityTypes', []);
      const page = Number(_get(req.query, 'page', 1));
      const size = Number(_get(req.query, 'pageSize', 100));
      const [error, notificationData] =
        await this.notificationService.getNotificationData(
          activityTypes,
          page,
          size
        );
      if (!error) {
        res.sendOk(
          notificationData,
          Constants.MESSAGE.NOTIFICATION_GET_SUCCESS
        );
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.NOTIFICATION_FAILURE,
            notificationData as string
          )
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
            Constants.ERROR_MAP.NOTIFICATION_FAILURE,
            exception.message
          )
        );
      }
    }
  };

  getNotificationLog = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_DEVICE_TOKEN,
            JSON.stringify(errors.array())
          )
        );
      }

      const page = Number(_get(req.query, 'page', 1));
      const pageSize = Number(_get(req.query, 'pageSize', 100));
      const [error, notificationLog] =
        await this.notificationService.getNotificationLog(page, pageSize);
      if (!error) {
        res.sendOk(
          notificationLog,
          Constants.MESSAGE.NOTIFICATION_LOG_GET_SUCCESS
        );
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.NOTIFICATION_LOG_FAILURE,
            notificationLog as string
          )
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
            Constants.ERROR_MAP.NOTIFICATION_LOG_FAILURE,
            exception.message
          )
        );
      }
    }
  };

  getAllDeviceTokens = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.NOTIFICATION_FAILURE,
            JSON.stringify(errors.array())
          )
        );
      }

      const page = Number(_get(req.query, 'page', 1));
      const pageSize = Number(_get(req.query, 'pageSize', 100));
      const [error, userTokens] =
        await this.notificationService.getAllDeviceTokens(page, pageSize);
      if (!error) {
        res.sendOk(userTokens, Constants.MESSAGE.DEVICE_TOKEN_GET_SUCCESS);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.DEVICE_TOKEN_FAILURE,
            userTokens as string
          )
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
            Constants.ERROR_MAP.DEVICE_TOKEN_FAILURE,
            exception.message
          )
        );
      }
    }
  };

  testToSendMsgNotification = async (req: Request, res: Response) => {
    try {
      const eventLogRequest: NotificationRequestEvent = {
        eventType: Constants.activity_log_template.STATUS_CHANGE,
        userId: '607cae098063582dd8ec689a',
        service: 'v2',
        messageTitle: 'Test Title',
        messageBody:
          'Changed Order 606a028f52d14b6f84b3f1af status from Active to Disable',
        isRead: false,
        platform: 'IOS',
      };
      await createNotificationEvent(eventLogRequest);
      res.sendOk('Send notification successful');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SEND_PUSH_MESSAGE,
            exception.message
          )
        );
      }
    }
  };
}
