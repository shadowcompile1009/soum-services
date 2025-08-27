// Original file: node_modules/soum-proto/proto/commission.proto

export interface PaymentOption {
  id?: string;
  paymentProvider?: string;
  paymentCardType?: string;
}

export interface PaymentOption__Output {
  id: string;
  paymentProvider: string;
  paymentCardType: string;
}
