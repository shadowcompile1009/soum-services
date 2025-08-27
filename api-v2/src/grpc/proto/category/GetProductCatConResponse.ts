// Original file: node_modules/soum-proto/proto/category.proto

import type {
  Condition as _category_Condition,
  Condition__Output as _category_Condition__Output,
} from '../category/Condition';
import type {
  PriceQuality as _category_PriceQuality,
  PriceQuality__Output as _category_PriceQuality__Output,
} from '../category/PriceQuality';

export interface GetProductCatConResponse {
  condition?: _category_Condition | null;
  priceQuality?: _category_PriceQuality | null;
}

export interface GetProductCatConResponse__Output {
  condition: _category_Condition__Output | null;
  priceQuality: _category_PriceQuality__Output | null;
}
