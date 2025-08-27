import { Request, Response, Router } from 'express';
import { body, check, param, query, validationResult } from 'express-validator';
import Mustache from 'mustache';
import { Container } from 'typedi';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { PurchaseProductDto } from '../../dto/product/PurchaseProductDto';
import { InvoiceFormats } from '../../enums/InvoiceFormats';
import { generatePDF } from '../../libs/generatePDF';
import { getSecretData } from '../../libs/vault';
import { AuthGuard } from '../../middleware/authGuard';
import { AuthGuardDM } from '../../middleware/authGuardDM';
import { InvoiceTypeInput } from '../../models/Invoice';
import { UpdatePayoutOrderInput } from '../../models/Order';
import { PaymentProvider, PaymentProviderType } from '../../models/Payment';
import { DeltaMachineService } from '../../services/deltaMachineService';
import { DmStatusGroupService } from '../../services/dmStatusGroupsService';
import { OrderService } from '../../services/orderService';
import { ReportingService } from '../../services/reportingService';
import { SettingService } from '../../services/settingService';
import { _get, getHtmlContentAndConfig } from '../../util/common';
import IController from './IController';

export class OrderController implements IController {
  path = 'order/';
  router: Router;
  orderService: OrderService;
  reportingService: ReportingService;
  dmStatusGroupService: DmStatusGroupService;
  settingService?: SettingService;
  deltaMachineService?: DeltaMachineService;

  constructor(router: Router) {
    this.router = router;
    this.orderService = Container.get(OrderService);
    this.reportingService = Container.get(ReportingService);
    this.dmStatusGroupService = Container.get(DmStatusGroupService);
    this.settingService = Container.get(SettingService);
    this.deltaMachineService = Container.get(DeltaMachineService);
  }

  initializeRoutes() {
    this.router.get('/migrate-commission', this.migrateCommission);
    this.router.post(
      '',
      [
        AuthGuard,
        check('paymentId')
          .not()
          .isEmpty()
          .withMessage('Invalid or missing param paymentId'),
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
          .not()
          .isEmpty()
          .withMessage('Invalid or missing param paymentProvider'),
        check('paymentType')
          .isIn([
            PaymentProviderType.ApplePay,
            PaymentProviderType.Mada,
            PaymentProviderType.VisaMaster,
            PaymentProviderType.StcPay,
            PaymentProviderType.TAMARA,
            PaymentProviderType.Tabby,
            PaymentProviderType.TAMAM,
            PaymentProviderType.URPAY,
            PaymentProviderType.Visa,
            PaymentProviderType.MADFU,
            PaymentProviderType.EMKAN,
          ])
          .optional()
          .withMessage('Invalid or missing param paymentProviderType'),
        check('nationalId')
          .isNumeric()
          .optional()
          .withMessage('Invalid or missing param nationalId'),
      ],
      this.createOrder
    );
    this.router.get(
      '/',
      [
        AuthGuardDM,
        query('searchValue').trim().optional(),
        query('dispute').trim().optional(),
        query('limit')
          .isNumeric()
          .optional()
          .withMessage(
            'limit' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('limit').default(20),
        query('page')
          .isNumeric()
          .optional()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('page').default(1),
      ],
      this.getAllOrders
    );
    this.router.get(
      '/bought-history',
      [
        AuthGuard,
        query('size')
          .isNumeric()
          .optional()
          .withMessage(
            'size' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('page')
          .isNumeric()
          .optional()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
      ],
      this.getBoughtHistory
    );
    this.router.get(
      '/:order_id',
      [
        param('order_id')
          .trim()
          .notEmpty()
          .withMessage(
            'order_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        query('type')
          .trim()
          .notEmpty()
          .withMessage(
            'type' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        query('type').isIn(['seller', 'buyer']),
        query('formate').isIn(['soum', 'zatca', 'zatcaCreditNote', null]),
      ],
      this.getInvoice
    );
    this.router.get(
      '/gtm-data/:order_id',
      [
        param('order_id')
          .trim()
          .notEmpty()
          .withMessage(
            'order_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.gtmEventPayload
    );
    this.router.delete(
      '/invoice/:invoice_id',
      [
        AuthGuard,
        param('invoice_id')
          .trim()
          .notEmpty()
          .withMessage(
            'invoice_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.removeInvoice
    );
    this.router.get(
      '/detail/:order_id',
      [
        AuthGuard,
        param('order_id')
          .trim()
          .notEmpty()
          .withMessage(
            'order_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        query('type')
          .trim()
          .notEmpty()
          .withMessage(
            'type' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        query('type').isIn(['seller', 'buyer']),
      ],
      this.getOrderInfo
    );
    this.router.get('/payout/report', this.sendDailyPayoutReport);
    this.router.get(
      '/payout/:order_id',
      [
        AuthGuardDM,
        check('order_id')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
      ],
      this.getPayoutOrderInfo
    );
    // this.router.put(
    //   '/payout/:order_id',
    //   this.validateInputToUpdatePayoutOrder(),
    //   this.updatePayoutOrderInfo
    // );
    this.router.get(
      '/:order_id/payout/history',
      AuthGuardDM,
      this.getPayoutHistory
    );
    this.router.post('/dm-status-group/generate', this.genDMStatusGroups);
    this.router.post(
      '/reserve-financing-product',
      [AuthGuard],
      this.reserveFinancingProduct
    );
    this.router.post('/aljuf/lead', this.createAljufLead);
    this.router.post('/aljuf/lead/update', this.updateAljufLead);
    this.router.get('/aljuf/lead/status/:refNo', this.getAljufLeadStatus);
    this.router.post('/aljuf/lead/feedback', this.sendAljufLeadFeedback);
  }
  migrateCommission = async (req: Request, res: Response) => {
    try {
      this.orderService.migrateCommission();
      res.sendOk({});
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            'Failed to migrate commission',
            exception.message
          )
        );
      }
    }
  };

  gtmEventPayload = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            JSON.stringify(errors.array())
          )
        );
      }
      const orderId = req.params.order_id || null;

      const orderDetails = await this.orderService.gtmEventPayload(orderId);
      res.sendOk(orderDetails);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
            exception.message
          )
        );
      }
    }
  };
  getInvoice = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            JSON.stringify(errors.array())
          )
        );
      }
      const invoiceType = (req.query.type as string) || null;
      const orderId = req.params.order_id || null;
      const invoiceFormate = req.query.formate || InvoiceFormats.SOUM;

      const orderDetails = await this.orderService.generatePdfInvoice(
        orderId,
        invoiceType
      );
      const { content, pdfConfig } = getHtmlContentAndConfig(
        invoiceFormate as InvoiceFormats,
        invoiceType as string
      );
      const output = Mustache.render(content, orderDetails);
      const pdf = await generatePDF(output, pdfConfig);
      res.set('Content-Type', 'application/pdf');
      res.status(200).send(pdf);
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
  removeInvoice = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            JSON.stringify(errors.array())
          )
        );
      }
      const invoice_id = req.params.invoice_id || null;
      const [err, data] = await this.orderService.removeInvoice(invoice_id);
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            data.result.toString()
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
            Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
            exception.message
          )
        );
      }
    }
  };

  getOrderInfo = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
            JSON.stringify(errors.array())
          )
        );
      }
      const orderId: string = req.params.order_id;
      const orderType: string = req.query.type.toString();
      const [err, data] = await this.orderService.getOrderDetail(
        orderId,
        orderType
      );
      const [errInvoice, invoiceDetails] =
        await this.orderService.getInvoiceDetail(orderType, orderId);

      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            data.message
          )
        );
      }

      const order = data.order;
      order.invoice_urls = errInvoice
        ? []
        : (invoiceDetails as InvoiceTypeInput).invoice_urls;
      const vaultSettings = await getSecretData('/secret/data/apiv2');
      const disputeTimeWindow = JSON.parse(
        vaultSettings['dispute_time_window'] || '48'
      );
      const disputeReasons = JSON.parse(vaultSettings['dispute_reasons'] || []);
      const disputeQuestions = disputeReasons.filter(
        (category: any) =>
          category?.categoryId === order?.product?.category_id.toString()
      );
      order.disputeQuestions = disputeQuestions.length
        ? disputeQuestions[0]?.data
        : [];
      order.disputeTimeWindow = disputeTimeWindow;
      const disputeTimeWindowInMS = parseInt(disputeTimeWindow) * 3600000;
      const [, sysSettings] = await this.settingService.getSettingsObjectByKeys(
        ['guarantee_feature']
      );
      const guaranteeFeatureArr = sysSettings['guarantee_feature'];
      order.isSellerListedInGuaranteeFeature =
        guaranteeFeatureArr?.includes(data?.order?.seller) || false;
      try {
        const dmOrder = await this.deltaMachineService.getDMOrderByOrderId(
          orderId
        );
        order.dmOrderId = dmOrder?.id;
        if (dmOrder?.orderData?.deliveryDate) {
          order.deliveryDate = dmOrder.orderData.deliveryDate;
          const disputeTimeRemaining =
            new Date().getTime() - dmOrder.orderData.deliveryDate.getTime();
          order.disputeTimeRemaining =
            disputeTimeRemaining >= disputeTimeWindowInMS
              ? 0
              : disputeTimeRemaining;
        }
      } catch (err) {}
      res.sendOk(order);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
            exception.message
          )
        );
      }
    }
  };
  getPayoutOrderInfo = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_VALIDATE_REQUEST_GET_PAYOUT_SELLER,
            JSON.stringify(errors.array())
          )
        );
      }
      const orderId: string = req.params.order_id;
      const data = await this.orderService.getPayoutOrderInfo(orderId);
      res.sendOk(data);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
            exception.message
          )
        );
      }
    }
  };

  validateInputToUpdatePayoutOrder() {
    return [
      AuthGuardDM,
      param('order_id')
        .not()
        .isEmpty()
        .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
      body('commission')
        .isNumeric()
        .withMessage(
          'commission' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
      body('commission_amount')
        .isNumeric()
        .withMessage(
          'commission_amount' +
            Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
      body('bank_name')
        .not()
        .isEmpty()
        .withMessage(
          'bank_name' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('iban')
        .not()
        .isEmpty()
        .withMessage(
          'iban' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
    ];
  }

  mappingEditPayoutOrderFormInput(req: Request) {
    const payoutInput: UpdatePayoutOrderInput = {
      order_id: req.params.order_id,
      commission: req.body.commission,
      commission_amount: req.body.commission_amount,
      bank_name: req.body.bank_name,
      iban: req.body.iban,
    };
    return payoutInput;
  }

  updatePayoutOrderInfo = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_VALIDATE_REQUEST_GET_PAYOUT_SELLER,
            JSON.stringify(errors.array())
          )
        );
      }
      const editPayoutInput = this.mappingEditPayoutOrderFormInput(req);
      const data = await this.orderService.updatePayoutOrderInfo(
        editPayoutInput
      );
      res.sendOk(data);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_SELLER_PAYOUT,
            exception.message
          )
        );
      }
    }
  };

  getPayoutHistory = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_VALIDATE_REQUEST_GET_PAYOUT_SELLER,
            JSON.stringify(errors.array())
          )
        );
      }
      const orderId = req.params.order_id;
      const [err, data] = await this.orderService.getPayoutHistory(orderId);
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
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
            Constants.ERROR_MAP.FAILED_TO_GET_PAYOUT_HISTORY,
            exception.message
          )
        );
      }
    }
  };

  sendDailyPayoutReport = async (req: Request, res: Response) => {
    try {
      const [err, sendResult] = await this.orderService.sendDailyPayoutReport();
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SEND_PAYOUT_HISTORY_EMAIL,
            sendResult.message
          )
        );
      } else {
        res.sendOk(sendResult.result, sendResult.message);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SEND_PAYOUT_HISTORY_EMAIL,
            exception.message
          )
        );
      }
    }
  };

  getAllOrders = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_LIST_ORDER,
            JSON.stringify(errors.array())
          )
        );
      }
      const [err, sendResult] = await this.orderService.getAllOrders(req);
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_LIST_ORDER
          )
        );
      } else {
        res.sendOk(sendResult);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_LIST_ORDER,
            JSON.stringify(exception)
          )
        );
      }
    }
  };

  createOrder = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_BUY_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const user = req.userInfo as any;
      const clientId: string = _get(req.headers, 'client-id', '');
      const gtmClientId: string = _get(req.headers, 'gtm-client-id', '');
      const gtmSessionId: string = _get(req.headers, 'gtm-session-id', '');
      const purchaseProductDto = req.body as PurchaseProductDto;
      const result = await this.orderService.createOrder(
        user,
        purchaseProductDto,
        clientId,
        gtmClientId,
        gtmSessionId
      );
      res.sendOk(result);
    } catch (exception) {
      console.log(exception);
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

  reserveFinancingProduct = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_BUY_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }

      const userId = (req.user as any).id || null;
      const body = req.body;
      const result = await this.orderService.reserveFinancingOrder(
        body.orderId,
        userId,
        body.paymentOptionId,
        body.productId
      );
      res.sendOk(result);
    } catch (exception) {
      console.log(exception);
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
  createAljufLead = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const result = await this.orderService.createAljufLead(data);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  updateAljufLead = async (req: Request, res: Response) => {
    try {
      const { refNo, statusCode } = req.body;
      const result = await this.orderService.updateAljufLead(refNo, statusCode);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  getAljufLeadStatus = async (req: Request, res: Response) => {
    try {
      const { refNo } = req.params;
      const result = await this.orderService.getLeadStatus(refNo);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  sendAljufLeadFeedback = async (req: Request, res: Response) => {
    try {
      const { refNo, leadId, comment } = req.body;
      const result = await this.orderService.submitFeedback(refNo, leadId, comment);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  genDMStatusGroups = async (req: Request, res: Response) => {
    try {
      const [error, result] = await this.dmStatusGroupService.genDMStatusGroups(
        req.body
      );

      if (error) {
        return res.sendError(result);
      }

      return res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DM_STATUS_GROUP,
            exception.message
          )
        );
      }
    }
  };

  getBoughtHistory = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_BOUGHT_HISTORY,
            JSON.stringify(errors.array())
          )
        );
      }

      const userId = (req.user as any).id || null;
      const page = parseInt(req?.query?.page?.toString()) || 1;
      const size = parseInt(req?.query?.size?.toString()) || 20;

      const [err, result] = await this.orderService.getBoughtHistory(
        userId,
        page,
        size
      );

      if (err) {
        return res.sendError(result.result);
      }

      return res.sendOk(result.result, result.message);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_BOUGHT_HISTORY,
            exception.message
          )
        );
      }
    }
  };
}
