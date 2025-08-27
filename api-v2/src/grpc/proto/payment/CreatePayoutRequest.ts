// Original file: node_modules/soum-proto/proto/payment.proto

export interface CreatePayoutRequest {
  amount?: number | string;
  recipientId?: string;
  agentId?: string;
  orderId?: string;
}

export interface CreatePayoutRequest__Output {
  amount: number;
  recipientId: string;
  agentId: string;
  orderId: string;
}
