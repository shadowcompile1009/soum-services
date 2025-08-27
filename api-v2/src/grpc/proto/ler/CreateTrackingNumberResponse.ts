// Original file: node_modules/soum-proto/proto/ler.proto

export interface CreateTrackingNumberResponse {
  awbNo?: string;
  errorMsg?: string;
  status?: string;
  sellerTorodAddress?: string;
  buyerTorodAddress?: string;
}

export interface CreateTrackingNumberResponse__Output {
  awbNo: string;
  errorMsg: string;
  status: string;
  sellerTorodAddress: string;
  buyerTorodAddress: string;
}
