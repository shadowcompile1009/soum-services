import { Request, Response, Router } from 'express';
import {
  body,
  check,
  header,
  param,
  query,
  validationResult,
} from 'express-validator';
import { isValidIBAN } from 'ibantools';
import { parse } from 'json2csv';
import moment from 'moment';
import { isValidObjectId } from 'mongoose';
import { Container } from 'typedi';
import { APIConstants } from '../../constants/apiConstants';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { NCTReasonsInputDto } from '../../dto/nctReasons/NCTReasonDto';
import { RefundOrderDto } from '../../dto/refund/RefundOrderDto';
import { DeltaMachineStatusName } from '../../enums/DeltaMachineStatusName';
import {
  DeltaMachineBNPLFEStatuses,
  DeltaMachineBNPLStatuses,
  DeltaMachineReplacementStatuses,
  DeltaMachineStatusSubmodule,
} from '../../enums/DeltaMachineStatusSubmodule';
import {
  DmActionsEnum,
  DmDeliveryActionsEnum,
} from '../../enums/DmActionsEnum';
import { PaymentMethod } from '../../enums/PaymentMethod.Enum';
import { SMSAOrderStatus } from '../../enums/SmsaOrderStatus';
import { UserType } from '../../enums/UserType.Enum';
import { GetCreditsByOrderIds } from '../../grpc/wallet';
import { AuthGuard } from '../../middleware/authGuard';
import { AuthGuardDM } from '../../middleware/authGuardDM';
import permit from '../../middleware/authorizationGuard';
import {
  DeltaMachineOrderDocument,
  getConfirmationDeadline,
} from '../../models/DeltaMachineOrder';
import { DeltaMachineSettingInput } from '../../models/DeltaMachineSetting';
import { DeltaMachineStatusDocument } from '../../models/DeltaMachineStatus';
import { DMStatusGroups } from '../../models/DmStatusGroup';
import { NCTReasonsDocument } from '../../models/NCTReasons';
import { UpdatePayoutOrderInput } from '../../models/Order';
import { ModelRepository } from '../../repositories/modelRepository';
import { ProductRepository } from '../../repositories/productRepository';
import { BankService } from '../../services/bankService';
import { DeltaMachineService } from '../../services/deltaMachineService';
import { DmActionsService } from '../../services/dmActionsService';
import { DMSecurityFeeService } from '../../services/dmSecurityFeeService';
import { DmStatusGroupService } from '../../services/dmStatusGroupsService';
import { OrderService } from '../../services/orderService';
import { PaymentService } from '../../services/paymentService';
import { UserService } from '../../services/userService';
import { VariantService } from '../../services/variantService';
import {
  _get,
  decrypt,
  decryptIBAN,
  formatPriceInDecimalPoints,
  normalize,
} from '../../util/common';
import { getDMOCSVExportFields } from '../../util/excel';
import logger from '../../util/logger';
import { sendEventData } from '../../util/webEngageEvents';
import IController from './IController';

export class DeltaMachineOrdersController implements IController {
  path = 'dm-orders/';
  router: Router;
  deltaMachineService: DeltaMachineService;
  dmSecurityFeeService: DMSecurityFeeService;
  bankService: BankService;
  orderService: OrderService;
  userService: UserService;
  variantService: VariantService;
  productRepository: ProductRepository;
  modelRepository: ModelRepository;
  paymentService: PaymentService;

  dmStatusGroupService: DmStatusGroupService;
  dmActionsService: DmActionsService;

  constructor(router: Router) {
    this.router = router;
    this.deltaMachineService = Container.get(DeltaMachineService);
    this.dmSecurityFeeService = Container.get(DMSecurityFeeService);
    this.bankService = Container.get(BankService);
    this.orderService = Container.get(OrderService);
    this.userService = Container.get(UserService);
    this.variantService = Container.get(VariantService);
    this.productRepository = Container.get(ProductRepository);
    this.modelRepository = Container.get(ModelRepository);
    this.dmStatusGroupService = Container.get(DmStatusGroupService);
    this.dmActionsService = Container.get(DmActionsService);
    this.paymentService = Container.get(PaymentService);
  }

  initializeRoutes() {
    this.router.get('/', AuthGuardDM, this.list);
    this.router.put('/populate/order-data', this.populateOrderData);
    this.router.post('/webhook/smsa/automation', this.smsaWebhook);
    this.router.post('/freshchat/automation', this.freshchatAutomation);
    this.router.post(
      '/freshchat/seller-processing-automation',
      this.handleAutomationForSellerProcessing
    );
    this.router.post(
      '/freshchat/listing-approved-automation',
      this.listingApprovedAutomation
    );
    this.router.get(
      '/settings',
      [
        AuthGuardDM,
        permit('', true),
        query('key')
          .trim()
          .notEmpty()
          .withMessage(
            'key' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getSetting
    );
    this.router.post(
      '/settings',
      this.validateAddSettingInput(),
      permit('', true),
      this.addSetting
    );
    this.router.put(
      '/settings',
      AuthGuardDM,
      permit('', true),
      this.updateWhatsappSetting
    );
    this.router.put(
      '/settings/courier-automation',
      AuthGuardDM,
      permit('', true),
      this.updateCourierAutomationSetting
    );
    this.router.put(
      '/settings/om-status-automation',
      AuthGuardDM,
      permit('', true),
      this.updateOMStatusAutomationSetting
    );
    this.router.put(
      '/settings/pickup-service',
      AuthGuardDM,
      permit('', true),
      this.updatePickupServiceSetting
    );
    this.router.put(
      '/settings/:key',
      AuthGuardDM,
      param('key')
        .trim()
        .isString()
        .withMessage(
          'key' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      this.updateWhatsappSettingKey
    );
    this.router.get(
      '/export',
      AuthGuardDM,
      permit(APIConstants.EXPORT_NEW_ORDERS.KEY),
      this.exportList
    );
    this.router.get('/statuses', AuthGuardDM, this.listStatuses);
    this.router.get('/status/:orderId', AuthGuard, this.getStatusByOrderId);
    this.router.get(
      '/whatsapp-msgs',
      AuthGuardDM,
      permit(APIConstants.WHATSAPP_MESSAGE_PROCESSING.KEY),
      this.listWhatsappMsgs
    );
    this.router.post(
      '/statuses',
      [
        AuthGuardDM,
        permit('', true),
        header('caller').notEmpty().equals('system'),
      ],
      this.createStatuses
    );
    this.router.delete(
      '/statuses/:id',
      [
        AuthGuardDM,
        permit('', true),
        param('id')
          .trim()
          .isString()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        header('caller').notEmpty().equals('system'),
      ],
      this.deleteStatus
    );
    this.router.get('/nct-reasons', AuthGuardDM, this.listNCTReasons);
    this.router.get(
      '/nct-reasons/:orderId',
      AuthGuardDM,
      this.getNCTReasonByOrderId
    );
    this.router.post(
      '/nct-reasons',
      [
        AuthGuardDM,
        permit('', true),
        header('caller').notEmpty().equals('system'),
      ],
      this.createNCTReasons
    );
    this.router.delete(
      '/nct-reasons/:id',
      [
        AuthGuardDM,
        permit('', true),
        param('id')
          .trim()
          .isString()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        header('caller').notEmpty().equals('system'),
      ],
      this.deleteNCTReason
    );
    this.router.post(
      '/dmo-nct-reasons',
      [
        AuthGuardDM,
        body('nctReasonId')
          .notEmpty()
          .withMessage(
            'nctReasonId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('dmoId')
          .notEmpty()
          .withMessage(
            'dmoId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('orderId')
          .notEmpty()
          .withMessage(
            'orderId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.createDmoNCTReason
    );
    this.router.post(
      '/nct-reasons/import',
      [AuthGuardDM, header('caller').notEmpty().equals('system')],
      this.importNCTReasons
    );
    this.router.post(
      '/daily-report-seller-response',
      this.sendDailyReportSellerResponse
    );

    this.router.get(
      '/payref/history/:orderId',
      [
        AuthGuardDM,
        param('orderId')
          .trim()
          .isString()
          .notEmpty()
          .withMessage(
            'orderId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.listPayoutRefundHistory
    );
    this.router.post(
      '/',
      [
        body('orderId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
        header('client-id').notEmpty().equals('api-v1'),
      ],
      this.create
    );
    this.router.get(
      '/order/:orderId',
      [header('client-id').notEmpty().equals('api-v1')],
      this.getDmOrderStatusByOrderId
    );
    this.router.put(
      '/order/:orderId',
      [header('client-id').notEmpty().equals('api-v1')],
      this.updateDMOrderStatusByName
    );
    this.router.post(
      '/reverse-tracking-number',
      [
        AuthGuardDM,
        body('orderId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
      ],
      this.generateReverseTrackingNumber
    );
    this.router.post(
      '/orders/check',
      [
        body('userId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.USER_ID),
        body('productsCount')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.PRODUCT_COUNT),
        header('client-id').notEmpty().equals('api-v1'),
      ],
      this.checkActiveOrdersExistence
    );
    this.router.post(
      '/dispue/message',
      [
        body('orderId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
        header('client-id').notEmpty().equals('api-v1'),
      ],
      this.sendWhatsAppMessageForDispute
    );
    this.router.put(
      '/shipping-method',
      [
        body('dmOrderId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
        body('serviceName')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.SERVICE_NAME),
      ],
      this.confirmShippingMethod
    );
    this.router.put(
      '/:id',
      [
        AuthGuardDM,
        param('id')
          .trim()
          .isString()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('statusId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.STATUS_ID),
      ],
      this.update
    );
    this.router.put(
      '/:id/confirmation',
      [
        AuthGuard,
        param('id')
          .trim()
          .isString()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('statusId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.STATUS_ID),
      ],
      this.updateConfirmation
    );
    this.router.put(
      '/:id/confirmation-actions',
      [
        AuthGuardDM,
        param('id')
          .trim()
          .isString()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('actionId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.STATUS_ID),
        body('nctReasonId').optional(),
        body('orderId').optional(),
      ],
      this.applyConfirmationAction
    );
    this.router.put(
      '/:id/delivery-actions',
      [
        AuthGuardDM,
        param('id')
          .trim()
          .isString()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('actionId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.STATUS_ID),
        body('orderId').optional(),
      ],
      this.applyDeliveryAction
    );
    this.router.put(
      '/:id/shipping-actions',
      [
        AuthGuardDM,
        param('id')
          .trim()
          .isString()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('actionId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.STATUS_ID),
        body('nctReasonId').optional(),
        body('orderId').optional(),
      ],
      this.applyShippingAction
    );
    this.router.put(
      '/:id/dispute-actions',
      [
        AuthGuardDM,
        param('id')
          .trim()
          .isString()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('actionId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.STATUS_ID),
        body('nctReasonId').optional(),
        body('orderId').optional(),
      ],
      this.applyDisputeAction
    );
    this.router.put(
      '/:id/backlog-actions',
      [
        AuthGuardDM,
        param('id')
          .trim()
          .isString()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('actionId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.STATUS_ID),
        body('orderId').optional(),
      ],
      this.applyBacklogAction
    );
    this.router.delete(
      '/:id',
      [
        AuthGuardDM,
        param('id')
          .trim()
          .isString()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.delete
    );
    this.router.put(
      '/:id/nct-reasons',
      [
        AuthGuardDM,
        param('id')
          .trim()
          .isString()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('nctReasonId')
          .notEmpty()
          .withMessage(
            'nctReasonId' + Constants.VALIDATE_REQUEST_MSG.STATUS_ID
          ),
      ],
      this.updateNCTReason
    );
    this.router.post(
      '/payout/:orderId',
      [
        AuthGuardDM,
        permit(APIConstants.SUBMIT_PAYOUT.KEY),
        param('orderId')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
        body('grandTotal')
          .isNumeric()
          .withMessage(
            'grandTotal' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
      ],
      this.payoutOrderHyperSplit
    );
    this.router.post(
      '/refund/:orderId',
      [
        AuthGuardDM,
        permit(APIConstants.SUBMIT_REFUND.KEY),
        param('orderId')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
        body('paymentMethod')
          .notEmpty()
          .isIn([PaymentMethod.InstantRefund, PaymentMethod.Reversal])
          .withMessage(
            'paymentMethod' +
              Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('amount')
          .isNumeric()
          .withMessage(
            'amount' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        body('iban').trim().optional(),
        body('bankId').trim().optional(),
        body('accountName').trim().optional(),
      ],
      this.refundPayment
    );
    this.router.put(
      '/payout/:orderId',
      [
        AuthGuardDM,
        permit(APIConstants.SUBMIT_PAYOUT.KEY),
        param('orderId')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
        body('commission')
          .isNumeric()
          .withMessage(
            'commission' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        body('bankName')
          .not()
          .isEmpty()
          .withMessage(
            'bankName' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('iban')
          .not()
          .isEmpty()
          .withMessage(
            'iban' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('accountName')
          .not()
          .isEmpty()
          .withMessage(
            'accountName' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.updatePayoutOrderInfo
    );
    this.router.get(
      '/payout/:orderId',
      [
        AuthGuardDM,
        check('orderId')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
      ],
      this.getPayoutOrderInfo
    );
    this.router.get(
      '/order/detail/:orderId',
      [
        AuthGuardDM,
        param('orderId')
          .trim()
          .notEmpty()
          .withMessage(
            'orderId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        query('type')
          .trim()
          .notEmpty()
          .withMessage(
            'type' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        query('type').isIn([UserType.SELLER, UserType.BUYER]),
      ],
      this.getOrderInfo
    );
    this.router.put(
      '/payout-credit/:orderId',
      [
        AuthGuardDM,
        permit(APIConstants.SUBMIT_PAYOUT.KEY),
        param('orderId')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
        body('commission')
          .isNumeric()
          .withMessage(
            'commission' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
      ],
      this.updatePayoutCreditCommission
    );
    this.router.put(
      '/in-transit-orders/smsa/automation',
      this.inTransitSMSAOrdersAutomation
    );
    this.router.put(
      '/awaiting-orders/smsa/automation',
      this.awaitingSMSAOrdersAutomation
    );
    this.router.put(
      '/in-transit-orders/b1/automation',
      this.inTransitB1OrdersAutomation
    );
    this.router.put(
      '/awaiting-orders/b1/automation',
      this.awaitingB1OrdersAutomation
    );
    this.router.post(
      '/awaiting-seller-to-ship/automation',
      this.awaitingSellersToShipAutomation
    );
    this.router.post(
      '/capture/:orderId',
      [
        AuthGuardDM,
        permit(APIConstants.CAPTURE_BNPL_ORDER.KEY),
        param('orderId')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
      ],
      this.captureOrder
    );
    this.router.post(
      '/capture/orders/all',
      [AuthGuardDM, permit(APIConstants.CAPTURE_BNPL_ORDER.KEY)],
      this.captureAllOrders
    );
    this.router.get('/status-group', [AuthGuardDM], this.getDMStatusGroups);
    this.router.post('/status-group', [AuthGuardDM], this.genDMStatusGroups);
    this.router.get('/actions', [AuthGuardDM], this.getDMActions);
    this.router.post('/actions', [AuthGuardDM], this.genDMActions);
    this.router.get(
      '/:orderId',
      [
        AuthGuardDM,
        param('orderId')
          .trim()
          .isString()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.load
    );
    this.router.post(
      '/close/:orderId',
      [
        AuthGuardDM,
        permit(APIConstants.SUBMIT_REFUND.KEY),
        param('orderId')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
      ],
      this.closeOrder
    );
    this.router.get(
      '/count/transactions',
      AuthGuard,
      this.getSellerTransactionsCount
    );
    this.router.put(
      '/relist/:id',
      [
        AuthGuardDM,
        param('id')
          .trim()
          .isString()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.relistProduct
    );
    this.router.post(
      '/confirm-availability/automation',
      this.confirmAvailabilityAutomation
    );

    this.router.get(
      '/dispute/pre-signed-url/:userId/:dmOrderId/:count/:extensions',
      [
        AuthGuard,
        check('userId')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.USER_ID),
        check('dmOrderId')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
      ],
      this.getAWSPresignedUrlForDispute
    );

    this.router.post(
      '/dispute/:dmOrderId',
      [
        AuthGuard,
        check('dmOrderId')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
      ],
      this.submitDispute
    );

    this.router.put(
      '/dispute/:dmOrderId/cancel',
      [
        check('dmOrderId')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
      ],
      this.cancelDispute
    );

    this.router.get(
      '/dispute/:dmOrderId',
      [
        AuthGuard,
        check('dmOrderId')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
      ],
      this.getlDisputeData
    );
    this.router.get(
      '/my-purchase/products',
      AuthGuard,
      this.getMyPurchaseProducts
    );

    this.router.get('/my-sales/count', AuthGuard, this.getMySalesCount);
    this.router.get('/my-sales/products', AuthGuard, this.getMySalesProducts);
    this.router.post(
      '/replacement/:orderId/:replacedProductId',
      [
        AuthGuardDM,
        param('orderId')
          .not()
          .isEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
      ],
      this.replaceOrder
    );
  }

  load = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const response = await this.deltaMachineService.getOrderDetailById(
        req.params.orderId
      );
      res.sendOk(response);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO,
            exception.message
          )
        );
      }
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const offset = parseInt(req.query?.offset?.toString()) || 0;
      let limit = parseInt(req.query?.limit?.toString()) || 10;
      if (limit > 100) limit = 100;
      let submodule: DeltaMachineStatusSubmodule =
        req.query?.submodule?.toString() as DeltaMachineStatusSubmodule;
      if (
        !submodule ||
        !Object.values(DeltaMachineStatusSubmodule).includes(
          submodule as DeltaMachineStatusSubmodule
        )
      ) {
        submodule = DeltaMachineStatusSubmodule.NEW;
      }

      let searchOption = {};
      if (req.query?.q) {
        searchOption = {
          order_number: (req.query?.q?.toString() || '').trim(),
        };
      }
      if (req.query?.capturestatus) {
        let captureStatus = DeltaMachineBNPLStatuses.CAPTURED;
        if (
          req.query?.capturestatus === DeltaMachineBNPLFEStatuses.NOT_CAPTURED
        ) {
          captureStatus = DeltaMachineBNPLStatuses.NOT_CAPTURED;
        }
        searchOption = {
          captureStatus,
        };
      }
      const statuses =
        (req.query?.statuses?.toString() || '').length > 0
          ? (req.query?.statuses?.toString() || '').split(',')
          : [];
      if (submodule === DeltaMachineStatusSubmodule.BNPL) {
        const bnplOrdersStatusesNames = [
          DeltaMachineStatusName.IN_TRANSIT,
          DeltaMachineStatusName.ITEM_DELIVERED,
          DeltaMachineStatusName.PAYOUT_TO_SELLER,
          DeltaMachineStatusName.DELIVERED_SOUM_PRODUCT,
          DeltaMachineStatusName.TRANSFERRED,
        ];
        const allStatuses = await this.deltaMachineService.getStatusList();
        (allStatuses as DeltaMachineStatusDocument[]).forEach(
          (status: DeltaMachineStatusDocument) => {
            if (
              bnplOrdersStatusesNames.includes(
                status.toObject().name as DeltaMachineStatusName
              )
            ) {
              statuses.push(status._id);
            }
          }
        );
      }

      if (
        submodule === DeltaMachineStatusSubmodule.CONFIRMATION &&
        !statuses?.length
      ) {
        const confrimationStatusesNames = [
          DeltaMachineStatusName.NEW_ORDER,
          DeltaMachineStatusName.TO_CONFIRM_AVAILABILITY,
          DeltaMachineStatusName.CONFIRMED_AVAILABILITY,
          DeltaMachineStatusName.CONFIRMED_UNAVAILABILITY,
        ];
        const allStatuses = await this.deltaMachineService.getStatusList();
        (allStatuses as DeltaMachineStatusDocument[]).forEach(
          (status: DeltaMachineStatusDocument) => {
            if (
              confrimationStatusesNames.includes(
                status.toObject().name as DeltaMachineStatusName
              )
            ) {
              statuses.push(status._id);
            }
          }
        );
      }

      if (
        submodule === DeltaMachineStatusSubmodule.DELIVERY &&
        !statuses?.length
      ) {
        const deliveryStatusesNames = [
          DeltaMachineStatusName.IN_TRANSIT,
          DeltaMachineStatusName.ITEM_DELIVERED,
        ];
        const allStatuses = await this.deltaMachineService.getStatusList();
        (allStatuses as DeltaMachineStatusDocument[]).forEach(
          (status: DeltaMachineStatusDocument) => {
            if (
              deliveryStatusesNames.includes(
                status.toObject().name as DeltaMachineStatusName
              )
            ) {
              statuses.push(status._id);
            }
          }
        );
      }
      if (
        submodule === DeltaMachineStatusSubmodule.DISPUTE &&
        !statuses?.length
      ) {
        const deliveryStatusesNames = [
          DeltaMachineStatusName.RETURNED,
          DeltaMachineStatusName.DISPUTE,
          DeltaMachineStatusName.DISPUTED,
          DeltaMachineStatusName.VALID_DISPUTE,
          DeltaMachineStatusName.INVALID_DISPUTE,
          DeltaMachineStatusName.RETURN_IN_TRANSIT,
        ];
        const allStatuses = await this.deltaMachineService.getStatusList();
        (allStatuses as DeltaMachineStatusDocument[]).forEach(
          (status: DeltaMachineStatusDocument) => {
            if (
              deliveryStatusesNames.includes(
                status.toObject().name as DeltaMachineStatusName
              )
            ) {
              statuses.push(status._id);
            }
          }
        );
      }
      if (
        submodule === DeltaMachineStatusSubmodule.BACKLOG &&
        !statuses?.length
      ) {
        const backlogStatusesNames = [
          DeltaMachineStatusName.BACKLOG_REFUND,
          DeltaMachineStatusName.BACKLOG_PAYOUT,
          DeltaMachineStatusName.REFUND_HOLD,
          DeltaMachineStatusName.BACKLOG_IN_TRANSIT,
          DeltaMachineStatusName.BACKLOG_AWAITING_COURIER_TO_PICK_UP,
          DeltaMachineStatusName.BACKLOG_AWAITING_SELLER_TO_SHIP,
        ];
        const backlogStatuses =
          await this.deltaMachineService.getStatusListByName(
            backlogStatusesNames
          );
        (backlogStatuses as DeltaMachineStatusDocument[]).forEach(
          (status: DeltaMachineStatusDocument) => {
            if (
              backlogStatusesNames.includes(
                status.toObject().name as DeltaMachineStatusName
              )
            ) {
              statuses.push(status._id);
            }
          }
        );
      }
      if (
        submodule === DeltaMachineStatusSubmodule.SHIPPING &&
        !statuses?.length
      ) {
        const deliveryStatusesNames = [
          DeltaMachineStatusName.AWAITING_SELLER_TO_SHIP,
          DeltaMachineStatusName.AWAITING_COURIER_TO_PICKUP,
          DeltaMachineStatusName.PICKED_UP,
        ];
        const allStatuses = await this.deltaMachineService.getStatusList();
        (allStatuses as DeltaMachineStatusDocument[]).forEach(
          (status: DeltaMachineStatusDocument) => {
            if (
              deliveryStatusesNames.includes(
                status.toObject().name as DeltaMachineStatusName
              )
            ) {
              statuses.push(status._id);
            }
          }
        );
      }
      if (submodule === DeltaMachineStatusSubmodule.REPLACEMENT) {
        let replacementStatusesNames = [
          DeltaMachineStatusName.CONFIRMED_UNAVAILABILITY,
          DeltaMachineStatusName.DISPUTE,
          DeltaMachineStatusName.DISPUTED,
          DeltaMachineStatusName.VALID_DISPUTE,
          DeltaMachineStatusName.NEW_DISPUTE,
          DeltaMachineStatusName.FAILED_INSPECTION,
          DeltaMachineStatusName.REFUND_TO_BUYER,
          DeltaMachineStatusName.BACKLOG_REFUND,
          DeltaMachineStatusName.REFUND_HOLD,
          DeltaMachineStatusName.REPLACED,
          DeltaMachineStatusName.UNFULFILLED,
        ];
        if (
          req.query?.replacementStatus ===
          DeltaMachineReplacementStatuses.REPLACED
        ) {
          replacementStatusesNames = [DeltaMachineStatusName.REPLACED];
        }
        if (
          req.query?.replacementStatus ===
          DeltaMachineReplacementStatuses.NOT_REPLACED
        ) {
          replacementStatusesNames.pop();
        }
        const allStatuses = await this.deltaMachineService.getStatusList();
        (allStatuses as DeltaMachineStatusDocument[]).forEach(
          (status: DeltaMachineStatusDocument) => {
            if (
              replacementStatusesNames.includes(
                status.toObject().name as DeltaMachineStatusName
              )
            ) {
              statuses.push(status._id);
            }
          }
        );
      }
      const services =
        (req.query?.services?.toString() || '').length > 0
          ? (req.query?.services?.toString() || '').split(',')
          : [];
      const result = await this.deltaMachineService.getList({
        offset,
        limit,
        submodule,
        searchOption,
        statuses,
        services,
      });

      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO,
            exception.message
          )
        );
      }
    }
  };

  populateOrderData = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_POPULATE_DMO_ORDER_DATA,
            JSON.stringify(errors.array())
          )
        );
      }
      await this.deltaMachineService.populateOrderData();
      res.sendOk(true);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_POPULATE_DMO_ORDER_DATA,
            exception.message
          )
        );
      }
    }
  };

  listPayoutRefundHistory = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT_HISTORY,
            JSON.stringify(errors.array())
          )
        );
      }
      const result = await this.deltaMachineService.listPayoutRefundHistory(
        req.params.orderId
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
            Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT_HISTORY,
            exception.message
          )
        );
      }
    }
  };

  exportList = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      let submodule: DeltaMachineStatusSubmodule =
        req.query?.submodule?.toString() as DeltaMachineStatusSubmodule;

      if (
        !submodule ||
        !Object.values(DeltaMachineStatusSubmodule).includes(
          submodule as DeltaMachineStatusSubmodule
        )
      ) {
        submodule = DeltaMachineStatusSubmodule.NEW;
      }
      const result = await this.deltaMachineService.getDetailedList(
        0,
        0,
        submodule
      );
      const fields = getDMOCSVExportFields();
      const opts = { fields };
      const csvData = result.data.map(order => {
        if (order?.orderData) {
          try {
            order.orderData.sellerBankBIC = decrypt(
              _get(order.orderData, 'sellerBankBIC', ''),
              _get(order.orderData, 'sellerSecretKey', '')
            );
            order.orderData.sellerIBAN = decryptIBAN(
              _get(order.orderData, 'sellerIBAN', ''),
              _get(order.orderData, 'sellerSecretKey', '')
            );
          } catch (err) {}
          order.orderData.trackingNumber = order.trackingNumber;
        }
        return order.orderData;
      });
      const csv = parse(csvData, opts);
      res.attachment('orders.csv');
      res.status(200).send(csv);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO,
            exception.message
          )
        );
      }
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const result = await this.deltaMachineService.create(req.body);
      if (!result) {
        return res.sendError({
          message: 'Failed to create delta machine order',
        });
      }
      return res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_DMO,
            exception.message
          )
        );
      }
    }
  };

  updateDMOrderStatusByName = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const { statusName } = req.body;
      const result = await this.deltaMachineService.updateDMOrderStatusByName(
        req.params.orderId,
        statusName
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };

  getDmOrderStatusByOrderId = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const result = await this.deltaMachineService.getDmOrderStatusByOrderId(
        req.params.orderId
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
            Constants.ERROR_MAP.FAILED_TO_GET_DMO,
            exception.message
          )
        );
      }
    }
  };

  generateReverseTrackingNumber = async (req: Request, res: Response) => {
    try {
      const result =
        await this.deltaMachineService.generateReverseTrackingNumber(
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
            Constants.ERROR_MAP.FAILED_TO_GENERATE_TO_REVERSE_TRACKING_NUMBER,
            exception.message
          )
        );
      }
    }
  };

  sendWhatsAppMessageForDispute = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SEND_DISPUTE_MESSAGE,
            JSON.stringify(errors.array())
          )
        );
      }
      const result =
        await this.deltaMachineService.sendWhatsAppMessageForDispute(
          req.body.orderId
        );
      const disputeStatusesNames = [
        DeltaMachineStatusName.DISPUTE,
        DeltaMachineStatusName.DISPUTED,
        DeltaMachineStatusName.NEW_DISPUTE,
      ];
      const statuses = await this.deltaMachineService.getStatusListByName(
        disputeStatusesNames
      );
      let disputeStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.DISPUTE
      );
      if (!disputeStatus) {
        disputeStatus = (statuses as DeltaMachineStatusDocument[]).find(
          status => status.name === DeltaMachineStatusName.DISPUTED
        );
      }
      const dmOrder = await this.deltaMachineService.getDMOrderByOrderId(
        req.body.orderId
      );
      await this.deltaMachineService.updateAirTableRecordStatus(
        dmOrder.id,
        disputeStatus.id
      );
      const isDisputed = dmOrder?.orderData?.disputeDate;
      await this.deltaMachineService.update(dmOrder.id, {
        statusId: disputeStatus.id,
        'orderData.disputeDate': isDisputed ? isDisputed : new Date(),
      });
      // send WE event when dispute raise from app
      await this.deltaMachineService.sendWEDisputeRaisedEvent(req.body.orderId);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SEND_DISPUTE_MESSAGE,
            exception.message
          )
        );
      }
    }
  };

  handleAutomationForSellerProcessing = async (req: Request, res: Response) => {
    try {
      await this.deltaMachineService.handleAutomationForSellerProcessing(
        req.body?.phoneNumber,
        req.body?.messageText
      );
      res.sendOk(true);
    } catch (err) {}
  };
  listingApprovedAutomation = async (req: Request, res: Response) => {
    try {
      await this.deltaMachineService.sendShippingInfoMessage(
        req.body?.phoneNumber
      );
      res.sendOk(true);
    } catch (err) {}
  };

  confirmShippingMethod = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const dmOrder = await this.deltaMachineService.confirmShippingMethod(
        req.body.serviceName,
        req.body.dmOrderId
      );
      res.sendOk(dmOrder);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const { dmoStatusDocument, seller } =
        await this.deltaMachineService.updateAirTableRecordStatus(
          req.params.id,
          req.body.statusId
        );
      await this.deltaMachineService.createActivityLogEvent(
        req.params.id,
        req.body.statusId,
        (req as any).userInfo._id,
        (req as any).userInfo.username
      );
      const dmOrderRes = await this.deltaMachineService.getById(req.params.id);
      let updateData: any = {
        statusId: req.body.statusId,
      };
      if (
        dmoStatusDocument?.name ===
        DeltaMachineStatusName.CONFIRMED_AVAILABILITY
      ) {
        const isConfirmed = dmOrderRes?.orderData?.confirmationDate;
        updateData = {
          statusId: req.body.statusId,
          'orderData.confirmationDate': isConfirmed ? isConfirmed : new Date(),
        };
      } else if (
        dmoStatusDocument?.name === DeltaMachineStatusName.ITEM_DELIVERED
      ) {
        const isDelivered = dmOrderRes?.orderData?.deliveryDate;
        updateData = {
          statusId: req.body.statusId,
          'orderData.deliveryDate': isDelivered ? isDelivered : new Date(),
        };
      } else if (dmoStatusDocument?.name === DeltaMachineStatusName.DISPUTE) {
        const isDisputed = dmOrderRes?.orderData?.disputeDate;
        updateData = {
          statusId: req.body.statusId,
          'orderData.disputeDate': isDisputed ? isDisputed : new Date(),
        };
      }

      const result = await this.deltaMachineService.update(
        req.params.id,
        updateData
      );

      if (dmoStatusDocument?.submodule === DeltaMachineStatusSubmodule.CLOSED) {
        const products = await this.dmSecurityFeeService.findProductsByUserId(
          seller
        );
        if (products?.length) {
          const activeOrderExistence =
            await this.deltaMachineService.checkActiveDMOrders(
              seller,
              products.length
            );
          if (!activeOrderExistence) {
            await this.dmSecurityFeeService.updateSecurityFeeStatusAndDeposit(
              seller
            );
          }
        }
      }

      if (
        dmoStatusDocument?.name === DeltaMachineStatusName.REFUNDED ||
        dmoStatusDocument?.name === DeltaMachineStatusName.REFUND_TO_BUYER
      ) {
        await this.deltaMachineService.decreasePromoUsageCount(
          dmOrderRes.orderId
        );
      }
      const dynamicTimerStatusIds =
        (await this.dmStatusGroupService.getDmStatusGroups(
          DMStatusGroups.DYNAMIC_TIMER_STATUS_IDS
        )) as string[];
      if (dynamicTimerStatusIds.includes(req.body.statusId)) {
        await this.deltaMachineService.sendWEUpdateOrderEvent(result?.result);
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };

  updateConfirmation = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const reqBody = req.body;
      const status = await this.deltaMachineService.getStatusById(
        reqBody.statusId
      );
      if (
        ![
          DeltaMachineStatusName.CONFIRMED_AVAILABILITY as string,
          DeltaMachineStatusName.CONFIRMED_UNAVAILABILITY as string,
        ].includes(status?.name)
      ) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO
          )
        );
      }
      await this.deltaMachineService.updateAirTableRecordStatus(
        req.params.id,
        reqBody.statusId
      );
      let updateData = {
        statusId: reqBody.statusId,
      };
      let userId = (req as any)?.userInfo?._id;
      let userName = (req as any)?.userInfo?.username;
      const automationSettings = await this.deltaMachineService.getSettingByKey(
        'setting_om_status_automation'
      );
      const omAutomation = automationSettings?.automation?.confirm_unavailable;
      const omAutomationRefundUnavailable =
        automationSettings?.automation?.refund_item_unavailable;
      if (
        omAutomation?.value &&
        status.name === DeltaMachineStatusName.CONFIRMED_UNAVAILABILITY
      ) {
        userId = '';
        userName = UserType.AUTOMATION;
        const dmOrderStatus = await this.deltaMachineService.getStatusByName(
          DeltaMachineStatusName.REFUND_TO_BUYER
        );
        updateData.statusId = dmOrderStatus?._id;
      }
      await this.deltaMachineService.updateAirTableRecordStatus(
        req.params.id,
        updateData.statusId
      );
      await this.deltaMachineService.createActivityLogEvent(
        req.params.id,
        updateData.statusId,
        userId,
        userName
      );
      if (status.name === DeltaMachineStatusName.CONFIRMED_AVAILABILITY) {
        const dmOrderRes = await this.deltaMachineService.getById(
          req.params.id
        );
        const isConfirmed = dmOrderRes?.orderData?.confirmationDate;
        updateData = {
          ...updateData,
          ...{
            confirmationDeadline: getConfirmationDeadline(2),
            'orderData.confirmationDate': isConfirmed
              ? isConfirmed
              : new Date(),
          },
        };
      }
      const updatedOrder = await this.deltaMachineService.update(
        req.params.id,
        updateData
      );
      const result = updatedOrder.result as DeltaMachineOrderDocument;
      if (status.name === DeltaMachineStatusName.CONFIRMED_AVAILABILITY) {
        await this.deltaMachineService.sendWEConfirmedAvailabilityEvent(
          result?.orderId?.toString()
        );
      }
      const [, orderData] = await this.orderService.getOrderDetail(
        result?.orderId
      );
      if (status.name === DeltaMachineStatusName.CONFIRMED_UNAVAILABILITY) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const user = req.userInfo as any;
        const adId = (req as any).userInfo._id;
        if (omAutomation?.value || omAutomationRefundUnavailable?.value) {
          // const nctReason =
          //   await this.deltaMachineService.getSpecificNCTReasons({
          //     displayName: 'item-unavailable',
          //   });
          // reqBody.nctReasonId = (nctReason as NCTReasonsDocument)?._id;
          reqBody.dmoId = req.params.id;
          reqBody.orderId = orderData?.order?.id;
          await this.deltaMachineService.createDmoNCTReason(reqBody, {
            userId: adId,
            nctReasonName: 'item-unavailable',
          });
        }
        if (omAutomation?.value) {
          await this.deltaMachineService.sendWEConfirmedUnAvailabilityEvent(
            result?.orderId?.toString()
          );
        }
        if (omAutomationRefundUnavailable?.value) {
          await this.deltaMachineService.handleBuyerRefund(
            reqBody.orderId,
            reqBody.dmoId,
            user?.role?.canAccessAll,
            user?.username,
            adId
          );
        }
      }
      const [, userData] = await this.userService.getUserInfo(
        orderData?.order?.seller,
        '_id name isKeySeller'
      );
      const duration = Math.floor(
        moment.duration(moment().diff(moment(result?.createdAt))).asDays()
      );
      const webEngageData = {
        'Order ID': result?.orderId,
        'Seller Name': userData?.name,
        Timestamp: result?.updatedAt,
        ConfirmedAfter: duration,
        isKeySeller: userData?.isKeySeller,
      };
      const dateFormat = `${new Date().toISOString().split('.')[0]}+0000`;
      await sendEventData(
        userData?._id,
        'Seller Confirmed Availability',
        dateFormat,
        webEngageData
      );

      res.sendOk(updatedOrder);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };

  applyConfirmationAction = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const allStatuses = await this.deltaMachineService.getStatusList();
      const statusMap: any = (
        allStatuses as unknown as DeltaMachineStatusDocument[]
      ).reduce((acc, cur) => ({ ...acc, [cur.name]: cur.id }), {});

      const action = await this.dmActionsService.get(req.body.actionId);
      let targetStatusId;
      let updateData;
      let userId = (req as any)?.userInfo?._id;
      let userName = (req as any)?.userInfo?.username;
      const userRole = (req as any)?.userInfo?.role;

      const automationSettings = await this.deltaMachineService.getSettingByKey(
        'setting_om_status_automation'
      );
      const omAutomation = automationSettings?.automation?.confirm_unavailable;
      const omAutomationRefundUnavailable =
        automationSettings?.automation?.refund_item_unavailable;
      const dmOrderRes = await this.deltaMachineService.getById(req.params.id);
      switch (action.name) {
        case DmActionsEnum.CONFIRM_AVAILABILITY:
        case DmActionsEnum.CONFIRMED_AVAILABILITY:
          targetStatusId =
            statusMap[DeltaMachineStatusName.CONFIRMED_AVAILABILITY];
          const isConfirmed = dmOrderRes?.orderData?.confirmationDate;
          updateData = {
            confirmationDeadline: getConfirmationDeadline(2),
            'orderData.confirmationDate': isConfirmed
              ? isConfirmed
              : new Date(),
          };
          break;
        case DmActionsEnum.CONFIRM_UNAVAILABILITY:
        case DmActionsEnum.CONFIRMED_UNAVAILABILITY:
          if (omAutomation?.value) {
            targetStatusId = statusMap[DeltaMachineStatusName.REFUND_TO_BUYER];
            userId = '';
            userName = UserType.AUTOMATION;
          } else {
            targetStatusId =
              statusMap[DeltaMachineStatusName.CONFIRMED_UNAVAILABILITY];
          }
          break;
        case DmActionsEnum.REQUEST_REFUND:
          targetStatusId = statusMap[DeltaMachineStatusName.REFUND_TO_BUYER];
          break;
        case DmActionsEnum.BUYER_WITHDRAW:
          targetStatusId = statusMap[DeltaMachineStatusName.BUYER_WITHDRAW];
          break;
        case DmActionsEnum.AWAIT_SHIPPING:
          targetStatusId =
            statusMap[DeltaMachineStatusName.AWAITING_SELLER_TO_SHIP];
          break;
        case DmActionsEnum.AWAIT_PICKUP:
          targetStatusId =
            statusMap[DeltaMachineStatusName.AWAITING_COURIER_TO_PICKUP];
          break;
      }
      await this.deltaMachineService.updateAirTableRecordStatus(
        req.params.id,
        targetStatusId
      );
      await this.deltaMachineService.createActivityLogEvent(
        req.params.id,
        targetStatusId,
        userId,
        userName
      );
      updateData = {
        ...updateData,
        ...{
          statusId: targetStatusId,
        },
      };
      const updatedOrder = await this.deltaMachineService.update(
        req.params.id,
        updateData
      );
      const result = updatedOrder.result as DeltaMachineOrderDocument;
      if (action.name === DmActionsEnum.CONFIRM_AVAILABILITY) {
        await this.deltaMachineService.sendWEConfirmedAvailabilityEvent(
          result?.orderId?.toString()
        );
      }
      if (action.name === DmActionsEnum.REQUEST_REFUND) {
        const adId = (req as any).userInfo._id;
        req.body.dmoId = req.params.id;
        await this.deltaMachineService.createDmoNCTReason(req.body, {
          userId: adId,
          nctReasonName: null,
        });
      }
      if (
        action.name === DmActionsEnum.CONFIRM_UNAVAILABILITY ||
        action.name === DmActionsEnum.CONFIRMED_UNAVAILABILITY
      ) {
        if (omAutomation?.value || omAutomationRefundUnavailable?.value) {
          const adId = (req as any).userInfo._id;
          req.body.dmoId = req.params.id;
          req.body.orderId = result.orderId;
          await this.deltaMachineService.createDmoNCTReason(req.body, {
            userId: adId,
            nctReasonName: 'item-unavailable',
          });
        }
        if (omAutomation?.value) {
          await this.deltaMachineService.sendWEConfirmedUnAvailabilityEvent(
            result?.orderId?.toString()
          );
        }
        if (omAutomationRefundUnavailable?.value) {
          await this.deltaMachineService.handleBuyerRefund(
            dmOrderRes.orderId,
            dmOrderRes.id,
            userRole?.canAccessAll,
            userName,
            userId
          );
        }
      }
      res.sendOk(updatedOrder);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };

  applyDeliveryAction = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const allStatuses = await this.deltaMachineService.getStatusList();
      const statusMap: any = (
        allStatuses as unknown as DeltaMachineStatusDocument[]
      ).reduce((acc, cur) => ({ ...acc, [cur.name]: cur.id }), {});

      const action = await this.dmActionsService.get(req.body.actionId);
      let targetStatusId;
      let updateData;
      const dmOrderRes = await this.deltaMachineService.getById(req.params.id);

      switch (action.name) {
        case DmDeliveryActionsEnum.DELIVERED:
          targetStatusId = statusMap[DeltaMachineStatusName.ITEM_DELIVERED];
          const isDelivered = dmOrderRes?.orderData?.deliveryDate;
          updateData = {
            'orderData.deliveryDate': isDelivered ? isDelivered : new Date(),
          };
          break;
        case DmDeliveryActionsEnum.BACKLOG_INTRANSIT:
          targetStatusId = statusMap[DeltaMachineStatusName.BACKLOG_IN_TRANSIT];
          break;
        case DmDeliveryActionsEnum.LOST_SHIPMENT:
          targetStatusId = statusMap[DeltaMachineStatusName.LOST_SHIPMENT];
          break;
        case DmDeliveryActionsEnum.REQUEST_PAYOUT:
          targetStatusId = statusMap[DeltaMachineStatusName.PAYOUT_TO_SELLER];
          break;
        case DmDeliveryActionsEnum.DISPUTE_RAISE:
          targetStatusId = statusMap[DeltaMachineStatusName.DISPUTED];
          const isDisputed = dmOrderRes?.orderData?.disputeDate;
          updateData = {
            'orderData.disputeDate': isDisputed ? isDisputed : new Date(),
          };
          break;
        case DmDeliveryActionsEnum.SOUM_DELIVERED:
          targetStatusId =
            statusMap[DeltaMachineStatusName.DELIVERED_SOUM_PRODUCT];
          break;
      }
      await this.deltaMachineService.updateAirTableRecordStatus(
        req.params.id,
        targetStatusId
      );
      await this.deltaMachineService.createActivityLogEvent(
        req.params.id,
        targetStatusId,
        (req as any).userInfo._id,
        (req as any).userInfo.username
      );
      updateData = {
        ...updateData,
        ...{
          statusId: targetStatusId,
        },
      };
      const updatedOrder = await this.deltaMachineService.update(
        req.params.id,
        updateData
      );
      const result = updatedOrder.result as DeltaMachineOrderDocument;
      if (
        normalize(action.name) === normalize(DmDeliveryActionsEnum.DELIVERED)
      ) {
        await this.deltaMachineService.sendWEConfirmedDeliveryEvent(
          result?.orderId?.toString()
        );
      }
      if (
        normalize(action.name) ===
        normalize(DmDeliveryActionsEnum.REQUEST_PAYOUT)
      ) {
        await this.deltaMachineService.sendWEConfirmedPayoutEvent(
          result?.orderId?.toString()
        );
        this.deltaMachineService.addPayoutInvoiceJob(result?.orderId);
      }
      if (
        normalize(action.name) ===
        normalize(DmDeliveryActionsEnum.DISPUTE_RAISE)
      ) {
        await this.deltaMachineService.sendWEDisputeRaisedEvent(
          result?.orderId?.toString()
        );
      }
      res.sendOk(updatedOrder);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };

  listNCTReasons = async (req: Request, res: Response) => {
    try {
      const result = await this.deltaMachineService.getNCTReasonList();
      res.sendOk(result, 'Get list of NCT reason successful');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_LIST_NCT_REASONS,
            exception.message
          )
        );
      }
    }
  };
  getNCTReasonByOrderId = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_NCT_REASON_BY_ORDER_ID,
            JSON.stringify(errors.array())
          )
        );
      }
      const orderId = req.params?.orderId.toString() || '';
      const dmoNCTReason =
        await this.deltaMachineService.findDmoNCTReasonByOrderId(orderId);
      const nctReasons = await this.deltaMachineService.getNCTReasonList();
      const nctReasonData = (nctReasons as NCTReasonsDocument[]).find(
        nctReason =>
          nctReason.toObject().id ===
          (dmoNCTReason?.nctReasonId || '').toString()
      );
      res.sendOk(nctReasonData, 'Get NCT reason by order id successful');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_NCT_REASON_BY_ORDER_ID,
            exception.message
          )
        );
      }
    }
  };

  updateNCTReason = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO_NCT_REASONS,
            JSON.stringify(errors.array())
          )
        );
      }
      const result = await this.deltaMachineService.updateDmoNCTReason({
        id: req.params.id,
        nctReasonId: req.body.nctReasonId,
      });
      return res.sendOk(result, 'Update NCT reason successful');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO_NCT_REASONS,
            exception.message
          )
        );
      }
    }
  };
  applyShippingAction = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const allStatuses = await this.deltaMachineService.getStatusList();
      const statusMap: any = (
        allStatuses as unknown as DeltaMachineStatusDocument[]
      ).reduce((acc, cur) => ({ ...acc, [cur.name]: cur.id }), {});
      const action = await this.dmActionsService.get(req.body.actionId);
      const dmOrderRes = await this.deltaMachineService.getById(req.params.id);
      let targetStatusId;
      let updateData;
      let isShipped;
      switch (action.name) {
        case DmActionsEnum.CONFIRM_DROPOFF:
          targetStatusId = statusMap[DeltaMachineStatusName.IN_TRANSIT];
          isShipped = dmOrderRes?.orderData?.shippingDate;
          updateData = {
            'orderData.shippingDate': isShipped ? isShipped : new Date(),
          };
          break;
        case DmActionsEnum.REQUEST_REFUND:
          targetStatusId = statusMap[DeltaMachineStatusName.REFUND_TO_BUYER];
          break;
        case DmActionsEnum.BACKLOG_SHIPPING:
          targetStatusId =
            statusMap[DeltaMachineStatusName.BACKLOG_AWAITING_SELLER_TO_SHIP];
          break;
        case DmActionsEnum.BUYER_WITHDRAW:
          targetStatusId = statusMap[DeltaMachineStatusName.BUYER_WITHDRAW];
          break;
        case DmActionsEnum.CONVERT_TO_PICKUP:
          targetStatusId =
            statusMap[DeltaMachineStatusName.AWAITING_COURIER_TO_PICKUP];
          break;
        case DmActionsEnum.CONFIRM_PICKUP:
          targetStatusId = statusMap[DeltaMachineStatusName.PICKED_UP];
          updateData = {
            'orderData.shippingDate': isShipped ? isShipped : new Date(),
          };
          break;
        case DmActionsEnum.BACKLOG_PICKUP:
          targetStatusId =
            statusMap[
              DeltaMachineStatusName.BACKLOG_AWAITING_COURIER_TO_PICK_UP
            ];
          break;
        case DmActionsEnum.CONVERT_TO_DROPOFF:
          targetStatusId =
            statusMap[DeltaMachineStatusName.AWAITING_SELLER_TO_SHIP];
          break;
        case DmActionsEnum.CONFIRM_DELIVERY:
          targetStatusId = statusMap[DeltaMachineStatusName.ITEM_DELIVERED];
          break;
      }
      await this.deltaMachineService.updateAirTableRecordStatus(
        req.params.id,
        targetStatusId
      );
      await this.deltaMachineService.createActivityLogEvent(
        req.params.id,
        targetStatusId,
        (req as any).userInfo._id,
        (req as any).userInfo.username
      );
      updateData = {
        ...updateData,
        statusId: targetStatusId,
      };
      const updatedOrder = await this.deltaMachineService.update(
        req.params.id,
        updateData
      );
      if (
        action.name === DmActionsEnum.CONFIRM_DROPOFF ||
        action.name === DmActionsEnum.CONFIRM_PICKUP
      ) {
        const result = updatedOrder.result as DeltaMachineOrderDocument;
        await this.deltaMachineService.sendWEConfirmDropOffEvent(
          result?.orderId?.toString()
        );
      }
      if (action.name === DmActionsEnum.REQUEST_REFUND) {
        const adId = (req as any).userInfo._id;
        req.body.dmoId = req.params.id;
        await this.deltaMachineService.createDmoNCTReason(req.body, {
          userId: adId,
          nctReasonName: null,
        });
      }
      if (action.name === DmActionsEnum.CONFIRM_DELIVERY) {
        const result = updatedOrder.result as DeltaMachineOrderDocument;
        await this.deltaMachineService.sendWEConfirmDeliveryEvent(
          result?.orderId?.toString()
        );
      }
      res.sendOk(updatedOrder);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };
  applyDisputeAction = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const allStatuses = await this.deltaMachineService.getStatusList();
      const statusMap: any = (
        allStatuses as unknown as DeltaMachineStatusDocument[]
      ).reduce((acc, cur) => ({ ...acc, [cur.name]: cur.id }), {});
      const reqBody = req.body;
      const action = await this.dmActionsService.get(reqBody.actionId);
      let targetStatusId;
      const userId = (req as any)?.userInfo?._id;
      const userName = (req as any)?.userInfo?.username;
      switch (action.name) {
        case DmActionsEnum.INVALID_DISPUTE:
          targetStatusId = statusMap[DeltaMachineStatusName.INVALID_DISPUTE];
          break;
        case DmActionsEnum.CONFIRM_UNAVAILABILITY:
        case DmActionsEnum.CONFIRMED_UNAVAILABILITY:
        case DmActionsEnum.REQUEST_REFUND:
          targetStatusId = statusMap[DeltaMachineStatusName.REFUND_TO_BUYER];
          break;
        case DmActionsEnum.VALID_DISPUTE:
          targetStatusId = statusMap[DeltaMachineStatusName.VALID_DISPUTE];
          break;
        case DmActionsEnum.CANCEL_DISPUTE:
        case DmActionsEnum.RESOLVED_WITHOUT_RETURN:
          targetStatusId = statusMap[DeltaMachineStatusName.ITEM_DELIVERED];
          break;
        case DmActionsEnum.RETURN_IN_TRANSIT:
          targetStatusId = statusMap[DeltaMachineStatusName.RETURN_IN_TRANSIT];
          break;
        case DmActionsEnum.REQUEST_PAYOUT:
          targetStatusId = statusMap[DeltaMachineStatusName.PAYOUT_TO_SELLER];
          break;
        case DmActionsEnum.RETURNED:
          targetStatusId = statusMap[DeltaMachineStatusName.RETURNED];
          break;
      }
      await this.deltaMachineService.updateAirTableRecordStatus(
        req.params.id,
        targetStatusId
      );
      await this.deltaMachineService.createActivityLogEvent(
        req.params.id,
        targetStatusId,
        userId,
        userName
      );
      const updateData = {
        statusId: targetStatusId,
      };
      const updatedOrder = await this.deltaMachineService.update(
        req.params.id,
        updateData
      );
      const result = updatedOrder.result as DeltaMachineOrderDocument;
      if (action.name === DmActionsEnum.CONFIRM_AVAILABILITY) {
        await this.deltaMachineService.sendWEConfirmedAvailabilityEvent(
          result?.orderId?.toString()
        );
      }
      if (action.name === DmActionsEnum.INVALID_DISPUTE) {
        await this.deltaMachineService.sendWEDisputeEvent(
          result?.orderId?.toString(),
          false
        );
      }
      if (action.name === DmActionsEnum.VALID_DISPUTE) {
        await this.deltaMachineService.sendWEDisputeEvent(
          result?.orderId?.toString(),
          true
        );
      }
      if (action.name === DmActionsEnum.RETURN_IN_TRANSIT) {
        await this.deltaMachineService.sendWEDisputeActionEvent(
          result?.orderId?.toString(),
          'OM - Seller - Return Intransit',
          'OM - Buyer - Return Intransit'
        );
      }
      if (action.name === DmActionsEnum.RETURNED) {
        await this.deltaMachineService.sendWEDisputeActionEvent(
          result?.orderId?.toString(),
          'OM - Seller - Returned',
          'OM - Buyer - Returned'
        );
        this.deltaMachineService.addCreditNotesJob(result?.orderId);
      }
      if (action.name === DmActionsEnum.REQUEST_PAYOUT) {
        this.deltaMachineService.addPayoutInvoiceJob(result?.orderId);
      }
      if (action.name === DmActionsEnum.REQUEST_REFUND) {
        const adId = (req as any).userInfo._id;
        reqBody.dmoId = req.params.id;
        await this.deltaMachineService.createDmoNCTReason(reqBody, {
          userId: adId,
          nctReasonName: null,
        });
      }
      if (
        action.name === DmActionsEnum.CONFIRM_UNAVAILABILITY ||
        action.name === DmActionsEnum.CONFIRMED_UNAVAILABILITY
      ) {
        const adId = (req as any).userInfo._id;
        reqBody.dmoId = req.params.id;
        reqBody.orderId = result.orderId;
        await this.deltaMachineService.createDmoNCTReason(reqBody, {
          userId: adId,
          nctReasonName: 'item-unavailable',
        });
      }
      res.sendOk(updatedOrder);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };

  applyBacklogAction = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const allStatuses = await this.deltaMachineService.getStatusList();
      const statusMap: any = (
        allStatuses as unknown as DeltaMachineStatusDocument[]
      ).reduce((acc, cur) => ({ ...acc, [cur.name]: cur.id }), {});
      const action = await this.dmActionsService.get(req.body.actionId);
      let targetStatusId;
      let updateData;
      const dmOrderRes = await this.deltaMachineService.getById(req.params.id);
      switch (action.name) {
        case DmActionsEnum.REQUEST_REFUND:
          targetStatusId = statusMap[DeltaMachineStatusName.REFUND_TO_BUYER];
          break;
        case DmActionsEnum.DELIVERED:
          targetStatusId = statusMap[DeltaMachineStatusName.ITEM_DELIVERED];
          const isDelivered = dmOrderRes?.orderData?.deliveryDate;
          updateData = {
            'orderData.deliveryDate': isDelivered ? isDelivered : new Date(),
          };
          break;
        case DmActionsEnum.CONFIRM_DROPOFF:
        case DmActionsEnum.CONFIRM_PICKUP:
          targetStatusId = statusMap[DeltaMachineStatusName.IN_TRANSIT];
          const isShipped = dmOrderRes?.orderData?.shippingDate;
          updateData = {
            'orderData.shippingDate': isShipped ? isShipped : new Date(),
          };
          break;
        case DmActionsEnum.REQUEST_PAYOUT:
          targetStatusId = statusMap[DeltaMachineStatusName.PAYOUT_TO_SELLER];
          break;
        case DmActionsEnum.REFUND_HOLD:
          targetStatusId = statusMap[DeltaMachineStatusName.REFUND_HOLD];
          break;
      }
      await this.deltaMachineService.updateAirTableRecordStatus(
        req.params.id,
        targetStatusId
      );
      await this.deltaMachineService.createActivityLogEvent(
        req.params.id,
        targetStatusId,
        (req as any).userInfo._id,
        (req as any).userInfo.username
      );
      updateData = {
        ...updateData,
        statusId: targetStatusId,
      };
      const updatedOrder = await this.deltaMachineService.update(
        req.params.id,
        updateData
      );
      let result = updatedOrder.result as DeltaMachineOrderDocument;
      if (
        action.name === DmActionsEnum.CONFIRM_DROPOFF ||
        action.name === DmActionsEnum.CONFIRM_PICKUP
      ) {
        result = updatedOrder.result as DeltaMachineOrderDocument;
        await this.deltaMachineService.sendWEConfirmDropOffEvent(
          result?.orderId?.toString()
        );
      }
      if (action.name === DmActionsEnum.REQUEST_REFUND) {
        const adId = (req as any).userInfo._id;
        req.body.dmoId = req.params.id;
        await this.deltaMachineService.createDmoNCTReason(req.body, {
          userId: adId,
          nctReasonName: null,
        });
      }
      if (action.name === DmActionsEnum.REQUEST_PAYOUT) {
        this.deltaMachineService.addPayoutInvoiceJob(result?.orderId);
      }
      res.sendOk(updatedOrder);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };
  checkActiveOrdersExistence = async (req: Request, res: Response) => {
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
      const result = await this.deltaMachineService.checkActiveDMOrders(
        req.body.userId,
        parseInt(req.body.productsCount)
      );

      return res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_DELETE_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const result = await this.deltaMachineService.delete(req.params.id);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_DELETE_DMO,
            exception.message
          )
        );
      }
    }
  };

  getStatusByOrderId = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
            JSON.stringify(errors.array())
          )
        );
      }
      const orderId = req.params?.orderId.toString() || '';
      const dmOrders = await this.deltaMachineService.findDMOrdersById([
        orderId,
      ]);
      if (!dmOrders?.length) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS
          )
        );
      }
      const statuses = await this.deltaMachineService.getStatusList();
      const status = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.toObject().id === dmOrders[0].statusId.toString()
      );
      res.sendOk(status);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
            exception.message
          )
        );
      }
    }
  };

  listStatuses = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
            JSON.stringify(errors.array())
          )
        );
      }
      const submodule = req.query?.submodule?.toString() || '';
      const result = await this.deltaMachineService.getStatusList(submodule);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
            exception.message
          )
        );
      }
    }
  };

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
      if (!isValidIBAN(req.body.iban)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.INVALID_IBAN_FORMAT,
            'Invalid IBAN'
          )
        );
      }
      const editPayoutInput: UpdatePayoutOrderInput = {
        order_id: req.params.orderId,
        commission: Number(req.body.commission),
        bank_name: req.body.bankName,
        iban: req.body.iban,
        accountName: req.body.accountName,
      };
      const data = await this.deltaMachineService.updatePayoutOrderInfo(
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

  updatePayoutCreditCommission = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_VALIDATE_REQUEST_UPDATE_PAYOUT_CREDIT_COMMISSION,
            JSON.stringify(errors.array())
          )
        );
      }
      const editPayoutInput: UpdatePayoutOrderInput = {
        order_id: req.params.orderId,
        commission: req.body.commission,
      };
      const data = await this.deltaMachineService.updatePayoutCreditCommission(
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PAYOUT_CREDIT_COMMISSION,
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
      const orderId: string = req.params.orderId;
      const data = await this.deltaMachineService.getPayoutOrderInfo(orderId);
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
  payoutOrderHyperSplit = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_MAKE_PAYOUT_SELLER,
            JSON.stringify(errors.array())
          )
        );
      }
      const orderId = req.params.orderId;
      const netAmountSeller = req.body.grandTotal;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const user = req.userInfo as any;
      const adName = user?.username;
      const roleObj = user?.role;
      const isDonePayoutOrRefund =
        await this.deltaMachineService.isDonePayoutOrRefund(
          orderId,
          roleObj?.canAccessAll
        );
      if (isDonePayoutOrRefund) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.LIMIT_PAYOUT_REFUND_FOR_ORDER,
            Constants.MESSAGE.LIMIT_PAYOUT_REFUND_FOR_ORDER
          )
        );
      }
      const adId = (req as any).userInfo._id;
      const [err, data] = await this.deltaMachineService.payoutOrderHyperSplit(
        adId,
        orderId,
        netAmountSeller,
        adName
      );
      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            data.result.toString(),
            data.message
          )
        );
      }
      // trigger activity log
      await this.deltaMachineService.createActivityLogPayoutRefundEvent(
        (req as any).userInfo._id,
        (req as any).userInfo.username,
        orderId,
        data.result.transactionStatus
      );
      const orders = await this.orderService.findOrdersById([orderId]);
      const orderData = this.deltaMachineService.populateOrdersData(orders[0]);
      const sellerWebEngageData = {
        'Product ID': orderData?.productId,
        'Seller ID': orderData?.sellerId,
        'Seller Phone Number': orderData?.sellerPhone,
        'Order ID': orderId,
        'Order Number': orderData?.orderNumber,
        'Payout Amount': netAmountSeller,
        'Product Name': orderData?.productName,
      };
      const buyerWebEngageData = {
        'Product ID': orderData?.productId,
        'Seller ID': orderData?.buyerId,
        'Seller Phone Number': orderData?.buyerPhone,
        'Order ID': orderId,
        'Order Number': orderData?.orderNumber,
        'Payout Amount': netAmountSeller,
        'Product Name': orderData?.productName,
      };
      const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
      await sendEventData(
        orderData?.sellerId,
        'Order Paid Out',
        dateFormat,
        sellerWebEngageData
      );
      await sendEventData(
        orderData?.buyerId,
        'Order Paid Out - Buyer',
        dateFormat,
        buyerWebEngageData
      );
      this.deltaMachineService.addPayoutInvoiceJob(orderId);
      const dmOrder = await this.deltaMachineService.getDMOrderByOrderId(
        orderId
      );
      let updateData = {
        'orderData.isQuickPayout': false,
      };
      if (req?.body?.isQuickPayout) {
        updateData = {
          'orderData.isQuickPayout': true,
        };
      } else {
        const transferSettings = await this.deltaMachineService.getSettingByKey(
          'setting_om_status_automation'
        );
        if (
          transferSettings?.automation?.setting_payout_status_change_automation
            ?.value
        ) {
          await this.deltaMachineService.updateOrderToTransferStatus(dmOrder);
        }
      }
      await this.deltaMachineService.update(dmOrder.id, updateData); // ToDo send update call to OM 2.0
      return res.sendOk(data.result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_MAKE_PAYOUT_SELLER,
            exception.message
          )
        );
      }
    }
  };

  refundPayment = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_MAKE_PAYOUT_SELLER,
            JSON.stringify(errors.array())
          )
        );
      }
      const orderId = req.params.orderId;
      const paymentMethod = (req.body.paymentMethod || '').toLowerCase();
      const amountBuyer = req.body.amount;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const user = req.userInfo as any;
      if (paymentMethod === PaymentMethod.InstantRefund.toLowerCase()) {
        if (!req.body.bankId || !isValidObjectId(req.body.bankId)) {
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.INVALID_BANK_BANK_ID
            )
          );
        }
        if (!req.body.accountName) {
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.INVALID_ACCOUNT_NAME
            )
          );
        }
        if (!isValidIBAN(req.body.iban)) {
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.INVALID_IBAN_FORMAT
            )
          );
        }
        const dmOrder = await this.deltaMachineService.getDMOrderByOrderId(
          orderId
        );
        try {
          const result = await this.deltaMachineService.handleBuyerRefund(
            orderId,
            dmOrder.id,
            user?.role?.canAccessAll,
            user?.username,
            (req as any).userInfo._id,
            amountBuyer,
            req.body.accountName,
            req.body.iban,
            req.body.bankId
          );
          if (result instanceof ErrorResponseDto) {
            return res.sendError(result);
          }
          // ToDo send update call to OM 2.0
          return res.sendOk(result);
        } catch (err) {
          return res.sendError(err);
        }
      }
      if (paymentMethod === PaymentMethod.Reversal) {
        const adName = user?.username;
        const roleObj = user?.role;
        const adId = (req as any).userInfo._id;
        const order = await this.deltaMachineService.getDetailsOfOrder(orderId);
        const isDonePayoutOrRefund =
          await this.deltaMachineService.isDonePayoutOrRefund(
            orderId,
            roleObj?.canAccessAll
          );
        if (isDonePayoutOrRefund) {
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.LIMIT_PAYOUT_REFUND_FOR_ORDER,
              Constants.MESSAGE.LIMIT_PAYOUT_REFUND_FOR_ORDER
            )
          );
        }
        const refundOrderDto: RefundOrderDto = {
          orderId: orderId,
          refundAmount: Number(req.body.amount),
          refundMethod: PaymentMethod.Reversal,
        };
        const [err, data] = await this.deltaMachineService.refundOrder(
          refundOrderDto,
          adId,
          adName
        );
        if (err) {
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              data.result.toString(),
              data.message
            )
          );
        } else {
          // Cancel seller credit transaction
          await this.deltaMachineService.cancelCreditTransaction(order);
          const orders = await this.orderService.findOrdersById([orderId]);
          const orderData = this.deltaMachineService.populateOrdersData(
            orders[0]
          );
          const webEngageData = {
            'Product ID': orderData?.productId,
            'Buyer ID': orderData?.buyerId,
            'Buyer Phone Number': orderData?.buyerPhone,
            'Order ID': orderId,
            'Order Number': orderData?.orderNumber,
            'Refund Amount': amountBuyer,
            'Product Name': orderData?.productName,
          };
          const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
          await sendEventData(
            orderData?.buyerId,
            'Order Refunded',
            dateFormat,
            webEngageData
          );
          return res.sendOk(data.result);
        }
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_MAKE_PAYOUT_SELLER,
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
      const orderId: string = req.params.orderId;
      const userType: UserType = req.query.type.toString() as UserType;
      const [err, data] = await this.deltaMachineService.getOrderInfo(
        orderId,
        userType
      );
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            data.message
          )
        );
      }
      type DataToSend = {
        [key: string]: any; // 👈️ variable key
      };
      const isSuccessPayout =
        await this.deltaMachineService.getSuccessPayoutRefundTransaction(
          orderId,
          'Payout',
          'Transfer'
        );
      const isSuccessRefund =
        await this.deltaMachineService.getSuccessPayoutRefundTransaction(
          orderId,
          'Refund',
          'Instant Refund'
        );
      const isSuccessReversal =
        await this.deltaMachineService.getSuccessPayoutRefundTransaction(
          orderId,
          'Refund',
          'Reversal'
        );
      let isSuccessRefundToWallet = false;
      let isSuccessPayoutToWallet = false;
      const creditTransactions: any = await GetCreditsByOrderIds({
        orderIds: [orderId],
      });
      if (creditTransactions.data) {
        creditTransactions.data.forEach((element: any) => {
          if (
            element.ownerId == data.order.buyer._id.toString() &&
            element.status === 'Success'
          ) {
            isSuccessRefundToWallet = true;
          }
          if (
            element.ownerId == data.order.seller._id.toString() &&
            element.status === 'Success'
          ) {
            isSuccessPayoutToWallet = true;
          }
        });
      }
      const dmOrders = await this.deltaMachineService.findDMOrdersById([
        orderId,
      ]);
      if (userType === UserType.BUYER) {
        const cancellationFee = dmOrders?.[0]?.orderData?.cancellationFee || 0;
        let refundAmountToPay = data?.order?.grand_total;
        if (dmOrders?.[0]?.orderData?.isReservation) {
          refundAmountToPay = data?.order?.reservation?.reservationAmount;
        }
        if (dmOrders?.[0]?.orderData?.isFinancing) {
          const dmStatus = await this.deltaMachineService.getStatusById(
            dmOrders?.[0]?.statusId
          );
          if (
            [
              DeltaMachineStatusName.NEW_ORDER,
              DeltaMachineStatusName.WAITING_FOR_APPROVAL,
              DeltaMachineStatusName.REJECTED_BY_FINANCE_COMPANY,
              DeltaMachineStatusName.APPROVED_BY_FINANCE_COMPANY,
            ].find(val => val === dmStatus.name)
          ) {
            refundAmountToPay = 0;
          } else {
            refundAmountToPay = data?.order?.reservation?.reservationAmount;
          }
        }
        const refundAmountWithFeeToPay = formatPriceInDecimalPoints(
          (refundAmountToPay || 0) - cancellationFee
        );
        const dataToSend: DataToSend = {
          paymentMethods: this.deltaMachineService.getPaymentMethodSuggestion(
            data.order.order_date,
            data.order.paymentType
          ),
          refundAmmountToPay: refundAmountWithFeeToPay,
          buyerPaymentMethod: data.order.paymentType,
          grandTotalForBuyer: data.order.grand_total,
          cancellationFee,
          refundAmountWithFeeToPay,
          orderDate: data.order.order_date,
          shippingCharges: data.order.delivery_fee,
          deliveryFee: data.order.delivery_fee,
          sellPrice: parseFloat((data.order.sell_price || 0).toFixed(2)),
          buyerCommision: data.order.commission,
          discountTotal: data.order.sell_discount,
          vat: data.order.vat,
          isSuccessPayout: isSuccessPayout,
          isSuccessRefund: isSuccessRefund,
          isSuccessReversal: isSuccessReversal,
          isSuccessRefundToWallet: isSuccessRefundToWallet,
          isSuccessPayoutToWallet: isSuccessPayoutToWallet,
          bankDetail: await this.deltaMachineService.getIBANInfo(
            data?.order?.buyer?._id
          ),
          walletDetail: await this.deltaMachineService.getWalletInfo(
            data?.order?.buyer?._id,
            orderId,
            userType
          ),
          sellerWalletDetail: await this.deltaMachineService.getWalletInfo(
            data?.order?.seller?._id,
            orderId,
            userType
          ),
          seller: data.order.seller,
          buyer: data.order.buyer,
          listingFee: data.order.listingFee,
          captureStatus: dmOrders[0].captureStatus,
          reservation: data?.order?.reservation,
          isQuickPayout: dmOrders[0].orderData?.isQuickPayout || false,
        };
        logger.info(dataToSend);
        return res.sendOk(dataToSend);
      } else {
        const dataToSend: DataToSend = {
          paymentAmoutToPay: data.order.grand_total,
          baseBuyPrice: parseFloat((data.order.sell_price || 0).toFixed(2)),
          sellerCommisionAmount: data.order.commission,
          discount: data.order.commission_discount,
          shippingCharges: data.order.shipping_charge,
          vat: data.order.vat,
          grandTotalForSeller: data.order.grand_total,
          sellerCommission: data.order.setting_commission,
          isSuccessPayout: isSuccessPayout,
          isSuccessRefund: isSuccessRefund,
          isSuccessReversal: isSuccessReversal,
          isSuccessRefundToWallet: isSuccessRefundToWallet,
          isSuccessPayoutToWallet: isSuccessPayoutToWallet,
          bankDetail: await this.deltaMachineService.getIBANInfo(
            data?.order?.seller?._id
          ),
          walletDetail: await this.deltaMachineService.getWalletInfo(
            data?.order?.seller?._id,
            orderId,
            userType
          ),
          seller: data.order.seller,
          buyer: data.order.buyer,
          isQuickPayout: dmOrders[0].orderData?.isQuickPayout || false,
        };
        dataToSend.sellerAccountName =
          data.order?.seller?.bankDetail?.accountHolderName;
        if (data.order?.seller?.bankDetail) {
          try {
            dataToSend.sellerBIC = decrypt(
              _get(data.order.seller.bankDetail, 'bankBIC', ''),
              _get(data.order.seller, 'secretKey', '')
            );
            dataToSend.sellerIBAN = decryptIBAN(
              _get(data.order.seller.bankDetail, 'accountId', ''),
              _get(data.order.seller, 'secretKey', '')
            );
          } catch (err) {
            logger.error(err);
          }
        }
        logger.info(dataToSend);
        return res.sendOk(dataToSend);
      }
    } catch (exception) {
      logger.error(exception);
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

  // It creates new statues and updates existing ones
  createStatuses = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
            JSON.stringify(errors.array())
          )
        );
      }
      const result = await this.deltaMachineService.createDmoStatuses(req.body);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
            exception.message
          )
        );
      }
    }
  };

  deleteStatus = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
            JSON.stringify(errors.array())
          )
        );
      }
      const result = await this.deltaMachineService.deleteDmoStatus(
        req.params.id
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
            Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
            exception.message
          )
        );
      }
    }
  };

  createNCTReasons = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_NCT_REASONS_MANUALLY,
            JSON.stringify(errors.array())
          )
        );
      }
      const result = await this.deltaMachineService.createNCTReasons(req.body);
      return res.sendOk(result, 'Create NCT reason successful');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_NCT_REASONS_MANUALLY,
            exception.message
          )
        );
      }
    }
  };

  deleteNCTReason = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_DELETE_NCT_REASON_BY_ID,
            JSON.stringify(errors.array())
          )
        );
      }
      const result = await this.deltaMachineService.deleteNCTReason(
        req.params.id
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
            Constants.ERROR_MAP.FAILED_TO_DELETE_NCT_REASON_BY_ID,
            exception.message
          )
        );
      }
    }
  };

  createDmoNCTReason = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_DMO_NCT_REASON,
            JSON.stringify(errors.array())
          )
        );
      }
      const adId = (req as any).userInfo._id;
      const result = await this.deltaMachineService.createDmoNCTReason(
        req.body,
        {
          userId: adId,
          nctReasonName: null,
        }
      );
      return res.sendOk(result, 'Create DMO NCT reason successful');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_DMO_NCT_REASON,
            exception.message
          )
        );
      }
    }
  };
  importNCTReasons = async (req: Request, res: Response) => {
    try {
      await this.deltaMachineService.importHistoricalDmoNCTReasons(
        req.body as NCTReasonsInputDto[]
      );
      return res.sendOk('Import DMO NCT reasons successful');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPLOAD_HISTORICAL_NCT_REASONS,
            exception.message
          )
        );
      }
    }
  };
  listWhatsappMsgs = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_WAMSG,
            JSON.stringify(errors.array())
          )
        );
      }
      const offset = parseInt(req.query?.offset?.toString()) || 0;
      let limit = parseInt(req.query?.limit?.toString()) || 10;
      if (limit > 30) limit = 30;
      const result = await this.deltaMachineService.getWhatsappMsgs(
        offset,
        limit
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
            Constants.ERROR_MAP.FAILED_TO_GET_WAMSG,
            exception.message
          )
        );
      }
    }
  };
  validateAddSettingInput() {
    return [
      AuthGuardDM,
      body('name')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'name' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('description')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'description' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('type')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'type' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('status')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'status' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
    ];
  }
  addSetting = async (req: Request, res: Response) => {
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

      const settingParams: DeltaMachineSettingInput = {
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        value: req.body.value,
        setting_category: req.body.category,
        status: req.body.status,
        possible_values: req.body.possible_values,
      };
      const [err, result] = await this.deltaMachineService.addSetting(
        settingParams
      );
      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_SETTING,
            result.toString()
          )
        );
      } else {
        return res.sendCreated(result, Constants.MESSAGE.SETTING_ADD_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
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
  getSetting = async (req: Request, res: Response) => {
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
      const nameSetting = req.query.key.toString();
      const data = await this.deltaMachineService.getSettingByKey(nameSetting);
      return res.sendOk(data);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
            exception.message
          )
        );
      }
    }
  };
  updateWhatsappSetting = async (req: Request, res: Response) => {
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
      const data =
        await this.deltaMachineService.updateWhatsAppAutomationSettingByKey(
          (req as any).userInfo._id,
          (req as any).userInfo.username,
          req.body
        );
      return res.sendOk(data);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
            exception.message
          )
        );
      }
    }
  };

  updateCourierAutomationSetting = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
            JSON.stringify(errors.array())
          )
        );
      }
      const data =
        await this.deltaMachineService.updateCourierAutomationSettingByKey(
          (req as any).userInfo._id,
          (req as any).userInfo.username,
          req.body
        );
      return res.sendOk(data);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
            exception.message
          )
        );
      }
    }
  };

  updateOMStatusAutomationSetting = async (req: Request, res: Response) => {
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
      const data =
        await this.deltaMachineService.updateOMAutomationSettingByKey(
          (req as any).userInfo._id,
          (req as any).userInfo.username,
          req.body
        );
      return res.sendOk(data);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
            exception.message
          )
        );
      }
    }
  };

  updateWhatsappSettingKey = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
            JSON.stringify(errors.array())
          )
        );
      }
      const data =
        await this.deltaMachineService.updateWhatsAppAutomationSettingKey(
          req.params.key
        );
      return res.sendOk(data);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
            exception.message
          )
        );
      }
    }
  };

  updatePickupServiceSetting = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
            JSON.stringify(errors.array())
          )
        );
      }
      const request = req as any;
      const data = await this.deltaMachineService.updatePickUpSettingByKey(
        request?.userInfo?._id,
        request?.userInfo?.username,
        request.body
      );
      return res.sendOk(data);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
            exception.message
          )
        );
      }
    }
  };

  awaitingSMSAOrdersAutomation = async (req: Request, res: Response) => {
    try {
      const data = await this.deltaMachineService.getSettingByKey(
        'setting_courier_automation'
      );
      if (data?.smsa?.automationToggle?.value === false) {
        return res.sendOk('Courier setting is OFF');
      }
      const awaitingOrdersStatusesNames = [
        DeltaMachineStatusName.AWAITING_SELLER_TO_SHIP,
        DeltaMachineStatusName.READY_TO_SHIP,
        DeltaMachineStatusName.PICKED_UP,
        DeltaMachineStatusName.NEW_ORDER,
        DeltaMachineStatusName.TO_CONFIRM_AVAILABILITY,
        DeltaMachineStatusName.CONFIRMED_AVAILABILITY,
        DeltaMachineStatusName.BACKLOG_IN_TRANSIT,
        DeltaMachineStatusName.BACKLOG_AWAITING_SELLER_TO_SHIP,
      ];
      const inTransitOrdersStatusesInSMSA = new Set([
        SMSAOrderStatus.PICKED_UP,
        SMSAOrderStatus.ARRIVED_HUB_FACILITY,
        SMSAOrderStatus.COLLECTED_FROM_RETAIL,
        SMSAOrderStatus.DEPARTED_FORM_ORIGIN,
        SMSAOrderStatus.DEPARTED_HUB_FACILITY,
        SMSAOrderStatus.OUT_FOR_DELIVERY,
        SMSAOrderStatus.IN_SMSA_FACILITY,
        SMSAOrderStatus.CUSTOMER_BROKER_CLEARANCE,
        SMSAOrderStatus.IN_TRANSIT,
        SMSAOrderStatus.DEPARTED_ORIGIN_COUNTRY,
        SMSAOrderStatus.AT_SMSA_FACILITY,
        SMSAOrderStatus.PROCESSING_FOR_CONSIGNEE_COLLECTION,
        SMSAOrderStatus.CLEARANCE_DELAY,
        SMSAOrderStatus.CUSTOMS_RELEASED,
        SMSAOrderStatus.DEPARTED_FACILITY,
        SMSAOrderStatus.ARRIVED_HUB_FACILITY,
        SMSAOrderStatus.IN_CLEARANCE_PROCESSING,
        SMSAOrderStatus.SHIPMENT_ON_HOLD,
        SMSAOrderStatus.AWAITING_CONSIGNEE_FOR_COLLECTION,
        SMSAOrderStatus.AT_SMSA_RETAIL_CENTER,
      ]);
      const statuses = await this.deltaMachineService.getStatusList();
      const awaitingOrdersStatuses = (
        statuses as DeltaMachineStatusDocument[]
      ).filter((status: DeltaMachineStatusDocument) =>
        awaitingOrdersStatusesNames.includes(
          status.toObject().name as DeltaMachineStatusName
        )
      );
      const deliveredStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.ITEM_DELIVERED
      );
      const inTransitStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.IN_TRANSIT
      );
      const dmOrders = await this.deltaMachineService.getOrdersByStatus(
        awaitingOrdersStatuses
      );
      const promises = await this.deltaMachineService.trackOrderStatusesInSMSA(
        dmOrders
      );
      await Promise.all(promises).then(async values => {
        values.forEach(async value => {
          if (
            value.orderStatusInSMSA ===
            SMSAOrderStatus.PROOF_OF_DELIVERY_CAPTURED
          ) {
            await this.deltaMachineService.updateStatuses(
              value.dmOrderId,
              deliveredStatus.id
            );
            await this.deltaMachineService.sendWEConfirmDeliveryEvent(
              value?.orderId?.toString()
            );
          } else if (
            inTransitOrdersStatusesInSMSA.has(value.orderStatusInSMSA)
          ) {
            await this.deltaMachineService.updateStatuses(
              value.dmOrderId,
              inTransitStatus.id
            );
            await this.deltaMachineService.sendWEConfirmDropOffEvent(
              value?.orderId?.toString()
            );
          }
        });
      });
      return res.sendOk(dmOrders.length);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };

  inTransitSMSAOrdersAutomation = async (req: Request, res: Response) => {
    try {
      const data = await this.deltaMachineService.getSettingByKey(
        'setting_courier_automation'
      );
      if (data?.smsa?.automationToggle?.value === false) {
        return res.sendOk('Courier setting is OFF');
      }
      const inTransitOrdersStatusesNames = new Set([
        DeltaMachineStatusName.IN_TRANSIT,
      ]);
      const statuses = await this.deltaMachineService.getStatusList();
      const inTransitOrdersStatuses = (
        statuses as DeltaMachineStatusDocument[]
      ).filter(status =>
        inTransitOrdersStatusesNames.has(
          status.toObject().name as DeltaMachineStatusName
        )
      );
      const dmOrders = await this.deltaMachineService.getOrdersByStatus(
        inTransitOrdersStatuses
      );
      const deliveredStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.ITEM_DELIVERED
      );
      const promises = await this.deltaMachineService.trackOrderStatusesInSMSA(
        dmOrders
      );
      await Promise.all(promises).then(async values => {
        values.forEach(async value => {
          if (
            value.orderStatusInSMSA ===
            SMSAOrderStatus.PROOF_OF_DELIVERY_CAPTURED
          ) {
            await this.deltaMachineService.updateStatuses(
              value.dmOrderId,
              deliveredStatus.id
            );
            await this.deltaMachineService.sendWEConfirmDeliveryEvent(
              value?.orderId?.toString()
            );
            await this.deltaMachineService.sendWEConfirmedDeliveryEvent(
              value?.orderId?.toString()
            );
          }
        });
      });
      return res.sendOk(dmOrders.length);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };

  awaitingB1OrdersAutomation = async (req: Request, res: Response) => {
    try {
      const pickedUpStatusObj = await this.deltaMachineService.getStatusByName(
        DeltaMachineStatusName.PICKED_UP
      );
      const awaitingCourierToPickupstatus =
        await this.deltaMachineService.getStatusByName(
          DeltaMachineStatusName.AWAITING_COURIER_TO_PICKUP
        );
      const backlogAwaitingCourierToPickupstatus =
        await this.deltaMachineService.getStatusByName(
          DeltaMachineStatusName.BACKLOG_AWAITING_COURIER_TO_PICK_UP
        );
      const dmOrdersLength =
        await this.deltaMachineService.handleB1StatusAutomation(
          pickedUpStatusObj?.id,
          false,
          [awaitingCourierToPickupstatus, backlogAwaitingCourierToPickupstatus]
        );
      return res.sendOk(dmOrdersLength);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };

  inTransitB1OrdersAutomation = async (req: Request, res: Response) => {
    try {
      const deliveredStatusObj = await this.deltaMachineService.getStatusByName(
        DeltaMachineStatusName.ITEM_DELIVERED
      );
      const statusObj = await this.deltaMachineService.getStatusByName(
        DeltaMachineStatusName.PICKED_UP
      );
      const dmOrdersLength =
        await this.deltaMachineService.handleB1StatusAutomation(
          deliveredStatusObj?.id,
          true,
          [statusObj]
        );
      return res.sendOk(dmOrdersLength);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
            exception.message
          )
        );
      }
    }
  };

  awaitingSellersToShipAutomation = async (req: Request, res: Response) => {
    try {
      const settings = await this.deltaMachineService.getSettingByKey(
        'setting_wa_automation_dmo_phase_1'
      );
      if (settings.whatsapp.seller_extension_whatsapp_message.value === false) {
        return res.sendOk('Seller Extension setting is off');
      }
      const awaitingSellersToShipStatusesNames = new Set([
        DeltaMachineStatusName.AWAITING_SELLER_TO_SHIP,
      ]);
      const statuses = await this.deltaMachineService.getStatusList();
      const awaitingSellersToShipStatuses = (
        statuses as DeltaMachineStatusDocument[]
      ).filter(status =>
        awaitingSellersToShipStatusesNames.has(
          status.toObject().name as DeltaMachineStatusName
        )
      );
      const dmOrders = await this.deltaMachineService.getOrdersByStatus(
        awaitingSellersToShipStatuses
      );
      for (const order of dmOrders) {
        const diffInTime =
          new Date().getTime() - new Date(order.updatedAt).getTime();
        const diffInHours = diffInTime / 3600000;
        if (diffInHours && diffInHours > 18) {
          await this.deltaMachineService.sendAwaitingSellerToShipOutboundMsg(
            order._id,
            order.orderId,
            order.statusId
          );
        }
      }
      res.sendOk(dmOrders.length);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SEND_SHIPMENT_MESSAGE,
            exception.message
          )
        );
      }
    }
  };

  captureOrder = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CAPTURE_ORDER,
            JSON.stringify(errors.array())
          )
        );
      }
      const result = await this.paymentService.handleOrderPayment(
        req.params.orderId,
        '',
        true
      );
      if (result) {
        await this.deltaMachineService.updateCaptureStatus(req.params.orderId);
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
            Constants.ERROR_MAP.FAILED_TO_CAPTURE_ORDER,
            exception.message
          )
        );
      }
    }
  };

  captureAllOrders = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CAPTURE_ORDER,
            JSON.stringify(errors.array())
          )
        );
      }
      const orders = await this.deltaMachineService.findDMOrdersById(
        req.body.orders
      );
      for (const order of orders) {
        if (
          order.captureStatus === DeltaMachineBNPLStatuses.NOT_CAPTURED &&
          order.paymentType
        ) {
          const result = await this.paymentService.handleOrderPayment(
            order.orderId.toString(),
            '',
            true
          );
          if (result) {
            this.deltaMachineService.updateCaptureStatus(
              order.orderId.toString()
            );
          }
        }
      }
      return res.sendOk(true);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CAPTURE_ORDER,
            exception.message
          )
        );
      }
    }
  };

  closeOrder = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CLOSE_ORDER,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = (req.user as any)?.userId;
      const orderId = req.params?.orderId;
      const result = await this.paymentService.closeOrder(orderId, userId);
      if (result) {
        await this.deltaMachineService.updateCaptureStatus(orderId, true);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CLOSE_ORDER,
            ''
          )
        );
      }
      const order = await this.deltaMachineService.getDetailsOfOrder(orderId);
      // Cancel seller credit transaction
      await this.deltaMachineService.cancelCreditTransaction(order);
      return res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CLOSE_ORDER,
            exception.message
          )
        );
      }
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

  getDMStatusGroups = async (req: Request, res: Response) => {
    try {
      const groupName = req.query?.group?.toString() || '';
      const dmStatusGroups = await this.dmStatusGroupService.getDmStatusGroups(
        groupName
      );

      return res.sendOk(dmStatusGroups);
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

  genDMActions = async (req: Request, res: Response) => {
    try {
      const result = await this.dmActionsService.genDMActions(req.body);
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

  getDMActions = async (req: Request, res: Response) => {
    try {
      const statusId = req.query?.statusId?.toString() || '';
      const result = await this.dmActionsService.listAll(statusId);
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

  getSellerTransactionsCount = async (req: Request, res: Response) => {
    try {
      const sellerId = (req.user as any)?.id;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO,
            JSON.stringify(errors.array())
          )
        );
      }
      const completedStatusesNames = new Set([
        DeltaMachineStatusName.TRANSFERRED,
        DeltaMachineStatusName.REFUNDED,
      ]);
      const statuses = await this.deltaMachineService.getStatusList();
      const completedOrdersStatuses = (
        statuses as DeltaMachineStatusDocument[]
      ).filter(status =>
        completedStatusesNames.has(
          status.toObject().name as DeltaMachineStatusName
        )
      );
      const statusIds: string[] = [];
      completedOrdersStatuses.forEach(status => statusIds.push(status.id));
      const dmOrders = await this.deltaMachineService.getOrdersBySellerId(
        sellerId
      );
      let count = 0;
      for (const order of dmOrders) {
        if (statusIds.includes(order?.statusId.toString())) {
          count++;
        }
      }
      res.sendOk(count);
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

  freshchatAutomation = async (req: Request, res: Response) => {
    try {
      await this.deltaMachineService.handleFreshChatAutomation(
        req.body?.userId,
        req.body?.conversationId,
        req.body?.phoneNumber,
        req.body?.messageText
      );
      res.sendOk(true);
    } catch (err) {}
  };

  smsaWebhook = async (req: Request, res: Response) => {
    try {
      const data = await this.deltaMachineService.getSettingByKey(
        'setting_courier_automation'
      );
      if (data?.smsa?.automationToggle?.value) {
        return res.sendOk('Courier setting is ON');
      }
      const awaitingOrdersStatusesNames = [
        DeltaMachineStatusName.AWAITING_SELLER_TO_SHIP,
        DeltaMachineStatusName.READY_TO_SHIP,
        DeltaMachineStatusName.PICKED_UP,
        DeltaMachineStatusName.NEW_ORDER,
        DeltaMachineStatusName.TO_CONFIRM_AVAILABILITY,
        DeltaMachineStatusName.CONFIRMED_AVAILABILITY,
        DeltaMachineStatusName.BACKLOG_IN_TRANSIT,
        DeltaMachineStatusName.BACKLOG_AWAITING_SELLER_TO_SHIP,
      ];
      const inTransitOrdersStatusesInSMSA = new Set([
        SMSAOrderStatus.PICKED_UP,
        SMSAOrderStatus.ARRIVED_HUB_FACILITY,
        SMSAOrderStatus.COLLECTED_FROM_RETAIL,
        SMSAOrderStatus.DEPARTED_FORM_ORIGIN,
        SMSAOrderStatus.DEPARTED_HUB_FACILITY,
        SMSAOrderStatus.OUT_FOR_DELIVERY,
        SMSAOrderStatus.IN_SMSA_FACILITY,
        SMSAOrderStatus.CUSTOMER_BROKER_CLEARANCE,
        SMSAOrderStatus.IN_TRANSIT,
        SMSAOrderStatus.DEPARTED_ORIGIN_COUNTRY,
        SMSAOrderStatus.AT_SMSA_FACILITY,
        SMSAOrderStatus.PROCESSING_FOR_CONSIGNEE_COLLECTION,
        SMSAOrderStatus.CLEARANCE_DELAY,
        SMSAOrderStatus.CUSTOMS_RELEASED,
        SMSAOrderStatus.DEPARTED_FACILITY,
        SMSAOrderStatus.ARRIVED_HUB_FACILITY,
        SMSAOrderStatus.IN_CLEARANCE_PROCESSING,
        SMSAOrderStatus.SHIPMENT_ON_HOLD,
        SMSAOrderStatus.AWAITING_CONSIGNEE_FOR_COLLECTION,
        SMSAOrderStatus.AT_SMSA_RETAIL_CENTER,
      ]);
      const statuses = await this.deltaMachineService.getStatusList();
      const awaitingOrdersStatuses = (
        statuses as DeltaMachineStatusDocument[]
      ).filter((status: DeltaMachineStatusDocument) =>
        awaitingOrdersStatusesNames.includes(
          status.toObject().name as DeltaMachineStatusName
        )
      );
      const deliveredStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.ITEM_DELIVERED
      );
      const deliveredToSoumFC = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.DELIVERED_TO_SOUM_FC
      );
      const validDisputeStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(status => status.name === DeltaMachineStatusName.VALID_DISPUTE);
      const inTransitStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.IN_TRANSIT
      );
      const returnInTransitStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(
        status => status.name === DeltaMachineStatusName.RETURN_IN_TRANSIT
      );
      const returnedStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.RETURNED
      );
      if (req?.body?.PushData?.length) {
        for (const item of req?.body?.PushData) {
          // first mile
          let dmOrder = await this.deltaMachineService.getDMOrderByTrackingNo(
            item.awbNo
          );
          if (!dmOrder) {
            // when customer return order dispute
            dmOrder = await this.deltaMachineService.getDMOrderByTrackingNo(
              item.awbNo,
              true
            );
          }
          if (!dmOrder) {
            // last mile
            dmOrder =
              await this.deltaMachineService.getDMOrderByLastMileTrackingNo(
                item.awbNo
              );
            if (dmOrder?.isRiyadhSpecificPickup) return;

            // delivered to
            if (
              dmOrder &&
              item.statusDesc === SMSAOrderStatus.PROOF_OF_DELIVERY_CAPTURED
            ) {
              await this.deltaMachineService.updateStatusByLastMileTrackingId(
                dmOrder.id,
                item.awbNo,
                deliveredStatus.id
              );
            }
            return;
          }
          if (dmOrder && inTransitOrdersStatusesInSMSA.has(item.statusDesc)) {
            if (
              dmOrder.statusId.toString() === validDisputeStatus.id.toString()
            ) {
              await this.deltaMachineService.updateStatusByTrackingId(
                dmOrder.id,
                item.awbNo,
                returnInTransitStatus.id,
                true
              );
              await this.deltaMachineService.sendWEDisputeActionEvent(
                dmOrder?.orderId?.toString(),
                'OM - Seller - Return Intransit',
                'OM - Buyer - Return Intransit'
              );
            } else if (
              awaitingOrdersStatuses.find(
                status =>
                  dmOrder.statusId?.toString() ===
                  status?.toObject().id?.toString()
              )
            ) {
              await this.deltaMachineService.updateStatusByTrackingId(
                dmOrder.id,
                item.awbNo,
                inTransitStatus.id,
                false,
                true
              );
              await this.deltaMachineService.sendWEConfirmDropOffEvent(
                dmOrder?.orderId?.toString()
              );
            }
          } else if (
            dmOrder &&
            item.statusDesc === SMSAOrderStatus.PROOF_OF_DELIVERY_CAPTURED
          ) {
            if (
              dmOrder.statusId.toString() ===
              returnInTransitStatus.id.toString()
            ) {
              await this.deltaMachineService.updateStatusByTrackingId(
                dmOrder.id,
                item.awbNo,
                returnedStatus.id,
                true
              );
              await this.deltaMachineService.sendWEDisputeActionEvent(
                dmOrder?.orderId?.toString(),
                'OM - Seller - Returned',
                'OM - Buyer - Returned'
              );
            } else if (
              dmOrder.statusId.toString() === inTransitStatus.id.toString()
            ) {
              await this.deltaMachineService.updateStatusByTrackingId(
                dmOrder.id,
                item.awbNo,
                deliveredToSoumFC.id
              );
              await this.deltaMachineService.sendWEConfirmDeliveryEvent(
                dmOrder?.orderId?.toString()
              );
            }
          }
        }
      }
      res.sendOk(null);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DMO,
            exception.message
          )
        );
      }
    }
  };

  relistProduct = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_RELIST_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const adId = (req as any).userInfo._id;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const user = req.userInfo as any;
      const adName = user?.username;
      const dmOrder = await this.deltaMachineService.getById(req.params.id);
      const response = await this.deltaMachineService.relistProduct(
        dmOrder?.orderData.productId,
        dmOrder?.orderId,
        req.params.id,
        adId,
        adName
      );
      res.sendOk(response);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_RELIST_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  sendDailyReportSellerResponse = (req: Request, res: Response) => {
    try {
      this.deltaMachineService.addSellerResponseDailyReportJob();
      return res.sendOk(true);
    } catch (exception) {
      logger.error(exception);
    }
  };

  confirmAvailabilityAutomation = async (req: Request, res: Response) => {
    try {
      const automationSettings = await this.deltaMachineService.getSettingByKey(
        'setting_om_status_automation'
      );
      const omAutomation =
        automationSettings?.automation?.confirm_available?.value || false;

      if (omAutomation) {
        const newStatusObj = await this.deltaMachineService.getStatusByName(
          DeltaMachineStatusName.NEW_ORDER
        );
        const toConfirmStatusObj =
          await this.deltaMachineService.getStatusByName(
            DeltaMachineStatusName.TO_CONFIRM_AVAILABILITY
          );

        const confirmAvailabilityStatusObj =
          await this.deltaMachineService.getStatusByName(
            DeltaMachineStatusName.CONFIRMED_AVAILABILITY
          );
        const orders =
          await this.deltaMachineService.confirmAvailabilityAutomation([
            newStatusObj,
            toConfirmStatusObj,
          ]);

        await Promise.all(
          orders.map(async (order: any) => {
            await this.deltaMachineService.updateAirTableRecordStatus(
              order._id,
              confirmAvailabilityStatusObj.id
            );
            let updateData = {
              statusId: confirmAvailabilityStatusObj.id,
            };
            const userId = order.userId;
            const userName = order.userName;
            await this.deltaMachineService.updateAirTableRecordStatus(
              order._id,
              updateData.statusId
            );
            await this.deltaMachineService.createActivityLogEvent(
              order._id,
              updateData.statusId,
              userId,
              userName
            );

            if (
              confirmAvailabilityStatusObj.name ===
              DeltaMachineStatusName.CONFIRMED_AVAILABILITY
            ) {
              const dmOrderRes = await this.deltaMachineService.getById(
                order._id
              );
              const isConfirmed = dmOrderRes?.orderData?.confirmationDate;
              updateData = {
                ...updateData,
                ...{
                  confirmationDeadline: getConfirmationDeadline(2),
                  'orderData.confirmationDate': isConfirmed
                    ? isConfirmed
                    : new Date(),
                },
              };
            }
            const updatedOrder = await this.deltaMachineService.update(
              order._id,
              updateData
            );
            const result = updatedOrder.result as DeltaMachineOrderDocument;

            if (
              confirmAvailabilityStatusObj.name ===
              DeltaMachineStatusName.CONFIRMED_AVAILABILITY
            ) {
              await this.deltaMachineService.sendWEConfirmedAvailabilityEvent(
                result?.orderId?.toString()
              );
            }
            const [, orderData] = await this.orderService.getOrderDetail(
              result?.orderId
            );
            const [, userData] = await this.userService.getUserInfo(
              orderData?.order?.seller,
              '_id name isKeySeller'
            );
            const duration = Math.floor(
              moment.duration(moment().diff(moment(result?.createdAt))).asDays()
            );
            const webEngageData = {
              'Order ID': result?.orderId,
              'Seller Name': userData?.name,
              Timestamp: result?.updatedAt,
              ConfirmedAfter: duration,
              isKeySeller: userData?.isKeySeller,
            };
            const dateFormat = `${new Date().toISOString().split('.')[0]}+0000`;
            await sendEventData(
              userData?._id,
              'Seller Confirmed Availability',
              dateFormat,
              webEngageData
            );
            return order;
          })
        );

        return res.sendOk(orders);
      } else {
        return res.sendOk('Confirm Availability automation is off.');
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SEND_SHIPMENT_MESSAGE,
            exception.message
          )
        );
      }
    }
  };

  getAWSPresignedUrlForDispute = async (req: Request, res: Response) => {
    try {
      const response =
        await this.deltaMachineService.getAWSPresignedUrlForDispute(
          req.params.userId,
          req.params.dmOrderId,
          req.params.count,
          req.params.extensions
        );
      return res.sendOk(response);
    } catch (exception) {
      res.sendError(exception);
    }
  };

  submitDispute = async (req: Request, res: Response) => {
    try {
      const response = await this.deltaMachineService.submitDispute(
        req.params.dmOrderId,
        req.body.disputeReason,
        req.body.description,
        req.body.images,
        req.body.preferredContactNumber
      );
      return res.sendOk(response);
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_SUBMIT_DISPUTE,
          exception
        )
      );
    }
  };

  getlDisputeData = async (req: Request, res: Response) => {
    try {
      const response = await this.deltaMachineService.getlDisputeData(
        req.params.dmOrderId
      );
      res.sendOk(response);
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DISPUTE,
          exception
        )
      );
    }
  };

  cancelDispute = async (req: Request, res: Response) => {
    try {
      const response = await this.deltaMachineService.cancelDispute(
        req.params.dmOrderId
      );
      res.sendOk(response);
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CANCEL_DISPUTE,
          exception
        )
      );
    }
  };

  getMySalesCount = async (req: Request, res: Response) => {
    try {
      const userId = (req as any)?.userInfo?._id;
      const response = await this.deltaMachineService.getMySalesCount(userId);
      res.sendOk(response);
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_COUNT_LISTINGS,
          exception
        )
      );
    }
  };

  getMySalesProducts = async (req: Request, res: Response) => {
    try {
      const userId = (req as any)?.userInfo?._id;
      const submodule = req?.query?.submodule?.toString() || '';
      const size = req?.query?.size ? +req.query.size : 10;
      const skip = req?.query?.skip ? +req.query.skip : 0;
      const sort = req?.query?.sort?.toString() || 'latest';
      const response = await this.deltaMachineService.getMySalesProducts(
        userId,
        submodule,
        size,
        skip,
        sort
      );
      res.sendOk(response);
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
          exception
        )
      );
    }
  };
  getMyPurchaseProducts = async (req: Request, res: Response) => {
    try {
      const userId = (req as any)?.userInfo?._id;
      const submodule = req?.query?.submodule?.toString() || '';
      const size = req?.query?.size ? +req.query.size : 5;
      const page = req?.query?.page ? +req.query.page : 0;
      const response = await this.deltaMachineService.getMyPurchaseProducts(
        userId,
        submodule,
        size,
        page
      );
      res.sendOk(response);
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
          exception
        )
      );
    }
  };

  replaceOrder = async (req: Request, res: Response) => {
    try {
      let transaction;
      try {
        transaction = await this.paymentService.getTransactionWithOrderId(
          req.params.orderId
        );
      } catch (err) {}
      const response = await this.deltaMachineService.replaceOrder(
        req.params.orderId,
        req.params.replacedProductId,
        transaction
      );
      res.sendOk(response);
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_ORDER,
          exception
        )
      );
    }
  };
}
