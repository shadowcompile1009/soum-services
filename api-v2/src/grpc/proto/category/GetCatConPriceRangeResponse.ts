// Original file: node_modules/soum-proto/proto/category.proto

import type {
  PriceNudge as _category_PriceNudge,
  PriceNudge__Output as _category_PriceNudge__Output,
} from '../category/PriceNudge';

export interface GetCatConPriceRangeResponse {
  priceRange?: _category_PriceNudge | null;
}

export interface GetCatConPriceRangeResponse__Output {
  priceRange: _category_PriceNudge__Output | null;
}
