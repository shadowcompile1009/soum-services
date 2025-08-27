// Original file: node_modules/soum-proto/proto/v2.proto

import type { Attribute as _v2_Attribute, Attribute__Output as _v2_Attribute__Output } from '../v2/Attribute';

export interface _v2_GetProductsResponse_Product {
  'productId'?: (string);
  'sellerId'?: (string);
  'productName'?: (string);
  'startBid'?: (number | string);
  'sellerName'?: (string);
  'productNameAr'?: (string);
  'commission'?: (number | string);
  'shipping'?: (number | string);
  'availablePayment'?: (string);
  'isExpired'?: (boolean);
  'vat'?: (number | string);
  'productImg'?: (string);
  'isDeleted'?: (boolean);
  'isSold'?: (boolean);
  'sellPrice'?: (number | string);
  'sellerCity'?: (string);
  'vatPercentage'?: (number | string);
  'sellDate'?: (string);
  'attributes'?: (_v2_Attribute)[];
  '_sellDate'?: "sellDate";
}

export interface _v2_GetProductsResponse_Product__Output {
  'productId': (string);
  'sellerId': (string);
  'productName': (string);
  'startBid': (number);
  'sellerName': (string);
  'productNameAr': (string);
  'commission': (number);
  'shipping': (number);
  'availablePayment': (string);
  'isExpired': (boolean);
  'vat': (number);
  'productImg': (string);
  'isDeleted': (boolean);
  'isSold': (boolean);
  'sellPrice': (number);
  'sellerCity': (string);
  'vatPercentage': (number);
  'sellDate'?: (string);
  'attributes': (_v2_Attribute__Output)[];
  '_sellDate': "sellDate";
}

export interface GetProductsResponse {
  'products'?: (_v2_GetProductsResponse_Product)[];
}

export interface GetProductsResponse__Output {
  'products': (_v2_GetProductsResponse_Product__Output)[];
}
