// Original file: node_modules/soum-proto/proto/v2.proto


export interface _v2_GetOrderSaleAnalyticsResponse_TotalsByStatusResponse {
  'statusName'?: (string);
  'totalAmount'?: (number | string);
  'transaction'?: (number | string);
}

export interface _v2_GetOrderSaleAnalyticsResponse_TotalsByStatusResponse__Output {
  'statusName': (string);
  'totalAmount': (number);
  'transaction': (number);
}

export interface GetOrderSaleAnalyticsResponse {
  'data'?: (_v2_GetOrderSaleAnalyticsResponse_TotalsByStatusResponse)[];
  'totalTransactions'?: (number | string);
  'totalAmountOverall'?: (number | string);
}

export interface GetOrderSaleAnalyticsResponse__Output {
  'data': (_v2_GetOrderSaleAnalyticsResponse_TotalsByStatusResponse__Output)[];
  'totalTransactions': (number);
  'totalAmountOverall': (number);
}
