// Original file: node_modules/soum-proto/proto/payment.proto

import type {
  PaymentOption as _payment_PaymentOption,
  PaymentOption__Output as _payment_PaymentOption__Output,
} from '../payment/PaymentOption';

export interface TransactionResponse {
  transactionId?: string;
  checkoutId?: string;
  checkoutURL?: string;
  soumTransactionNumber?: string;
  transactionStatusId?: string;
  transactionType?: string;
  paymentOptionId?: string;
  operationId?: string;
  totalAmount?: number | string;
  paymentOption?: _payment_PaymentOption | null;
  providerResponse?: string;
  _operationId?: 'operationId';
  _providerResponse?: 'providerResponse';
}

export interface TransactionResponse__Output {
  transactionId: string;
  checkoutId: string;
  checkoutURL: string;
  soumTransactionNumber: string;
  transactionStatusId: string;
  transactionType: string;
  paymentOptionId: string;
  operationId?: string;
  totalAmount: number;
  paymentOption: _payment_PaymentOption__Output | null;
  providerResponse?: string;
  _operationId: 'operationId';
  _providerResponse: 'providerResponse';
}
