// Original file: node_modules/soum-proto/proto/wallet.proto

import type {
  TransactionResponse as _wallet_TransactionResponse,
  TransactionResponse__Output as _wallet_TransactionResponse__Output,
} from '../wallet/TransactionResponse';

export interface GetTransactionsResponse {
  data?: _wallet_TransactionResponse[];
}

export interface GetTransactionsResponse__Output {
  data: _wallet_TransactionResponse__Output[];
}
