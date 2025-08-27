// Original file: node_modules/soum-proto/proto/payment.proto

export interface CreateTransactionResponse {
  transactionId?: string;
  checkoutId?: string;
  checkoutURL?: string;
  soumTransactionNumber?: string;
  transactionStatusId?: string;
  transactionType?: string;
}

export interface CreateTransactionResponse__Output {
  transactionId: string;
  checkoutId: string;
  checkoutURL: string;
  soumTransactionNumber: string;
  transactionStatusId: string;
  transactionType: string;
}
