// Original file: node_modules/soum-proto/proto/payment.proto

export interface PaymentOption {
  id?: string;
  paymentProvider?: string;
  paymentCardType?: string;
  displayName?: string;
}

export interface PaymentOption__Output {
  id: string;
  paymentProvider: string;
  paymentCardType: string;
  displayName: string;
}
