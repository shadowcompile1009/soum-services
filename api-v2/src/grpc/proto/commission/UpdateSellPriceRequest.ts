// Original file: node_modules/soum-proto/proto/commission.proto

import type {
  Product as _commission_Product,
  Product__Output as _commission_Product__Output,
} from '../commission/Product';

export interface UpdateSellPriceRequest {
  product?: _commission_Product | null;
}

export interface UpdateSellPriceRequest__Output {
  product: _commission_Product__Output | null;
}
