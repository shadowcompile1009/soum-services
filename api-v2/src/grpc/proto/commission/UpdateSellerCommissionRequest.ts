// Original file: node_modules/soum-proto/proto/commission.proto

import type {
  Product as _commission_Product,
  Product__Output as _commission_Product__Output,
} from '../commission/Product';

export interface UpdateSellerCommissionRequest {
  product?: _commission_Product | null;
  sellerNewCommission?: number | string;
}

export interface UpdateSellerCommissionRequest__Output {
  product: _commission_Product__Output | null;
  sellerNewCommission: number;
}
