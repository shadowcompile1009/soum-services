// Original file: node_modules/soum-proto/proto/v2.proto


export interface _v2_GetPenalizedOrdersResponse_PenalizedOrders {
  'productName'?: (string);
  'orderNumber'?: (string);
  'payoutAmount'?: (number | string);
  'penalty'?: (number | string);
  'finalPayout'?: (number | string);
  'nctReason'?: (string);
  'nctReasonAR'?: (string);
  'dmoId'?: (string);
}

export interface _v2_GetPenalizedOrdersResponse_PenalizedOrders__Output {
  'productName': (string);
  'orderNumber': (string);
  'payoutAmount': (number);
  'penalty': (number);
  'finalPayout': (number);
  'nctReason': (string);
  'nctReasonAR': (string);
  'dmoId': (string);
}

export interface GetPenalizedOrdersResponse {
  'orders'?: (_v2_GetPenalizedOrdersResponse_PenalizedOrders)[];
  'totalItems'?: (number);
  'totalPages'?: (number);
  'currentPage'?: (number);
  'pageSize'?: (number);
}

export interface GetPenalizedOrdersResponse__Output {
  'orders': (_v2_GetPenalizedOrdersResponse_PenalizedOrders__Output)[];
  'totalItems': (number);
  'totalPages': (number);
  'currentPage': (number);
  'pageSize': (number);
}
