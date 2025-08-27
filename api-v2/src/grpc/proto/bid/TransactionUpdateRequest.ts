// Original file: node_modules/soum-proto/proto/bid.proto

export interface TransactionUpdateRequest {
  transactionId?: string;
  checkoutId?: string;
  checkoutURL?: string;
  soumTransactionNumber?: string;
  transactionStatusId?: string;
  transactionType?: string;
  paymentOptionId?: string;
}

export interface TransactionUpdateRequest__Output {
  transactionId: string;
  checkoutId: string;
  checkoutURL: string;
  soumTransactionNumber: string;
  transactionStatusId: string;
  transactionType: string;
  paymentOptionId: string;
}
