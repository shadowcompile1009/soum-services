// Original file: node_modules/soum-proto/proto/v2.proto


export interface GetBidSummaryRequest {
  'productId'?: (string);
  'bidPrice'?: (number | string);
  'userId'?: (string);
  'allPayments'?: (boolean);
  'paymentOptionId'?: (string);
}

export interface GetBidSummaryRequest__Output {
  'productId': (string);
  'bidPrice': (number);
  'userId': (string);
  'allPayments': (boolean);
  'paymentOptionId': (string);
}
