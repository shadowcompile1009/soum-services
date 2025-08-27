// Original file: node_modules/soum-proto/proto/payment.proto

import type {
  PayoutStatus as _payment_PayoutStatus,
  PayoutStatus__Output as _payment_PayoutStatus__Output,
} from '../payment/PayoutStatus';

export interface CheckPayoutStatusResponse {
  status?: _payment_PayoutStatus;
}

export interface CheckPayoutStatusResponse__Output {
  status: _payment_PayoutStatus__Output;
}
