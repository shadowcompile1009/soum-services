// Original file: node_modules/soum-proto/proto/wallet.proto

export interface UpdateAmountTransactionRequest {
  transactionId?: string;
  amount?: number | string;
}

export interface UpdateAmountTransactionRequest__Output {
  transactionId: string;
  amount: number;
}
