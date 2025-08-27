import { Service } from 'typedi';
import moment from 'moment';
import { RefundOrderDto } from '../dto/refund/RefundOrderDto';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { Constants } from '../constants/constant';
import { OrderDocument, OrderRefundStatus } from '../models/Order';
import { RefundDocument } from '../models/Refund';
import { TransactionStatus } from '../enums/TransactionStatus';
import { RefundMethod } from '../enums/RefundMethod';
import {
  checkPaymentStatusCode,
  mapToRefundStatus,
  refundPayment,
} from '../libs/hyperpay';
import {
  generateRandomNumberInRange,
  generateRandomOperationNumber,
} from '../util/common';
import {
  RefundRepository,
  OrderRepository,
  ProductRepository,
} from '../repositories';
import { ProductOrderStatus } from '../enums/ProductStatus.Enum';
import { sendMail } from '../libs/sendgrid';
import { generateRefundOrderSheet } from '../util/sheets/refund.excel';
import { DmoPayoutRefundHistoryRepository } from '../repositories/dmoPayoutRefundHistoryRepository';
import { SettingRepository } from '../repositories/settingRepository';
import { PayoutRefundHistoryInput } from '../models/DmoPayoutRefundHistory';
import {
  createEventLog,
  EventLogRequest,
  EventLogTemplateRequest,
  getTemplateMsgToCreateEventLog,
} from '../util/activityLogs';

@Service()
export class RefundService {
  constructor(
    public refundRepository: RefundRepository,
    public orderRepository: OrderRepository,
    public productRepository: ProductRepository,
    public dmoPayoutRefundHistoryRepository: DmoPayoutRefundHistoryRepository,
    public settingRepository: SettingRepository,
    public error: ErrorResponseDto
  ) {}

  async refundOrder(
    refundOrderDto: RefundOrderDto,
    userId: string,
    userName: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const [orderError, order] = await this.orderRepository.getById(
        refundOrderDto.orderId
      );
      const [refundListError, refunds] =
        await this.refundRepository.getByOrderId(refundOrderDto.orderId);

      if (orderError || refundListError) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_REFUND_ORDER;
        this.error.message = order.message;
        throw this.error;
      }
      const orderInfo = order.result as OrderDocument;

      const [validationError, errorMessage] = await this.validateRefundAction(
        refundOrderDto,
        orderInfo,
        refunds.result as RefundDocument[]
      );
      if (validationError) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_REFUND_ORDER;
        this.error.message = errorMessage;
        throw this.error;
      }
      const [refundCreationError, refundDocument] =
        await this.refundRepository.createRefundAction({
          order: orderInfo._id,
          transaction_id: orderInfo.transaction_id,
          transaction_response: {},
          created_at: new Date(),
          refund_method: refundOrderDto.refundMethod,
          refund_amount: refundOrderDto.refundAmount,
          made_by: userName,
          transaction_timestamp: new Date(),
          refund_soum_number: generateRandomOperationNumber(
            RefundMethod.refund
          ),
          refund_status: TransactionStatus.PENDING,
        } as RefundDocument);
      if (refundCreationError) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = refundDocument.result as string;
        this.error.message = refundDocument.message;
        throw this.error;
      }
      const refundResult: any = await refundPayment(
        orderInfo.transaction_id,
        orderInfo.payment_type,
        refundOrderDto.refundAmount,
        refundOrderDto.refundMethod
      );
      // validate refund status
      const status = checkPaymentStatusCode(refundResult.result as any);
      const refund_status = mapToRefundStatus(status);
      // update refund object
      const [errorRefundUpdate, refundUpdateData] =
        await this.refundRepository.updateRefundAction(
          (refundDocument.result as RefundDocument)._id,
          {
            transaction_id: refundResult.id,
            transaction_response: refundResult,
            transaction_timestamp: refundResult.timestamp,
            refund_status,
          }
        );
      if (errorRefundUpdate) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = refundUpdateData.result as string;
        this.error.message = refundUpdateData.message as string;
        throw this.error;
      }
      // trigger activity log
      await this.createActivityLogRefundEvent(
        userId,
        userName,
        orderInfo._id,
        refund_status,
        refundOrderDto.refundMethod
      );
      // update refunded order
      await this.orderRepository.updateRefundStatus(orderInfo._id, {
        refund: true,
        refund_status: refund_status,
      } as OrderRefundStatus);
      // update refunded product
      if (refund_status == TransactionStatus.COMPLETED) {
        await this.productRepository.changeProductStatus(
          orderInfo.product as any,
          ProductOrderStatus.Refunded
        );
      }
      // add refund history log in dmo
      if (refundOrderDto.refundMethod === 'reversal') {
        const payoutId = await this.generateTransactionIdRefund('refund');
        const paymentLogDmo: PayoutRefundHistoryInput = {
          dmoTransactionId: payoutId,
          orderId: orderInfo._id,
          transactionType: 'Refund',
          transactionStatus: refund_status,
          paymentMethod: 'Reversal',
          amount: refundOrderDto.refundAmount,
          paymentGatewayTransactionId: orderInfo.transaction_id,
          transactionTimestampFromHyperpay: moment(
            refundResult.timestamp
          ).format('DD/MM/YYYY hh:mm:ss A'),
          transactionTimestamp: moment().toISOString(),
          doneBy: userName,
        };
        await this.dmoPayoutRefundHistoryRepository.addPayoutRefundHistory(
          paymentLogDmo
        );
      }
      if (refund_status !== TransactionStatus.COMPLETED) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.UNPROCESSABLE_ENTITY,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MAKE_REFUND_TRANSACTION,
          'Transaction status is ' + refund_status
        );
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: {
            isSuccess: refund_status === TransactionStatus.COMPLETED,
            message: 'Refund action was successfully executed',
          },
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REFUND_ORDER,
          exception.message
        );
      }
    }
  }

  async createActivityLogRefundEvent(
    userId: string,
    username: string,
    orderId: string,
    status: string,
    typeMethod: string
  ) {
    try {
      const eventType = typeMethod?.toLocaleLowerCase()?.includes('refund')
        ? Constants.activity_log_template.REFUND_SUBMITTED
        : Constants.activity_log_template.REVERSAL_SUBMITTED;
      const [, data] = await this.orderRepository.getById(orderId);
      const order = data.result as OrderDocument;
      // get msg template to create log
      const msgPayoutRefundTemplateRequest: EventLogTemplateRequest = {
        eventType: eventType,
        orderNumber: order.order_number,
        transactionStatus: status,
      };
      const msgTemplate = await getTemplateMsgToCreateEventLog(
        msgPayoutRefundTemplateRequest
      );
      const eventLogPayoutRefundRequest: EventLogRequest = {
        eventType: eventType,
        userId: userId,
        username: username,
        orderId: orderId,
        orderNumber: order.order_number,
        value: msgTemplate,
        module: 'payout',
      };
      await createEventLog(eventLogPayoutRefundRequest);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_ACTIVITY_LOG,
          exception
        );
      }
    }
  }

  async validateRefundAction(
    refundOrderDto: RefundOrderDto,
    order: OrderDocument,
    refunds: RefundDocument[]
  ): Promise<[boolean, string]> {
    const totalOrderRefunds = refunds
      .filter(
        (elem: RefundDocument) =>
          elem.refund_status == TransactionStatus.COMPLETED
      )
      .reduce(
        (previousValue, currentValue) =>
          previousValue + currentValue.refund_amount,
        0
      );
    // 0- order Should be successfully
    if (order.transaction_status != 'Success') {
      return [true, Constants.MESSAGE.REFUND_ACTION_ON_SUCCESS_ORDERS_ONLY];
    }
    // 1- order does not have success total refund case before
    else if (
      totalOrderRefunds + refundOrderDto.refundAmount >
      order.grand_total
    ) {
      return [true, Constants.MESSAGE.TOTAL_REFUNDS_ABOVE_ORDER_TOTAL];
    }
    // 2- for stcpay Refund method is unavailable! please notify the buyer to fill out bank details at profile page!
    else if (order.payment_type == 'STC_PAY') {
      return [true, Constants.MESSAGE.STC_REFUND_NOT_AVAILABLE];
    } else if (refundOrderDto.refundMethod == RefundMethod.reversal) {
      // 3- Mada should not accept reversal method
      if (order.payment_type == 'MADA')
        return [true, Constants.MESSAGE.REVERSAL_NOT_APPLY_MADA];
      // 4- reversal method does not accept partial refunds.
      else if (refundOrderDto.refundAmount != order.grand_total)
        return [true, Constants.MESSAGE.REVERSAL_ONLY_FULL_AMOUNT];
      // 5- Reversal method should not be available after 24 hours of a successful transaction
      else if (moment(new Date()).diff(order.created_at, 'days') >= 1)
        return [true, Constants.MESSAGE.REVERSAL_WITHIN_ONE_DAY];
    } else if (refundOrderDto.refundMethod == RefundMethod.refund) {
      // 6-  method should not be available after 3 months of a successful transaction
      if (moment(new Date()).diff(order.created_at, 'month') >= 3)
        return [true, Constants.MESSAGE.REFUND_WITHIN_THREE_MONTHS];
    }
    return [false, ''];
  }

  async sendDailyReport() {
    try {
      const [getErr, getResult] =
        await this.refundRepository.getRefundOrdersWithinPeriod('day', 1);

      if (getErr) {
        this.error.errorCode = getResult.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_GET_REFUND_ORDERS;
        this.error.message = getResult.message;
        return await sendMail({
          to: (process.env.SENDGRID_NOTIFIED_USER as string).split(','),
          subject: '[Alert] Daily refund order summary - Get Data Failed',
          text: getResult.message,
        });
      }

      // Create Excel file
      const title = `refund Orders from ${moment()
        .subtract(1, 'day')
        .format('D-MMM')} to ${moment().format('D-MMM')}`;
      const [genError, sheetContent] = await generateRefundOrderSheet(
        getResult.result as RefundDocument[],
        title
      );

      if (genError) {
        return await sendMail({
          to: (process.env.SENDGRID_NOTIFIED_USER as string).split(','),
          subject:
            '[Alert] Daily refund order summary - Generated Sheet Failed',
          text: JSON.stringify(sheetContent),
        });
      }

      // Send Email
      const sendTo: string =
        process.env.NODE_ENV === 'production'
          ? process.env.SENDGRID_TO_PROD
          : process.env.SENDGRID_TO_DEV;
      const [sendError, sendingResult] = await sendMail({
        to: sendTo.split(','),
        subject: `[Daily Report]- ${title}`,
        // eslint-disable-next-line max-len
        html: '<p>Dear Soum Admin!</p><p> This is auto generated email for <strong>Orders</strong>.</p><p>Thanks in advance</p><p>Tech Team</p>',
        fileName: `summary_refund_orders_${new Date().toDateString()}.xlsx`,
        fileContent: sheetContent,
      });

      return [
        sendError,
        {
          message: Constants.MESSAGE.EMAIL_SENT,
          result: JSON.stringify(sendingResult),
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REFUND_ORDER,
          exception.message
        );
      }
    }
  }

  async createUniqueRandomTransactionNoRefund(
    prefix: string,
    numberOfDigits: number
  ) {
    try {
      let isExist = false;
      const initTransactionNo = generateRandomNumberInRange(
        1,
        9999999
      ).toString();
      const transactionId =
        prefix + (initTransactionNo + '').padStart(numberOfDigits, '0');
      do {
        const [err, data] =
          await this.dmoPayoutRefundHistoryRepository.getExistingTransactionId(
            transactionId
          );
        if (err) {
          this.error.errorCode = data.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = data.toString();
          this.error.message = data.message;
          throw this.error;
        }
        isExist = data.result as boolean;
      } while (isExist);

      return transactionId;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GENERATE_BILL_NO,
          exception.message
        );
      }
    }
  }

  async generateTransactionIdRefund(transactionType: string) {
    try {
      const [err, data] = await this.settingRepository.getSettingByKey(
        'setting_transaction_dmo'
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const setting_transaction_dmo = JSON.parse(data.value);

      if (transactionType === 'refund') {
        const setting_refund = setting_transaction_dmo.refund;
        const number_of_digits =
          setting_refund.transaction_id_length - setting_refund.prefix.length;
        return await this.createUniqueRandomTransactionNoRefund(
          setting_refund.prefix,
          number_of_digits
        );
      }

      return null;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GENERATE_TRANSACTION_ID_DMO,
          exception.message
        );
      }
    }
  }
}
