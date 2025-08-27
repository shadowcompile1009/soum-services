// Original file: node_modules/soum-proto/proto/invoice.proto

export interface CreateInvoiceRequest {
  orderId?: string;
  invoiceType?: string;
  userType?: string;
  eventName?: string;
  buyerBusinessModel?: string;
  sellerBusinessModel?: string;
}

export interface CreateInvoiceRequest__Output {
  orderId: string;
  invoiceType: string;
  userType: string;
  eventName: string;
  buyerBusinessModel: string;
  sellerBusinessModel: string;
}
