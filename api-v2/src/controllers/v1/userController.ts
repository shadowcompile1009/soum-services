import { Request, Response, Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import _isEmpty from 'lodash/isEmpty';
import { Types } from 'mongoose';
import { Container } from 'typedi';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { Region } from '../../enums/RegionSettingsEnum';
import { createKey, deleteCache, getCache, setCache } from '../../libs/redis';
import { sendSMSViaUnifonic } from '../../libs/unifonic';
import { AuthGuard } from '../../middleware/authGuard';
import { AuthGuardDM } from '../../middleware/authGuardDM';
import { LegacyUserAddressInput } from '../../models/Address';
import { DeviceTokenInput } from '../../models/DeviceToken';
import { UpdateUserInput, UserLegacyDocument } from '../../models/LegacyUser';
import { AskSellerService } from '../../services/askSellerService';
import { NotificationService } from '../../services/notificationService';
import { OrderService } from '../../services/orderService';
import { ProductService } from '../../services/productService';
import { ReportingService } from '../../services/reportingService';
import { SearchService } from '../../services/searchService';
import { SettingService } from '../../services/settingService';
import { UserService } from '../../services/userService';
import { isAdminAccess } from '../../util/authentication';
import { _get } from '../../util/common';
import { smsDSNWebHook } from '../../util/webEngageEvents';
import IController from './IController';

export class UserController implements IController {
  path = 'user/';
  router: Router;
  userService: UserService;
  searchService: SearchService;
  productService: ProductService;
  orderService: OrderService;
  notificationService: NotificationService;
  reportingService: ReportingService;
  settingService: SettingService;
  askSellerService: AskSellerService;
  constructor(router: Router) {
    this.router = router;
    this.userService = Container.get(UserService);
    this.productService = Container.get(ProductService);
    this.searchService = Container.get(SearchService);
    this.notificationService = Container.get(NotificationService);
    this.orderService = Container.get(OrderService);
    this.reportingService = Container.get(ReportingService);
    this.settingService = Container.get(SettingService);
    this.askSellerService = Container.get(AskSellerService);
  }

  initializeRoutes() {
    this.router.post('/signup', this.validateSignUpInput(), this.signUp);
    this.router.get(
      '/:userId/orders-synced',
      [
        query('limit')
          .isNumeric()
          .optional()
          .withMessage(
            'limit' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('limit').default(5),
      ],
      this.syncOrders
    );
    this.router.put(
      '/:id/profile',
      this.validateToUpdateUserInput(),
      this.updateUser
    );
    this.router.put(
      '/:userId/details',
      this.validateToUpdateCustomerInput(),
      this.updateCustomer
    );
    this.router.post(
      '/:userId/address',
      this.validateToAddAddressInput(),
      this.addAddress
    );
    this.router.get(
      '/:userId/address',
      [
        AuthGuard,
        param('userId')
          .trim()
          .isString()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getAddresses
    );
    this.router.get(
      '/app/inspector/users',
      [AuthGuardDM],
      this.getUsersForInspector
    );
    this.router.post(
      '/password/request/sms',
      [
        body('phone_number')
          .trim()
          .isString()
          .withMessage(
            'phone_number' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.resetPasswordSMS
    );
    this.router.post(
      '/password/verify',
      [
        body('token')
          .trim()
          .isString()
          .withMessage(
            'token' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('password')
          .trim()
          .isString()
          .withMessage(
            'password' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.verifyResetPasswordToken
    );
    this.router.put(
      '/:userId/address/:addressId',
      this.validateToUpdateUserAddressInput(),
      this.updateUserAddresses
    );
    this.router.delete(
      '/:userId/address/:addressId',
      this.validateToRemoveUserAddressInput(),
      this.deleteUserAddresses
    );
    this.router.post(
      '/wishlist',
      [
        AuthGuard,
        param('product_id')
          .trim()
          .isString()
          .withMessage(
            'product_id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.addProductToWishList
    );
    this.router.get(
      '/my-sell-products',
      [
        AuthGuard,
        query('page')
          .isNumeric()
          .optional()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('page').default(1),
        query('size')
          .isNumeric()
          .optional()
          .withMessage(
            'size' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('size').default(10),
        query('sort').default('latest'),
      ],
      this.getMySellProducts
    );
    this.router.get(
      '/my-expired-products',
      [
        AuthGuard,
        query('page')
          .isNumeric()
          .optional()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('page').default(1),
        query('size')
          .isNumeric()
          .optional()
          .withMessage(
            'size' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('size').default(10),
      ],
      this.getMyExpiredProducts
    );
    this.router.get(
      '/my-reservations',
      [
        AuthGuard,
        query('page')
          .isNumeric()
          .optional()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('page').default(1),
        query('size')
          .isNumeric()
          .optional()
          .withMessage(
            'size' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('size').default(10),
        query('orderId')
          .isString()
          .optional()
          .withMessage(
            'order_id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getMyReservations
    );
    this.router.get(
      '/my-order-and-offers-count',
      [AuthGuard],
      this.getMyOrderAndOffersCount
    );
    this.router.get(
      '/:userId/fcm',
      [
        AuthGuard,
        param('userId')
          .trim()
          .isString()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getUserDeviceTokens
    );
    this.router.post(
      '/:userId/fcm',
      [
        AuthGuard,
        param('userId')
          .trim()
          .isString()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.addDeviceToken
    );
    this.router.put(
      '/:userId/fcm/:fcmToken',
      [
        AuthGuard,
        param('userId')
          .trim()
          .isString()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        param('fcmToken')
          .trim()
          .isString()
          .withMessage(
            'fcmToken' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.updateUserDeviceToken
    );
    this.router.delete(
      '/:userId/fcm/',
      [
        AuthGuard,
        param('userId')
          .trim()
          .isString()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.deleteUserDeviceTokens
    );
    this.router.get('/preferences', [AuthGuard], this.getUserPreferences);
    this.router.put(
      '/preferences',
      [
        AuthGuard,
        body('skip_pre_listing')
          .isBoolean()
          .optional()
          .withMessage(
            'skip_pre_listing' +
              Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE
          ),
        body('skip_post_listing')
          .isBoolean()
          .optional()
          .withMessage(
            'skip_post_listing' +
              Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE
          ),
        body('is_wallet_first_visit')
          .isBoolean()
          .optional()
          .withMessage(
            'is_wallet_first_visit' +
              Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE
          ),
        body('is_new_badge_alert')
          .isBoolean()
          .optional()
          .withMessage(
            'is_new_badge_alert' +
              Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE
          ),
        body('is_cancellation_alert')
          .isBoolean()
          .optional()
          .withMessage(
            'is_cancellation_alert' +
              Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE
          ),
        body('is_penalized_alert')
          .isBoolean()
          .optional()
          .withMessage(
            'is_penalized_alert' +
              Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE
          ),
      ],
      this.updateUserPreferences
    );
    this.router.delete(
      '/:userId',
      [
        AuthGuard,
        param('userId')
          .trim()
          .isString()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.deleteUser
    );
    this.router.get(
      '/orders',
      [
        AuthGuard,
        param('type')
          .trim()
          .isString()
          .withMessage(
            'orders type' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getUserOrders
    );
    this.router.put(
      '/change-status/:userId',
      [
        AuthGuardDM,
        param('userId')
          .trim()
          .isString()
          .notEmpty()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('status')
          .trim()
          .isString()
          .notEmpty()
          .isIn(['Inactive', 'Active'])
          .withMessage(Constants.VALIDATE_REQUEST_MSG.EMPTY_USER_STATUS),
        body('isBlockUser')
          .isBoolean()
          .optional()
          .withMessage(
            'isBlockUser' + Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE
          ),
      ],
      this.updateUserStatus
    );
    this.router.get(
      '/',
      [
        AuthGuardDM,
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
        query('isGetBetaUser')
          .isBoolean()
          .optional()
          .withMessage(
            'isGetBetaUser' +
              Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE
          ),
        query('isGetKeySeller')
          .isBoolean()
          .optional()
          .withMessage(
            'isGetKeySeller' +
              Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE
          ),
        query('isGetInactiveUser')
          .isBoolean()
          .optional()
          .withMessage(
            'isGetInactiveUser' +
              Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE
          ),
        query('queryString')
          .isString()
          .optional()
          .withMessage(
            'queryString' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getUsers
    );
    this.router.post('/decrypt-phone-number', this.decryptPhoneNumber);
    this.router.get('/rates', this.calculateRatesForUsers);
    this.router.post(
      '/signup-wait-list',
      body('mobileNumber')
        .trim()
        .isString()
        .isNumeric()
        .isMobilePhone('ar-AE')
        .notEmpty()
        .withMessage(Constants.VALIDATE_REQUEST_MSG.EMPTY_USER_STATUS),
      this.addNumberToSignupWaitList
    );
    this.router.get(
      '/:userId/merchant',
      [
        param('userId')
          .trim()
          .isString()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getMerchantProfile
    );
    this.router.get('/gtm-signup-details', [AuthGuard], this.gtmSignUpDetails);
    this.router.get(
      '/:userId',
      [
        AuthGuardDM,
        param('userId')
          .trim()
          .isString()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.getUserData
    );
  }
  getMyReservations = async (req: Request, res: Response) => {
    const page = _get(req, 'query.page', 1);
    const size = _get(req, 'query.size', 10);
    const orderId = _get(req, 'query.orderId', '');
    const userId = (req.user as any)?.id || null;
    const [error, result] = await this.orderService.getUserReservations(
      userId,
      page,
      size,
      orderId
    );
    if (error) {
      return res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_RESERVATION,
          result?.message,
          result?.result
        )
      );
    }

    return res.sendOk(
      result.result,
      result?.message || Constants.MESSAGE.GET_MY_RESERVATIONS_SUCCESSFULLY
    );
  };

  sendUsersReport = async (req: Request, res: Response) => {
    try {
      const toList = _get(req, 'query.sendTo', '').split(',');
      const sendGridKey = _get(req, 'query.sendGridKey', '');
      const fromEmail = _get(req, 'query.from', '');
      const months = Number(_get(req, 'query.months', '1'));
      const [userError, userResult] =
        await this.reportingService.sendUsersReport(
          toList,
          sendGridKey,
          fromEmail,
          months
        );

      if (userError) {
        res.sendError(
          new ErrorResponseDto(
            userResult.result?.data?.code || Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SEND_USER_EMAIL,
            userResult?.message,
            userResult?.result
          )
        );
      } else {
        res.sendOk(userResult.result, userResult.message);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SEND_USER_EMAIL,
            exception.message
          )
        );
      }
    }
  };

  getUserOrders = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER_ORDERS,
            JSON.stringify(errors.array())
          )
        );
      }

      const userId = (req.user as any)?.id || null;
      const ordersType = (req.query.type as string) || 'buyer';
      const page = +req.query.page || 1;
      const size = Math.min(+req.query.size || 5, 5);
      const result = await this.orderService.getAllOrdersForUser(
        userId,
        ordersType,
        page,
        size
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
            Constants.ERROR_MAP.FAILED_TO_GET_USER_ORDERS,
            exception.message
          )
        );
      }
    }
  };

  basicUserValidationRules = [
    body('email_address')
      .trim()
      .isString()
      .withMessage(
        'email_address' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
      ),
    body('password')
      .trim()
      .isString()
      .withMessage(
        'password' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
      ),
    body('first_name')
      .trim()
      .isString()
      .withMessage(
        'first_name' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
      ),
    body('last_name')
      .trim()
      .isString()
      .withMessage(
        'last_name' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
      ),
  ];
  validateToUpdateUserInput() {
    return [
      AuthGuard,
      param('id')
        .trim()
        .isString()
        .withMessage(
          'id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      ...this.basicUserValidationRules,
    ];
  }
  validateToUpdateCustomerInput() {
    return [
      AuthGuard,
      param('userId')
        .trim()
        .isString()
        .withMessage(
          'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('name').optional().isString(),
      body('isMerchant').optional().isBoolean(),
      body('isBetaUser').optional().isBoolean(),
      body('isKeySeller').optional().isBoolean(),
      body('isUAE').optional().isBoolean(),
      body('rating').optional().isNumeric(),
      ...this.basicUserValidationRules,
    ];
  }
  validateSignUpInput() {
    return [
      body('username')
        .trim()
        .isString()
        .withMessage(
          'username' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      ...this.basicUserValidationRules,
    ];
  }

  signUp = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SIGN_UP,
            JSON.stringify(errors.array())
          )
        );
      }
      const username = req.body.username.toLowerCase() || null;
      const email_address = req.body.email_address.toLowerCase() || null;
      const password = req.body.password || null;
      const first_name = req.body.first_name || null;
      const last_name = req.body.last_name || null;
      const [err, result] = await this.userService.signUp(
        username,
        email_address,
        password,
        first_name,
        last_name
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
            Constants.ERROR_MAP.FAILED_TO_SIGN_UP,
            exception.message
          )
        );
      }
    }
  };

  updateUser = async (req: Request, res: Response | any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_USER,
            JSON.stringify(errors.array())
          )
        );
      }
      const id = req.params.id || null;
      const email_address = req.body.email_address.toLowerCase() || null;
      const password = req.body.password || null;
      const first_name = req.body.first_name || null;
      const last_name = req.body.last_name || null;
      const [err, result] = await this.userService.updateUser(
        id,
        email_address,
        password,
        first_name,
        last_name
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_USER,
            exception.message
          )
        );
      }
    }
  };
  updateCustomer = async (req: Request, res: Response | any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_USER,
            Constants.MESSAGE.FAILED_TO_UPDATE_USER
          )
        );
      }
      let userId = (req.user as any).id || null;
      if (req.headers['client-id'] === 'admin-web') {
        userId = req.params.userId || null;
      }

      const isMerchant: boolean = req?.body?.isMerchant;
      const isCompliant: boolean = req?.body?.isCompliant;
      const isBetaUser: boolean = req?.body?.isBetaUser;
      const isKeySeller: boolean = req?.body?.isKeySeller;
      const isUAE: boolean = req?.body?.isUAE;
      const rating: number = req?.body?.rating || null;
      const name: string = req?.body?.name || null;

      const updateUserInput: UpdateUserInput = {
        name: name,
        isMerchant: isMerchant,
        isBetaUser: isBetaUser,
        isKeySeller: isKeySeller,
        isCompliant: isCompliant,
        isUAE: isUAE,
        rating: rating,
      };

      const [err, result] = await this.userService.updateCustomer(
        userId,
        updateUserInput
      );
      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_USER,
            Constants.MESSAGE.FAILED_TO_UPDATE_USER
          )
        );
      }
      return res.sendOk(result, Constants.MESSAGE.USER_SUCCESSFULLY_UPDATED);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      }
      return res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_USER,
          Constants.MESSAGE.FAILED_TO_UPDATE_USER
        )
      );
    }
  };

  basicAddressValidationRules = [
    param('userId')
      .trim()
      .isString()
      .withMessage(
        'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
      ),
    body('street')
      .trim()
      .isString()
      .withMessage(
        'address' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
      ),
    body('district')
      .trim()
      .isString()
      .withMessage(
        'district' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
      ),
    body('city')
      .trim()
      .isString()
      .withMessage(
        'city' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
      ),
    body('postal_code')
      .trim()
      .isString()
      .withMessage(
        'postal_code' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
      ),
    body('longitude')
      .trim()
      .isString()
      .optional()
      .withMessage(
        'longitude' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
      ),
    body('latitude')
      .trim()
      .isString()
      .optional()
      .withMessage(
        'latitude' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
      ),
    body('is_default').trim().toBoolean().optional(),
  ];
  validateToAddAddressInput() {
    return [...this.basicAddressValidationRules, AuthGuard];
  }

  validateToUpdateUserAddressInput() {
    return [
      ...this.basicAddressValidationRules,
      param('addressId')
        .trim()
        .isString()
        .withMessage(
          'addressId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('is_verified').trim().toBoolean().optional(),
      AuthGuard,
    ];
  }

  addAddress = async (req: Request, res: Response) => {
    try {
      const addAddressErrors = validationResult(req);
      if (!addAddressErrors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADD_ADDRESS_FAILURE,
            JSON.stringify(addAddressErrors.array())
          )
        );
      }
      const userId = (req.user as any).id || null;
      if (!Types.ObjectId.isValid(userId)) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADD_ADDRESS_FAILURE,
            'Invalid User Id'
          )
        );
        return;
      }
      const address: LegacyUserAddressInput = {
        street: req.body.street,
        district: req.body.district,
        city: req.body.city,
        postal_code: req.body.postal_code || '',
        longitude: req.body.longitude || '',
        latitude: req.body.latitude || '',
        is_default: req.body.is_default || false,
        is_verified: true,
        nationalAddress: req.body.nationalAddress || '',
      };
      const [error, user] = await this.userService.addUserAddress(
        userId,
        address
      );
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADD_ADDRESS_FAILURE,
            user.message
          )
        );
      }
      res.sendCreated(user.result, 'User address is added successfully');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADD_ADDRESS_FAILURE,
            exception.message
          )
        );
      }
    }
  };

  getAddresses = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADDRESS_FAILURE,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = (req.user as any).id || null;
      if (!Types.ObjectId.isValid(userId)) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADDRESS_FAILURE,
            'Invalid User Id'
          )
        );
        return;
      }
      const [errAddress, data] = await this.userService.getListUserAddress(
        userId
      );
      if (errAddress) {
        res.sendError(
          new ErrorResponseDto(
            data.code,
            Constants.ERROR_TYPE.API,
            data.result.toString(),
            data.message
          )
        );
      }
      res.sendOk(data.result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADDRESS_FAILURE,
            exception.message
          )
        );
      }
    }
  };

  resetPasswordSMS = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADDRESS_FAILURE,
            JSON.stringify(errors.array())
          )
        );
      }
      const phone_number = req.body.phone_number;
      const [err, result] = await this.userService.resetPasswordSMS(
        phone_number
      );
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            'Fail to send reset password via SMS'
          )
        );
      } else {
        res.sendOk(result);
      }
    } catch (exception) {
      res.sendError(exception);
    }
  };

  verifyResetPasswordToken = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADDRESS_FAILURE,
            JSON.stringify(errors.array())
          )
        );
      }
      const token = req.body.token;
      const updatePassword = req.body.password;
      const [err, result] = await this.userService.verifyResetPasswordToken(
        token,
        updatePassword
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
      res.sendError(exception);
    }
  };

  updateUserAddresses = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADDRESS_FAILURE,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = (req.user as any).id || null;
      const addressId = req.params.addressId;
      if (!Types.ObjectId.isValid(userId)) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADDRESS_FAILURE,
            'Invalid User Id'
          )
        );
        return;
      }
      if (!Types.ObjectId.isValid(addressId)) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADDRESS_FAILURE,
            'Invalid Address Id'
          )
        );
        return;
      }
      const updatedAddress: LegacyUserAddressInput = {
        street: req.body.street,
        district: req.body.district,
        city: req.body.city,
        postal_code: req.body.postal_code || '',
        longitude: req.body.longitude || '',
        latitude: req.body.latitude || '',
        is_default: req.body.is_default || false,
        is_verified: req.body.is_default || true,
        nationalAddress: req.body.nationalAddress || '',
      };
      const [error, user] = await this.userService.updateUserAddress(
        userId,
        addressId,
        updatedAddress
      );
      if (!error) {
        res.sendOk(user, 'User address is update successfully');
      } else {
        res.sendError('Error');
      }
    } catch (exception) {
      res.sendError(exception);
    }
  };
  validateToRemoveUserAddressInput() {
    return [
      param('userId')
        .trim()
        .isString()
        .withMessage(
          'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      param('addressId')
        .trim()
        .isString()
        .withMessage(
          'addressId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      AuthGuard,
    ];
  }
  deleteUserAddresses = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_USER_ADDRESS,
            JSON.stringify(errors.array())
          )
        );
      }

      const userId = (req.user as any).id || null;
      if (!Types.ObjectId.isValid(userId)) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADDRESS_FAILURE,
            'Invalid User Id'
          )
        );
        return;
      }
      const addressId = req.params.addressId;
      if (!Types.ObjectId.isValid(addressId)) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.ADDRESS_FAILURE,
            'Invalid Address Id'
          )
        );
        return;
      }
      const [error, user] = await this.userService.removeUserAddress(
        userId,
        addressId
      );
      if (!error) {
        res.sendOk(user);
      } else {
        res.sendError('Error');
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_USER_ADDRESS,
            exception.message
          )
        );
      }
    }
  };
  addProductToWishList = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_PRODUCT_TO_WISHLIST,
            JSON.stringify(errors.array())
          )
        );
      }
      const product_id = req.body.product_id || null;
      const user_id = (req.user as any).id || null;
      const [error, result] = await this.userService.addProductToWishList(
        user_id,
        product_id
      );
      if (error) {
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
            Constants.ERROR_MAP.FAILED_TO_ADD_PRODUCT_TO_WISHLIST,
            exception.message
          )
        );
      }
    }
  };

  gtmSignUpDetails = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_PRODUCT_TO_WISHLIST,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = (req.user as any).id || null;
      const [error, result] = await this.userService.gtmSignUpDetails(userId);
      if (error) {
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
            Constants.ERROR_MAP.USER_NOT_FOUND,
            exception.message
          )
        );
      }
    }
  };
  getMySellProducts = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
            JSON.stringify(errors.array())
          )
        );
      }
      const user_id = (req.user as any).id || null;
      const size = !req.query.size ? 10 : +req.query.size;
      const page = !req.query.page ? 1 : +req.query.page;
      const sort = req?.query?.sort?.toString() || 'latest';
      const [error, result] = await this.productService.getMySellProducts(
        user_id,
        size,
        page,
        sort
      );

      if (error) {
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
            Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
            exception.message
          )
        );
      }
    }
  };
  getMyExpiredProducts = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
            JSON.stringify(errors.array())
          )
        );
      }
      const user_id = (req.user as any).id || null;
      const size = !req.query.size ? 10 : +req.query.size;
      const page = !req.query.page ? 1 : +req.query.page;
      const [error, result] = await this.productService.getMyExpiredProducts(
        user_id,
        size,
        page
      );
      if (error) {
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
            Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
            exception.message
          )
        );
      }
    }
  };
  getBidsMyProducts = async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
            JSON.stringify(errors.array())
          )
        );
      }
      const user_id = (req.user as any).id || null;
      const size = Number(_get(req, 'query.size', 10));
      const page = Number(_get(req, 'query.page', 1));
      const lang = _get(req, 'headers.language', 'en');
      const [error, result] = await this.productService.getBidsMyProducts(
        user_id,
        size,
        page,
        lang.toString()
      );
      if (error) {
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
            Constants.ERROR_MAP.FAILED_TO_GET_BID_PRODUCT_PAGINATION,
            exception.message
          )
        );
      }
    }
  };
  getUserDeviceTokens = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.DEVICE_TOKEN_FAILURE,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = req.params.userId;
      if (!Types.ObjectId.isValid(userId)) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.DEVICE_TOKEN_FAILURE,
            Constants.MESSAGE.USER_IS_NOT_FOUND
          )
        );
        return;
      }

      const [error, userTokens] =
        await this.notificationService.getUserDeviceTokens(userId);
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

  addDeviceToken = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.DEVICE_TOKEN_FAILURE,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = req.params.userId;
      if (!Types.ObjectId.isValid(userId)) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.DEVICE_TOKEN_FAILURE,
            Constants.MESSAGE.USER_IS_NOT_FOUND
          )
        );
        return;
      }

      const deviceToken: DeviceTokenInput = {
        user_id: req.params.userId,
        fcm_token: req.body.fcm_token,
        device_id: req.body.device_id,
        lang: req.body.lang,
        platform: req.body.platform,
        app_version: req.body.app_version,
      };

      const [error, userToken] = await this.notificationService.addDeviceToken(
        deviceToken
      );
      if (!error) {
        res.sendCreated(userToken, Constants.MESSAGE.DEVICE_TOKEN_ADD_SUCCESS);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.DEVICE_TOKEN_FAILURE,
            userToken as string
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

  updateUserDeviceToken = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.DEVICE_TOKEN_FAILURE,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = req.params.userId;
      const fcmToken = req.params.fcmToken;
      if (!Types.ObjectId.isValid(userId)) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.DEVICE_TOKEN_FAILURE,
            'Invalid User Id'
          )
        );
        return;
      }

      const updateToken: DeviceTokenInput = {
        user_id: userId,
        fcm_token: fcmToken,
        device_id: req.body.device_id,
        lang: req.body.lang,
        status: req.body.status,
        platform: req.body.platform,
        app_version: req.body.app_version,
      };
      const [error, user] = await this.notificationService.updateDeviceToken(
        updateToken
      );
      if (!error) {
        res.sendOk(user, Constants.MESSAGE.DEVICE_TOKEN_UPDATED_SUCCESS);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            user.toString()
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

  deleteUserDeviceTokens = async (req: Request, res: Response) => {
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
      if (!isAdminAccess(req)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.DEVICE_TOKEN_FAILURE,
            Constants.MESSAGE.ALLOW_ONLY_ADMIN_ACCESS
          )
        );
      }

      const userId = req.params.userId;
      const [error, result] =
        await this.notificationService.removeUserDeviceToken(userId);
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
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

  deleteUser = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_USER_ACCOUNT,
            JSON.stringify(errors.array())
          )
        );
      }

      const user_id = (req.user as any).id || null;
      if (!Types.ObjectId.isValid(user_id)) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_USER_ACCOUNT,
            'Invalid User Id'
          )
        );
        return;
      }

      const [errUserDel, user] = await this.userService.deleteUser(user_id);
      if (errUserDel) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            user.toString()
          )
        );
      }

      res.sendOk(user, Constants.MESSAGE.DELETE_USER_SUCCESSFUL);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_USER_ADDRESS,
            exception.message
          )
        );
      }
    }
  };
  getUserPreferences = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id || null;
      const cacheKey = createKey(Constants.CACHE_KEYS.USER_PRE, [userId]);
      let cacheData =
        req.query?.disableCache === 'true'
          ? undefined
          : await getCache(cacheKey);
      if (_isEmpty(cacheData)) {
        const [error, userResult] = await this.userService.getUserInfo(
          userId,
          '_id preferences mobileNumber isKeySeller rates isMerchant sellerType isSFPaid hasOptedForSF listings'
        );
        const [countErr, numberOfListing] =
          await this.productService.countNumberOfActiveProducts(userId);

        if (error || countErr) {
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_GET_USER,
              'Get user Preferences unsuccessful'
            )
          );
        }
        userResult.preferences.isSFPaid = userResult.isSFPaid || false;
        if (
          userResult?.isKeySeller === false &&
          userResult?.isMerchant === false
        ) {
          userResult.activeListingsCount = numberOfListing?.result?.result || 0;
          if (
            userResult.listings?.sold_listings >= 0 &&
            userResult.listings?.sold_listings < 3 &&
            userResult?.rates?.cancellation_rate > 50
          ) {
            userResult.preferences.isFullfiller = false;
          } else if (
            userResult.listings?.sold_listings > 2 &&
            userResult?.rates?.cancellation_rate > 66
          ) {
            userResult.preferences.isFullfiller = false;
          }
        }

        userResult.activeListingsCount = numberOfListing?.result?.result || 0;
        userResult.pendingQuestion =
          await this.askSellerService.countPendingQuestionByUserID(userId);
        cacheData = userResult;
        await setCache(cacheKey, cacheData);
      }

      res.sendOk(cacheData, 'Get user preferences successful');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER,
            exception.message
          )
        );
      }
    }
  };

  updateUserPreferences = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_PREFERENCES,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = (req.user as any).id || null;
      const skipPreListing: boolean = req.body.skip_pre_listing;
      const skipPostListing: boolean = req.body.skip_post_listing;
      const is_wallet_first_visit: boolean = req.body.is_wallet_first_visit;
      const is_new_badge_alert: boolean = req.body.is_new_badge_alert;
      const is_cancellation_alert: boolean = req.body.is_cancellation_alert;
      const is_express_delivery_onboarded: boolean =
        req.body.is_express_delivery_onboarded;
      const is_penalized_alert: boolean = req.body.is_penalized_alert;
      const is_filter_onboarded: boolean = req.body.is_filter_onboarded;
      const [error, userResult] = await this.userService.updateUserPreferences(
        userId,
        {
          skip_post_listing: skipPostListing,
          skip_pre_listing: skipPreListing,
          is_wallet_first_visit: is_wallet_first_visit,
          is_new_badge_alert: is_new_badge_alert,
          is_cancellation_alert: is_cancellation_alert,
          is_penalized_alert: is_penalized_alert,
          is_express_delivery_onboarded: is_express_delivery_onboarded,
          is_filter_onboarded: is_filter_onboarded,
        }
      );

      if (error) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER,
            'Update user Preferences unsuccessful'
          )
        );
      }

      const response = (({ _id, addresses, preferences }) => ({
        _id,
        addresses,
        preferences,
      }))(userResult as UserLegacyDocument);

      await deleteCache([createKey(Constants.CACHE_KEYS.USER_PRE, [userId])]);
      res.sendOk(response, 'Update user preferences successful');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER,
            exception.message
          )
        );
      }
    }
  };

  getUsers = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER,
            JSON.stringify(errors.array())
          )
        );
      }

      const page = parseInt(req.query?.page?.toString()) || 1;
      const size = parseInt(req.query?.size?.toString()) || 20;
      const isGetBetaUser =
        req.query?.isGetBetaUser?.toString() === 'true' ? true : false;
      const isGetKeySeller =
        req.query?.isGetKeySeller?.toString() === 'true' ? true : false;
      const isGetInactiveUser =
        req.query?.isGetInactiveUser?.toString() === 'true' ? true : false;
      const queryString = req.query?.mobileNumber?.toString() || '';
      const isMerchant = req.query?.isMerchant?.toString() || '';
      const [error, userResult] = await this.userService.getUsers(
        page,
        size,
        isGetBetaUser,
        isGetKeySeller,
        isGetInactiveUser,
        isMerchant,
        queryString
      );
      if (error) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER,
            'No users matched'
          )
        );
      }

      res.sendOk(userResult, 'Get users successfully');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER,
            exception.message
          )
        );
      }
    }
  };

  updateUserStatus = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_PREFERENCES,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = req.params?.userId;
      const status: string = req?.body?.status;
      const isBlockUser: boolean = req?.body?.isBlockUser || false;
      const [error, userResult] = await this.userService.updateUserStatus(
        userId,
        status,
        isBlockUser
      );

      if (error) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER,
            'Update user status unsuccessful'
          )
        );
      }

      res.sendOk(userResult, 'Update user status successful');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER,
            exception.message
          )
        );
      }
    }
  };

  decryptPhoneNumber = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_PREFERENCES,
            JSON.stringify(errors.array())
          )
        );
      }
      const encryptedValue: string = req?.body?.smsData?.toNumber;
      const messageId: string = req?.body?.metadata?.messageId || '';
      const [error, decryptedValue] = await this.userService.decryptPhoneNumber(
        encryptedValue
      );

      if (error) {
        await smsDSNWebHook({
          version: '1.0',
          toNumber: encryptedValue,
          status: 'sms_failed',
          statusCode: 2003,
          message: 'Invalid mobile number',
        });

        return res.status(400).json({
          status: 'sms_rejected',
          statusCode: 9988,
          message: 'Invalid mobile number',
        });
      }
      const unifonicResult = await sendSMSViaUnifonic(
        `966${decryptedValue.result}`,
        req?.body?.smsData?.body
      );

      if (unifonicResult) {
        await smsDSNWebHook({
          version: '1.0',
          messageId: messageId,
          toNumber: `966${decryptedValue.result}`,
          status: 'sms_sent',
          statusCode: 0,
        });

        return res.status(200).json({
          status: 'sms_accepted',
        });
      } else {
        await smsDSNWebHook({
          version: '1.0',
          toNumber: encryptedValue,
          status: 'sms_failed',
          statusCode: 9988,
          message: 'Invalid mobile number',
        });

        return res.status(200).json({
          status: 'sms_rejected',
          statusCode: 9988,
          message: 'Invalid mobile number',
        });
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER,
            exception.message
          )
        );
      }
    }
  };
  calculateRatesForUsers = async (req: Request, res: Response) => {
    try {
      const [, resp] = await this.userService.calculateRatesForUsers();
      if (resp.result.length > 0) {
        const products: string[] = [];
        resp.result.map((listing: { _id: string }) => {
          products.push(listing._id);
        });
        await this.searchService.addProducts(products);
      }

      res.sendOk(resp, Constants.MESSAGE.CALCULATE_RATES_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CALCULATE_RATES,
            exception.message
          )
        );
      }
    }
  };

  addNumberToSignupWaitList = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_NUMBER_TO_WAITLIST,
            JSON.stringify(errors.array())
          )
        );
      }
      const regionConf = await this.settingService.getRegionConfigs();
      if (regionConf.region === Region.AE) {
        const _mobileNumber: string = req?.body?.mobileNumber;
        const mobileNumber = _mobileNumber.startsWith('0')
          ? _mobileNumber.slice(1)
          : _mobileNumber;
        const [error, result] =
          await this.userService.addNumberToSignupWaitList(mobileNumber);
        if (!error) {
          return res.sendOk(
            result,
            Constants.MESSAGE.SUCCESSFULLY_ADDED_NUMBER_TO_WAITLIST
          );
        }
      }
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_NUMBER_TO_WAITLIST,
          Constants.MESSAGE.FAILED_TO_ADD_NUMBER_TO_WAITLIST
        )
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_NUMBER_TO_WAITLIST,
            exception.message
          )
        );
      }
    }
  };

  getMerchantProfile = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MERCHANT_PROFILE,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = req.params.userId || '';

      if (!Types.ObjectId.isValid(userId)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MERCHANT_PROFILE,
            Constants.MESSAGE.INVALID_ID_FORMAT
          )
        );
      }
      const [errProfile, profile] = await this.userService.getUserInfo(
        userId,
        'listings name createdDate profilePic isMerchant'
      );

      if (errProfile) {
        return res.sendError(
          new ErrorResponseDto(
            profile.code,
            Constants.ERROR_TYPE.API,
            profile.result.toString(),
            profile.message
          )
        );
      }

      if (!profile?.isMerchant) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MERCHANT_PROFILE,
            Constants.MESSAGE.USER_IS_NOT_MERCHANT
          )
        );
      }
      delete profile.preferences;
      delete profile.addresses;

      return res.sendOk(profile, Constants.MESSAGE.GET_MERCHANT_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MERCHANT_PROFILE,
            exception.message
          )
        );
      }
    }
  };

  syncOrders = async (req: Request, res: Response) => {
    const userId = req.params.userId || '';
    const limit = Number(req.query.limit) || 10;

    if (!Types.ObjectId.isValid(userId)) {
      return res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MERCHANT_PROFILE,
          Constants.MESSAGE.INVALID_ID_FORMAT
        )
      );
    }
    const isActiveMerchant = await this.userService.isActiveMerchant(userId);
    if (!isActiveMerchant) {
      return res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.FORBIDDEN,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.USER_NOT_FOUND,
          Constants.MESSAGE.USER_IS_NOT_MERCHANT
        )
      );
    }

    const [syncError, ordersResult] =
      await this.userService.syncOrdersToTypesense(userId, limit);
    if (syncError) {
      return res.sendError(
        new ErrorResponseDto(
          ordersResult.code,
          Constants.ERROR_TYPE.API,
          ordersResult.result.toString(),
          ordersResult.message
        )
      );
    }

    return res.sendOk(
      ordersResult.result,
      ordersResult.message || Constants.MESSAGE.SYNC_ORDER_SUCCESS
    );
  };

  getUserData = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER,
            JSON.stringify(errors.array())
          )
        );
      }
      const result = await this.userService.getUserData(req.params.userId);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER,
            exception.message
          )
        );
      }
    }
  };

  getMyOrderAndOffersCount = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ORDER_AND_OFFER_COUNT,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = (req.user as any)?.id || null;

      const result = await this.userService.getUserOrderAndOffersCount(userId);
      return res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ORDER_AND_OFFER_COUNT,
            exception.message
          )
        );
      }
    }
  };

  getUsersForInspector = async (req: Request, res: Response) => {
    try {
      const searchKey = (req.query.search as string) || '';
      const result = await this.userService.getUsersForInspector(searchKey);
      return res.sendOk(result);
    } catch (err) {
      console.log(err);
      throw 'users not found';
    }
  };
}
