// Original file: node_modules/soum-proto/proto/v2.proto


export interface CreateOrderRequest {
  'productId'?: (string);
  'paymentOptionId'?: (string);
  'userId'?: (string);
  'amount'?: (number | string);
  'soumTransactionNumber'?: (string);
  'clientType'?: (string);
}

export interface CreateOrderRequest__Output {
  'productId': (string);
  'paymentOptionId': (string);
  'userId': (string);
  'amount': (number);
  'soumTransactionNumber': (string);
  'clientType': (string);
}
