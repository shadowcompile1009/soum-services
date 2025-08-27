// Original file: node_modules/soum-proto/proto/v2.proto


export interface _v2_GetPendingPayoutPaginationResponse_PayoutDetails {
  'productName'?: (string);
  'productNameAR'?: (string);
  'payoutAmount'?: (string);
  'orderNumber'?: (string);
}

export interface _v2_GetPendingPayoutPaginationResponse_PayoutDetails__Output {
  'productName': (string);
  'productNameAR': (string);
  'payoutAmount': (string);
  'orderNumber': (string);
}

export interface GetPendingPayoutPaginationResponse {
  'payouts'?: (_v2_GetPendingPayoutPaginationResponse_PayoutDetails)[];
  'totalItems'?: (number);
  'totalPages'?: (number);
  'currentPage'?: (number);
}

export interface GetPendingPayoutPaginationResponse__Output {
  'payouts': (_v2_GetPendingPayoutPaginationResponse_PayoutDetails__Output)[];
  'totalItems': (number);
  'totalPages': (number);
  'currentPage': (number);
}
