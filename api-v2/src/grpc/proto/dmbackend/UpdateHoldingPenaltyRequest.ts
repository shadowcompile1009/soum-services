// Original file: node_modules/soum-proto/proto/dmbackend.proto

export interface UpdateHoldingPenaltyRequest {
  sellerId?: string;
  dmoId?: string;
  isPayout?: boolean;
}

export interface UpdateHoldingPenaltyRequest__Output {
  sellerId: string;
  dmoId: string;
  isPayout: boolean;
}
