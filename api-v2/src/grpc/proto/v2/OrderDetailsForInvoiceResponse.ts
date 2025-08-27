// Original file: node_modules/soum-proto/proto/v2.proto

export interface OrderDetailsForInvoiceResponse {
  nameProduct?: string;
  nameProductAr?: string;
  unitPrice?: number | string;
  discount?: number | string;
  unitPriceAfterDiscount?: number | string;
  quantity?: number;
  tax?: number | string;
  subTotal?: number | string;
}

export interface OrderDetailsForInvoiceResponse__Output {
  nameProduct: string;
  nameProductAr: string;
  unitPrice: number;
  discount: number;
  unitPriceAfterDiscount: number;
  quantity: number;
  tax: number;
  subTotal: number;
}
