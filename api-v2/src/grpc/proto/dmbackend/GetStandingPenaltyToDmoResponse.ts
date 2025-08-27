// Original file: node_modules/soum-proto/proto/dmbackend.proto

export interface GetStandingPenaltyToDmoResponse {
  dmoId?: string;
  userId?: string;
  penalty?: number | string;
}

export interface GetStandingPenaltyToDmoResponse__Output {
  dmoId: string;
  userId: string;
  penalty: number;
}
