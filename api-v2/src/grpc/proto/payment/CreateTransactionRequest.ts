// Original file: node_modules/soum-proto/proto/payment.proto

import type {
  ReturnUrl as _payment_ReturnUrl,
  ReturnUrl__Output as _payment_ReturnUrl__Output,
} from '../payment/ReturnUrl';

export interface _payment_CreateTransactionRequest_TransactionItem {
  title?: string;
  description?: string;
  unitPrice?: string;
  vatAmount?: string;
  quantity?: number;
  category?: string;
  productImage?: string;
  productId?: string;
  _quantity?: 'quantity';
  _category?: 'category';
  _productImage?: 'productImage';
  _productId?: 'productId';
}

export interface _payment_CreateTransactionRequest_TransactionItem__Output {
  title: string;
  description: string;
  unitPrice: string;
  vatAmount: string;
  quantity?: number;
  category?: string;
  productImage?: string;
  productId?: string;
  _quantity: 'quantity';
  _category: 'category';
  _productImage: 'productImage';
  _productId: 'productId';
}

export interface CreateTransactionRequest {
  userId?: string;
  productId?: string;
  amount?: number | string;
  paymentOptionId?: string;
  soumTransactionNumber?: string;
  transactionType?: string;
  items?: _payment_CreateTransactionRequest_TransactionItem[];
  nationalId?: string;
  orderId?: string;
  returnUrls?: _payment_ReturnUrl[];
  transactionActionType?: string;
  _nationalId?: 'nationalId';
  _transactionActionType?: 'transactionActionType';
}

export interface CreateTransactionRequest__Output {
  userId: string;
  productId: string;
  amount: number;
  paymentOptionId: string;
  soumTransactionNumber: string;
  transactionType: string;
  items: _payment_CreateTransactionRequest_TransactionItem__Output[];
  nationalId?: string;
  orderId: string;
  returnUrls: _payment_ReturnUrl__Output[];
  transactionActionType?: string;
  _nationalId: 'nationalId';
  _transactionActionType: 'transactionActionType';
}
