// Original file: node_modules/soum-proto/proto/commission.proto

import type {
  BreakDownResponse as _commission_BreakDownResponse,
  BreakDownResponse__Output as _commission_BreakDownResponse__Output,
} from '../commission/BreakDownResponse';

export interface CalculateCommissionSummaryResponse {
  commissionSummaries?: _commission_BreakDownResponse[];
  productId?: string;
}

export interface CalculateCommissionSummaryResponse__Output {
  commissionSummaries: _commission_BreakDownResponse__Output[];
  productId: string;
}
