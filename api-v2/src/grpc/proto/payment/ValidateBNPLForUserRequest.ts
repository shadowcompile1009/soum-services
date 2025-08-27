// Original file: node_modules/soum-proto/proto/payment.proto

import type {
  PaymentOption as _payment_PaymentOption,
  PaymentOption__Output as _payment_PaymentOption__Output,
} from '../payment/PaymentOption';

export interface _payment_ValidateBNPLForUserRequest_TransactionItem {
  title?: string;
  description?: string;
  unitPrice?: string;
  vatAmount?: string;
}

export interface _payment_ValidateBNPLForUserRequest_TransactionItem__Output {
  title: string;
  description: string;
  unitPrice: string;
  vatAmount: string;
}

export interface ValidateBNPLForUserRequest {
  userId?: string;
  productId?: string;
  amount?: number | string;
  paymentOption?: _payment_PaymentOption | null;
  soumTransactionNumber?: string;
  transactionType?: string;
  items?: _payment_ValidateBNPLForUserRequest_TransactionItem[];
  nationalId?: string;
  _nationalId?: 'nationalId';
}

export interface ValidateBNPLForUserRequest__Output {
  userId: string;
  productId: string;
  amount: number;
  paymentOption: _payment_PaymentOption__Output | null;
  soumTransactionNumber: string;
  transactionType: string;
  items: _payment_ValidateBNPLForUserRequest_TransactionItem__Output[];
  nationalId?: string;
  _nationalId: 'nationalId';
}
