// Original file: node_modules/soum-proto/proto/v2.proto


export interface BidProduct {
  'productId'?: (string);
  'sellerId'?: (string);
  'productName'?: (string);
  'startBid'?: (number | string);
  'sellerName'?: (string);
  'productNameAr'?: (string);
  'isExpired'?: (boolean);
  'productImg'?: (string);
  'isDeleted'?: (boolean);
  'isSold'?: (boolean);
}

export interface BidProduct__Output {
  'productId': (string);
  'sellerId': (string);
  'productName': (string);
  'startBid': (number);
  'sellerName': (string);
  'productNameAr': (string);
  'isExpired': (boolean);
  'productImg': (string);
  'isDeleted': (boolean);
  'isSold': (boolean);
}
