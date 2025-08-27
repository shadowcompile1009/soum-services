// Original file: node_modules/soum-proto/proto/v2.proto

import type { BidProduct as _v2_BidProduct, BidProduct__Output as _v2_BidProduct__Output } from '../v2/BidProduct';
import type { BreakDownResponse as _v2_BreakDownResponse, BreakDownResponse__Output as _v2_BreakDownResponse__Output } from '../v2/BreakDownResponse';

export interface GetBidSummaryResponse {
  'product'?: (_v2_BidProduct | null);
  'commissionSummaries'?: (_v2_BreakDownResponse)[];
}

export interface GetBidSummaryResponse__Output {
  'product': (_v2_BidProduct__Output | null);
  'commissionSummaries': (_v2_BreakDownResponse__Output)[];
}
