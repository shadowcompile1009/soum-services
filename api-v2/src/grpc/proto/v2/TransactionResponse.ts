// Original file: node_modules/soum-proto/proto/v2.proto

import type { PaymentOption as _v2_PaymentOption, PaymentOption__Output as _v2_PaymentOption__Output } from '../v2/PaymentOption';

export interface TransactionResponse {
  'transactionId'?: (string);
  'checkoutId'?: (string);
  'checkoutURL'?: (string);
  'soumTransactionNumber'?: (string);
  'transactionStatusId'?: (string);
  'transactionType'?: (string);
  'paymentOptionId'?: (string);
  'operationId'?: (string);
  'totalAmount'?: (number | string);
  'paymentOption'?: (_v2_PaymentOption | null);
  'providerResponse'?: (string);
  '_operationId'?: "operationId";
  '_providerResponse'?: "providerResponse";
}

export interface TransactionResponse__Output {
  'transactionId': (string);
  'checkoutId': (string);
  'checkoutURL': (string);
  'soumTransactionNumber': (string);
  'transactionStatusId': (string);
  'transactionType': (string);
  'paymentOptionId': (string);
  'operationId'?: (string);
  'totalAmount': (number);
  'paymentOption': (_v2_PaymentOption__Output | null);
  'providerResponse'?: (string);
  '_operationId': "operationId";
  '_providerResponse': "providerResponse";
}
