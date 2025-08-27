// Original file: node_modules/soum-proto/proto/dmbackend.proto

export interface _dmbackend_GetPenalizedOrdersMerchantResponse_PenalizedOrders {
  productName?: string;
  orderNumber?: string;
  payoutAmount?: number | string;
  penalty?: number | string;
  finalPayout?: number | string;
  nctReason?: string;
  nctReasonAR?: string;
}

export interface _dmbackend_GetPenalizedOrdersMerchantResponse_PenalizedOrders__Output {
  productName: string;
  orderNumber: string;
  payoutAmount: number;
  penalty: number;
  finalPayout: number;
  nctReason: string;
  nctReasonAR: string;
}

export interface GetPenalizedOrdersMerchantResponse {
  orders?: _dmbackend_GetPenalizedOrdersMerchantResponse_PenalizedOrders[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
}

export interface GetPenalizedOrdersMerchantResponse__Output {
  orders: _dmbackend_GetPenalizedOrdersMerchantResponse_PenalizedOrders__Output[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
