// Original file: node_modules/soum-proto/proto/product.proto

import type {
  BreakDownResponse as _product_BreakDownResponse,
  BreakDownResponse__Output as _product_BreakDownResponse__Output,
} from '../product/BreakDownResponse';
import type {
  Condition as _product_Condition,
  Condition__Output as _product_Condition__Output,
} from '../product/Condition';

export interface ProductDeepLoad {
  id?: string;
  commissionSummary?: _product_BreakDownResponse | null;
  condition?: _product_Condition | null;
}

export interface ProductDeepLoad__Output {
  id: string;
  commissionSummary: _product_BreakDownResponse__Output | null;
  condition: _product_Condition__Output | null;
}
