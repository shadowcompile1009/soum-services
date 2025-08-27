// Original file: node_modules/soum-proto/proto/v2.proto

import type { TransactionResponse as _v2_TransactionResponse, TransactionResponse__Output as _v2_TransactionResponse__Output } from '../v2/TransactionResponse';

export interface UpdatePaymentStatusOfOrderRequest {
  'paymentId'?: (string);
  'paymentNumber'?: (string);
  'paymentProvider'?: (string);
  'transaction'?: (_v2_TransactionResponse | null);
}

export interface UpdatePaymentStatusOfOrderRequest__Output {
  'paymentId': (string);
  'paymentNumber': (string);
  'paymentProvider': (string);
  'transaction': (_v2_TransactionResponse__Output | null);
}
