// Original file: node_modules/soum-proto/proto/v2.proto

import type { CommissionSummaryResponse as _v2_CommissionSummaryResponse, CommissionSummaryResponse__Output as _v2_CommissionSummaryResponse__Output } from '../v2/CommissionSummaryResponse';

export interface BreakDownResponse {
  'withPromo'?: (_v2_CommissionSummaryResponse | null);
  'withoutPromo'?: (_v2_CommissionSummaryResponse | null);
}

export interface BreakDownResponse__Output {
  'withPromo': (_v2_CommissionSummaryResponse__Output | null);
  'withoutPromo': (_v2_CommissionSummaryResponse__Output | null);
}
