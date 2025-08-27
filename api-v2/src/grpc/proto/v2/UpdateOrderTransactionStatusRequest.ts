// Original file: node_modules/soum-proto/proto/v2.proto

export interface UpdateOrderTransactionStatusRequest {
  orderId?: string;
  transactionStatus?: string;
}

export interface UpdateOrderTransactionStatusRequest__Output {
  orderId: string;
  transactionStatus: string;
}
