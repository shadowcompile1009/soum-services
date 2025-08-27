// Original file: node_modules/soum-proto/proto/v2.proto

import type { Product as _v2_Product, Product__Output as _v2_Product__Output } from '../v2/Product';
import type { CalculationSettings as _v2_CalculationSettings, CalculationSettings__Output as _v2_CalculationSettings__Output } from '../v2/CalculationSettings';
import type { PromoCode as _v2_PromoCode, PromoCode__Output as _v2_PromoCode__Output } from '../v2/PromoCode';

export interface GetProductForCommissionResponse {
  'product'?: (_v2_Product | null);
  'userType'?: (string);
  'priceQuality'?: (string);
  'calculationSettings'?: (_v2_CalculationSettings | null);
  'promoCode'?: (_v2_PromoCode | null);
}

export interface GetProductForCommissionResponse__Output {
  'product': (_v2_Product__Output | null);
  'userType': (string);
  'priceQuality': (string);
  'calculationSettings': (_v2_CalculationSettings__Output | null);
  'promoCode': (_v2_PromoCode__Output | null);
}
