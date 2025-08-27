// Original file: node_modules/soum-proto/proto/dmbackend.proto

export interface GetPenalizedOrdersMerchantRequest {
  merchantId?: string;
  page?: number;
  size?: number;
  range?: string;
}

export interface GetPenalizedOrdersMerchantRequest__Output {
  merchantId: string;
  page: number;
  size: number;
  range: string;
}
