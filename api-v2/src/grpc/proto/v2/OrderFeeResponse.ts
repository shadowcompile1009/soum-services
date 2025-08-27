// Original file: node_modules/soum-proto/proto/v2.proto

export interface OrderFeeResponse {
  shippingCharge?: number | string;
  penaltyFee?: number | string;
  deliveryFee?: number | string;
}

export interface OrderFeeResponse__Output {
  shippingCharge: number;
  penaltyFee: number;
  deliveryFee: number;
}
