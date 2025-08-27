// Original file: node_modules/soum-proto/proto/wallet.proto

import type { Long } from '@grpc/proto-loader';

export interface UpdateWalletRequest {
  walletId?: string;
  amount?: number | string | Long;
  transactionType?: string;
}

export interface UpdateWalletRequest__Output {
  walletId: string;
  amount: string;
  transactionType: string;
}
