// Original file: node_modules/soum-proto/proto/wallet.proto

import type { Long } from '@grpc/proto-loader';

export interface TransactionResponse {
  id?: string;
  ownerId?: string;
  walletId?: string;
  amount?: number | string;
  status?: string;
  type?: string;
  createdAt?: number | string | Long;
  updatedAt?: number | string | Long;
  orderId?: string;
}

export interface TransactionResponse__Output {
  id: string;
  ownerId: string;
  walletId: string;
  amount: number;
  status: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  orderId: string;
}
