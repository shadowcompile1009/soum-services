// Original file: node_modules/soum-proto/proto/product.proto

import type {
  Product as _product_Product,
  Product__Output as _product_Product__Output,
} from '../product/Product';
import type {
  PromoCode as _product_PromoCode,
  PromoCode__Output as _product_PromoCode__Output,
} from '../product/PromoCode';

export interface getProductDataForFeedsReq {
  products?: _product_Product[];
  promoCode?: _product_PromoCode | null;
}

export interface getProductDataForFeedsReq__Output {
  products: _product_Product__Output[];
  promoCode: _product_PromoCode__Output | null;
}
