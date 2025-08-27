// Original file: node_modules/soum-proto/proto/commission.proto

import type {
  CommissionSummaryResponse as _commission_CommissionSummaryResponse,
  CommissionSummaryResponse__Output as _commission_CommissionSummaryResponse__Output,
} from '../commission/CommissionSummaryResponse';

export interface BreakDownResponse {
  withPromo?: _commission_CommissionSummaryResponse | null;
  withoutPromo?: _commission_CommissionSummaryResponse | null;
}

export interface BreakDownResponse__Output {
  withPromo: _commission_CommissionSummaryResponse__Output | null;
  withoutPromo: _commission_CommissionSummaryResponse__Output | null;
}
