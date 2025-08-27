// Original file: node_modules/soum-proto/proto/payment.proto

import type {
  PayoutStatus as _payment_PayoutStatus,
  PayoutStatus__Output as _payment_PayoutStatus__Output,
} from '../payment/PayoutStatus';

export interface GetPayoutByOrderNumberResponse {
  id?: string;
  payoutAmount?: number | string;
  status?: _payment_PayoutStatus;
}

export interface GetPayoutByOrderNumberResponse__Output {
  id: string;
  payoutAmount: number;
  status: _payment_PayoutStatus__Output;
}
