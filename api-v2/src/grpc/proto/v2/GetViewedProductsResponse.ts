// Original file: node_modules/soum-proto/proto/v2.proto

import type { DeviceModel as _v2_DeviceModel, DeviceModel__Output as _v2_DeviceModel__Output } from '../v2/DeviceModel';
import type { Variant as _v2_Variant, Variant__Output as _v2_Variant__Output } from '../v2/Variant';
import type { Attribute as _v2_Attribute, Attribute__Output as _v2_Attribute__Output } from '../v2/Attribute';
import type { Condition as _v2_Condition, Condition__Output as _v2_Condition__Output } from '../v2/Condition';
import type { Category as _v2_Category, Category__Output as _v2_Category__Output } from '../v2/Category';

export interface _v2_GetViewedProductsResponse_Product {
  'id'?: (string);
  'grade'?: (string);
  'gradeAr'?: (string);
  'deviceModel'?: (_v2_DeviceModel | null);
  'variant'?: (_v2_Variant | null);
  'attributes'?: (_v2_Attribute)[];
  'isGreatDeal'?: (boolean);
  'isMerchant'?: (boolean);
  'originalPrice'?: (number);
  'productImage'?: (string);
  'productImages'?: (string)[];
  'sellPrice'?: (number | string);
  'tags'?: (string);
  'sellStatus'?: (string);
  'sellDate'?: (string);
  'condition'?: (_v2_Condition | null);
  'showSecurityBadge'?: (boolean);
  'brand'?: (_v2_Category | null);
  'category'?: (_v2_Category | null);
  'grandTotal'?: (number | string);
  'vat'?: (number | string);
  'shippingCharge'?: (number | string);
  'buyAmount'?: (number | string);
  'expressDeliveryBadge'?: (boolean);
  'year'?: (string);
  '_expressDeliveryBadge'?: "expressDeliveryBadge";
  '_year'?: "year";
}

export interface _v2_GetViewedProductsResponse_Product__Output {
  'id': (string);
  'grade': (string);
  'gradeAr': (string);
  'deviceModel': (_v2_DeviceModel__Output | null);
  'variant': (_v2_Variant__Output | null);
  'attributes': (_v2_Attribute__Output)[];
  'isGreatDeal': (boolean);
  'isMerchant': (boolean);
  'originalPrice': (number);
  'productImage': (string);
  'productImages': (string)[];
  'sellPrice': (number);
  'tags': (string);
  'sellStatus': (string);
  'sellDate': (string);
  'condition': (_v2_Condition__Output | null);
  'showSecurityBadge': (boolean);
  'brand': (_v2_Category__Output | null);
  'category': (_v2_Category__Output | null);
  'grandTotal': (number);
  'vat': (number);
  'shippingCharge': (number);
  'buyAmount': (number);
  'expressDeliveryBadge'?: (boolean);
  'year'?: (string);
  '_expressDeliveryBadge': "expressDeliveryBadge";
  '_year': "year";
}

export interface GetViewedProductsResponse {
  'products'?: (_v2_GetViewedProductsResponse_Product)[];
}

export interface GetViewedProductsResponse__Output {
  'products': (_v2_GetViewedProductsResponse_Product__Output)[];
}
