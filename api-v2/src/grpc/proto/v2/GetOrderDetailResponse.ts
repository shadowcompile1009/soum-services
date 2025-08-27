// Original file: node_modules/soum-proto/proto/v2.proto

import type { SellerOrderDetail as _v2_SellerOrderDetail, SellerOrderDetail__Output as _v2_SellerOrderDetail__Output } from '../v2/SellerOrderDetail';
import type { BuyerOrderDetail as _v2_BuyerOrderDetail, BuyerOrderDetail__Output as _v2_BuyerOrderDetail__Output } from '../v2/BuyerOrderDetail';

export interface GetOrderDetailResponse {
  'buyerId'?: (string);
  'sellerId'?: (string);
  'sellerOrderDetail'?: (_v2_SellerOrderDetail | null);
  'buyerOrderDetail'?: (_v2_BuyerOrderDetail | null);
  'productName'?: (string);
  'orderNumber'?: (string);
  'orderId'?: (string);
  'productId'?: (string);
  'sellerPhoneNumber'?: (string);
  'buyerPhoneNumber'?: (string);
  'isFinancingEmailSent'?: (boolean);
}

export interface GetOrderDetailResponse__Output {
  'buyerId': (string);
  'sellerId': (string);
  'sellerOrderDetail': (_v2_SellerOrderDetail__Output | null);
  'buyerOrderDetail': (_v2_BuyerOrderDetail__Output | null);
  'productName': (string);
  'orderNumber': (string);
  'orderId': (string);
  'productId': (string);
  'sellerPhoneNumber': (string);
  'buyerPhoneNumber': (string);
  'isFinancingEmailSent': (boolean);
}
