// Original file: node_modules/soum-proto/proto/product.proto

import type {
  CommissionSummaryResponse as _product_CommissionSummaryResponse,
  CommissionSummaryResponse__Output as _product_CommissionSummaryResponse__Output,
} from '../product/CommissionSummaryResponse';

export interface BreakDownResponse {
  withPromo?: _product_CommissionSummaryResponse | null;
  withoutPromo?: _product_CommissionSummaryResponse | null;
}

export interface BreakDownResponse__Output {
  withPromo: _product_CommissionSummaryResponse__Output | null;
  withoutPromo: _product_CommissionSummaryResponse__Output | null;
}
