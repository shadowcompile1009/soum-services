// Original file: node_modules/soum-proto/proto/commission.proto

export interface ProductCommissionSummaryRequest {
  orderId?: string;
  productId?: string;
  isBuyer?: boolean;
  isOriginalBreakDown?: boolean;
}

export interface ProductCommissionSummaryRequest__Output {
  orderId: string;
  productId: string;
  isBuyer: boolean;
  isOriginalBreakDown: boolean;
}
