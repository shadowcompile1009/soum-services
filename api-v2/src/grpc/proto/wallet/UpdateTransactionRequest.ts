// Original file: node_modules/soum-proto/proto/wallet.proto

export interface UpdateTransactionRequest {
  transactionId?: string;
  status?: string;
}

export interface UpdateTransactionRequest__Output {
  transactionId: string;
  status: string;
}
