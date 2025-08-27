// Original file: node_modules/soum-proto/proto/wallet.proto

export interface _wallet_CreateTransactionRequest_Metadata {
  creditType?: string;
}

export interface _wallet_CreateTransactionRequest_Metadata__Output {
  creditType: string;
}

export interface CreateTransactionRequest {
  ownerId?: string;
  type?: string;
  amount?: number | string;
  orderId?: string;
  description?: string;
  status?: string;
  metadata?: _wallet_CreateTransactionRequest_Metadata | null;
  _status?: 'status';
  _metadata?: 'metadata';
}

export interface CreateTransactionRequest__Output {
  ownerId: string;
  type: string;
  amount: number;
  orderId: string;
  description: string;
  status?: string;
  metadata?: _wallet_CreateTransactionRequest_Metadata__Output | null;
  _status: 'status';
  _metadata: 'metadata';
}
