// Original file: node_modules/soum-proto/proto/payment.proto

import type {
  PaymentOption as _payment_PaymentOption,
  PaymentOption__Output as _payment_PaymentOption__Output,
} from '../payment/PaymentOption';

export interface GetPaymentOptionsResponse {
  paymentOptions?: _payment_PaymentOption[];
}

export interface GetPaymentOptionsResponse__Output {
  paymentOptions: _payment_PaymentOption__Output[];
}
