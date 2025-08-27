// Original file: node_modules/soum-proto/proto/wallet.proto

import type { Long } from '@grpc/proto-loader';

export interface GetWalletResponse {
  id?: string;
  ownerId?: string;
  tag?: string;
  balance?: number | string;
  status?: string;
  createdAt?: number | string | Long;
  updatedAt?: number | string | Long;
  pendingTransactions?: number | string;
  onholdBalance?: number | string;
  availableBalance?: number | string;
  totalBalance?: number | string;
}

export interface GetWalletResponse__Output {
  id: string;
  ownerId: string;
  tag: string;
  balance: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  pendingTransactions: number;
  onholdBalance: number;
  availableBalance: number;
  totalBalance: number;
}
