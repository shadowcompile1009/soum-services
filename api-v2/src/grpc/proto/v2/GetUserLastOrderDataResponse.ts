// Original file: node_modules/soum-proto/proto/v2.proto

import type { Attribute as _v2_Attribute, Attribute__Output as _v2_Attribute__Output } from '../v2/Attribute';

export interface GetUserLastOrderDataResponse {
  'buyerName'?: (string);
  'productName'?: (string);
  'orderId'?: (string);
  'productId'?: (string);
  'statusId'?: (string);
  'sellPrice'?: (number | string);
  'createdAt'?: (string);
  'modelName'?: (string);
  'arModelName'?: (string);
  'variantName'?: (string);
  'arVariantName'?: (string);
  'isDelivered'?: (boolean);
  'isRated'?: (boolean);
  'attributes'?: (_v2_Attribute)[];
  '_buyerName'?: "buyerName";
  '_productName'?: "productName";
  '_orderId'?: "orderId";
  '_productId'?: "productId";
  '_statusId'?: "statusId";
  '_sellPrice'?: "sellPrice";
  '_createdAt'?: "createdAt";
  '_modelName'?: "modelName";
  '_arModelName'?: "arModelName";
  '_variantName'?: "variantName";
  '_arVariantName'?: "arVariantName";
}

export interface GetUserLastOrderDataResponse__Output {
  'buyerName'?: (string);
  'productName'?: (string);
  'orderId'?: (string);
  'productId'?: (string);
  'statusId'?: (string);
  'sellPrice'?: (number);
  'createdAt'?: (string);
  'modelName'?: (string);
  'arModelName'?: (string);
  'variantName'?: (string);
  'arVariantName'?: (string);
  'isDelivered': (boolean);
  'isRated': (boolean);
  'attributes': (_v2_Attribute__Output)[];
  '_buyerName': "buyerName";
  '_productName': "productName";
  '_orderId': "orderId";
  '_productId': "productId";
  '_statusId': "statusId";
  '_sellPrice': "sellPrice";
  '_createdAt': "createdAt";
  '_modelName': "modelName";
  '_arModelName': "arModelName";
  '_variantName': "variantName";
  '_arVariantName': "arVariantName";
}
