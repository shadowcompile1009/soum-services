import { Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator';
import Container from 'typedi';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { UpdatePaymentDto } from '../../dto/payment/UpdatePaymentDto';
import { UpdatePaymentFeesDto } from '../../dto/payment/updatePaymentFeesDto';
import { TransactionStatus } from '../../enums/TransactionStatus';
import { AuthGuard } from '../../middleware/authGuard';
import { PaymentProvider, PaymentProviderType } from '../../models/Payment';
import { PaymentService } from '../../services/paymentService';
import { ProductService } from '../../services/productService';
import { _get } from '../../util/common';
import IController from './IController';
export class PaymentController implements IController {
  path = 'payment/';
  router: Router;
  productService: ProductService;
  paymentService: PaymentService;
  constructor(router: Router) {
    this.router = router;
    this.productService = Container.get(ProductService);
    this.paymentService = Container.get(PaymentService);
  }
  initializeRoutes() {
    this.router.post('/checkout/listing-fees', AuthGuard, this.payListingFees);

    this.router.put(
      '/acknowledgement/listing-fees',
      AuthGuard,
      this.acknowledgePaymentCompleteness
    );

    this.router.put(
      '/order/acknowledgement',
      AuthGuard,
      [
        check('paymentProvider')
          .isIn([
            PaymentProvider.Tabby,
            PaymentProvider.TAMARA,
            PaymentProvider.HyperPay,
            PaymentProvider.TAMAM,
            PaymentProvider.MOYASAR,
            PaymentProvider.MADFU,
            PaymentProvider.EMKAN,
          ])
          .optional()
          .withMessage('Invalid or missing param paymentProvider'),
      ],
      this.orderPaymentCompleted
    );

    this.router.post(
      '/order/tabby/prescore',
      AuthGuard,
      this.validateBNPLForUser
    );

    this.router.post('/prescore', AuthGuard, this.validateBNPLForUser);
  }
  validateBNPLForUser = async (req: Request, res: Response) => {
    try {
      return res.sendOk(
        {
          status: TransactionStatus.COMPLETED,
        },
        'Payment is allowed'
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_BUY_PRODUCT,
            exception.message
          )
        );
      }
    }
  };
  orderPaymentCompleted = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS,
            JSON.stringify(errors.array())
          )
        );
      }
      const updatePaymentFeesDto = req.body as UpdatePaymentDto;
      const clientId: string = _get(req.headers, 'client-id', '');
      const result = await this.paymentService.updatePaymentStatus(
        updatePaymentFeesDto,
        clientId
      );
      res.sendOk(result, 'Order was completed successfully');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            exception.message
          )
        );
      }
    }
  };
  payListingFees = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS,
            JSON.stringify(errors.array())
          )
        );
      }
      const paymentType = req.body.paymentType as PaymentProviderType;
      const result = await this.paymentService.payListingFees(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        req.userInfo as any,
        paymentType
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
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            exception.message
          )
        );
      }
    }
  };
  acknowledgePaymentCompleteness = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id ?? null;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS,
            JSON.stringify(errors.array())
          )
        );
      }
      const updatePaymentFeesDto = req.body as UpdatePaymentFeesDto;
      const result = await this.paymentService.updatePaymentFeesStatus(
        updatePaymentFeesDto,
        userId,
        req.query.isOptIn as string
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
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            exception.message
          )
        );
      }
    }
  };
}
