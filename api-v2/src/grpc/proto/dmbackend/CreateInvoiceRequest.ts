// Original file: node_modules/soum-proto/proto/dmbackend.proto

export interface CreateInvoiceRequest {
  orderId?: string;
  invoiceType?: string;
  userType?: string;
  eventName?: string;
}

export interface CreateInvoiceRequest__Output {
  orderId: string;
  invoiceType: string;
  userType: string;
  eventName: string;
}
