import { Request, Response, Router } from 'express';
import _isEmpty from 'lodash/isEmpty';
import { Container } from 'typedi';
import { check, body, query, validationResult } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import {
  CheckoutRequest,
  getPaymentStatus,
  prepareCheckout,
} from '../../libs/hyperpay';
import { UserService } from '../../services/userService';
import { _get } from '../../util/common';
import IController from './IController';

export class CheckoutController implements IController {
  path = 'checkout/';
  router: Router;
  userService: UserService;

  constructor(router: Router) {
    this.router = router;
    this.userService = Container.get(UserService);
  }
  initializeRoutes() {
    this.router.post(
      '/prepare',
      this.validatePrepareCheckoutInput(),
      this.prepareCheckout
    );
    this.router.get(
      '/get-payment-status',
      [
        query('cardType')
          .trim()
          .notEmpty()
          .optional()
          .withMessage(
            'cardType' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        query('resourcePath')
          .trim()
          .notEmpty()
          .optional()
          .withMessage(
            'resourcePath' +
              Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getPaymentStatus
    );
  }

  validatePrepareCheckoutInput() {
    return [
      body('user_id')
        .notEmpty()
        .withMessage(
          'user_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('card_type')
        .notEmpty()
        .withMessage(
          'card_type' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('payment_type')
        .notEmpty()
        .withMessage(
          'payment_type' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('amount')
        .isNumeric()
        .withMessage(Constants.VALIDATE_REQUEST_MSG.AMOUNT),
      body('currency')
        .notEmpty()
        .withMessage(
          'currency' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('test_mode')
        .notEmpty()
        .withMessage(
          'test_mode' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      check('address_info.address')
        .trim()
        .notEmpty()
        .withMessage(
          'address_info.address' +
            Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      check('address_info.city')
        .trim()
        .notEmpty()
        .withMessage(
          'address_info.city' +
            Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      check('address_info.state')
        .trim()
        .notEmpty()
        .withMessage(
          'address_info.state' +
            Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      check('address_info.country')
        .trim()
        .notEmpty()
        .withMessage(
          'address_info.country' +
            Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      check('address_info.postal_code')
        .trim()
        .notEmpty()
        .withMessage(
          'address_info.postal_code' +
            Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      check('address_info.given_name')
        .trim()
        .notEmpty()
        .withMessage(
          'address_info.given_name' +
            Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      check('address_info.sur_name')
        .trim()
        .notEmpty()
        .withMessage(
          'address_info.sur_name' +
            Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
    ];
  }

  prepareCheckout = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_PREPARE_CHECKOUT_PAGE,
          JSON.stringify(errors.array())
        )
      );
    }
    const userId = req.body.user_id;
    const [, userInfo] = await this.userService.getUserInfo(
      userId,
      'cards countryCode mobileNumber'
    );
    const data: CheckoutRequest = {
      cardType: req.body.card_type,
      paymentType: req.body.payment_type || 'DB',
      amount: req.body.amount,
      currency: req.body.currency,
      testMode: req.body.test_mode,
      userAddress: {
        address: req.body.address_info.address,
        city: req.body.address_info.city,
        state: req.body.address_info.state,
        country: req.body.address_info.country,
        postalCode: req.body.address_info.postal_code,
        givenName: req.body.address_info.given_name,
        surName: req.body.address_info.sur_name,
      },
      countryCode: userInfo.countryCode,
      phoneNumber: userInfo.mobileNumber,
    };
    if (data.cardType === Constants.cardType.VisaMaster) {
      data.cardIds = userInfo.cards;
    }
    prepareCheckout(data)
      .then((result: any) => {
        const checkoutId = result.id;
        const shopperResultUrl = 'https://soum-sa.com';
        res.send(
          `<script src="https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}"></script>` +
            `<form action="${shopperResultUrl}" class="paymentWidgets" data-brands="VISA MASTER AMEX"></form>`
        );
      })
      .catch(exception => {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_PREPARE_CHECKOUT_PAGE,
            exception.message
          )
        );
      });
  };

  getPaymentStatus = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_CHECKOUT_PAYMENT_STATUS,
          JSON.stringify(errors.array())
        )
      );
    }
    const cardType: string = _get(req.query, 'cardType', '').toString();
    const resourcePath: string = decodeURIComponent(
      _get(req.query, 'resourcePath', '').toString()
    );
    if (_isEmpty(cardType)) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          'Invalid or missing parameter: cardType'
        )
      );
    }
    if (_isEmpty(resourcePath)) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          'Invalid or missing parameter: resourcePath'
        )
      );
    }
    getPaymentStatus(resourcePath, cardType)
      .then((result: any) => {
        res.sendOk(result);
      })
      .catch(exception => {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_CHECKOUT_PAYMENT_STATUS,
            exception.message
          )
        );
      });
  };
}
