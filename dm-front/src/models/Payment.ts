import { instanceToPlain } from 'class-transformer';

import { apiClientV2 } from '@/api/client';

enum EPaymentMethod {
  'Instant Refund' = 'Instant Refund',
  'Reverse' = 'Reverse',
}

enum ETransactionType {
  Refund = 'Refund',
  Payout = 'Payout',
}

export enum ETransactionStatus {
  Pending = 'Pending',
  Success = 'Success',
  Fail = 'Fail',
}

export interface IPaymentResponse {
  amount: number;
  createdAt: string;
  dmoTransactionId: string;
  doneBy: string;
  orderId: string;
  orderNumber: string;
  paymentGatewayTransactionId: string;
  paymentMethod: string;
  transactionStatus: string;
  transactionTimestamp: Date;
  transactionType: string;
}

export interface IPayment {
  transactionId: string;
  orderId: string;
  orderNumber: string;
  transactionType: ETransactionType;
  transactionStatus: ETransactionStatus;
  paymentMethod: EPaymentMethod;
  paymentGatewayId: string;
  amount: number;
  date: Date;
  fulfilledBy: string;
}

export const PaymentEndpoints = {
  paymentHistory(orderId: string) {
    return `rest/api/v1/dm-orders/payref/history/${orderId}`;
  },
};

export class Payment {
  static async getPaymentHistory(orderId: string) {
    const result = await apiClientV2.client.get(
      PaymentEndpoints.paymentHistory(orderId)
    );

    return result.data.responseData;
  }

  static mapPaymentHistory(paymentHistory: IPaymentResponse[] = []): Payment[] {
    const mappedPaymentHistory = paymentHistory.map(
      (payment) =>
        new Payment({
          amount: payment?.amount,
          date: payment?.transactionTimestamp,
          transactionId: payment?.dmoTransactionId,
          transactionType: payment?.transactionType as ETransactionType,
          paymentGatewayId: payment?.paymentGatewayTransactionId,
          fulfilledBy: payment?.doneBy,
          paymentMethod: payment?.paymentMethod as EPaymentMethod,
          orderId: payment?.orderId,
          orderNumber: payment?.orderNumber,
          transactionStatus: payment?.transactionStatus as ETransactionStatus,
        })
    );

    return instanceToPlain(mappedPaymentHistory) as Payment[];
  }

  public transactionId: string;
  public orderId: string;
  public orderNumber: string;
  public transactionType: ETransactionType;
  public transactionStatus: ETransactionStatus;
  public paymentMethod: EPaymentMethod;
  public paymentGatewayId: string;
  public amount: number;
  public date: Date;
  public fulfilledBy: string;
  constructor({
    transactionId,
    orderId,
    orderNumber,
    transactionType,
    transactionStatus,
    paymentMethod,
    paymentGatewayId,
    amount,
    date,
    fulfilledBy,
  }: IPayment) {
    this.transactionId = transactionId;
    this.orderId = orderId;
    this.orderNumber = orderNumber;
    this.transactionType = transactionType;
    this.transactionStatus = transactionStatus;
    this.paymentMethod = paymentMethod;
    this.paymentGatewayId = paymentGatewayId;
    this.amount = amount;
    this.date = date;
    this.fulfilledBy = fulfilledBy;
  }
}
