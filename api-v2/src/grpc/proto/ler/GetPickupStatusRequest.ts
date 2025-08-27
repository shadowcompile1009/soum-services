// Original file: node_modules/soum-proto/proto/ler.proto

export interface GetPickupStatusRequest {
  awbNo?: string[];
  isDelivered?: boolean;
}

export interface GetPickupStatusRequest__Output {
  awbNo: string[];
  isDelivered: boolean;
}
