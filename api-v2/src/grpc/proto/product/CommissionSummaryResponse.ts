// Original file: node_modules/soum-proto/proto/product.proto

export interface CommissionSummaryResponse {
  id?: string;
  commission?: number | string;
  commissionVat?: number | string;
  deliveryFee?: number | string;
  deliveryFeeVat?: number | string;
  totalVat?: number | string;
  discount?: number | string;
  grandTotal?: number | string;
  commissionDiscount?: number | string;
  sellPrice?: number | string;
  paymentId?: string;
  addOnsTotal?: number | string;
  addOnsVat?: number | string;
  addOnsGrandTotal?: number | string;
  realEstateVat?: number | string;
}

export interface CommissionSummaryResponse__Output {
  id: string;
  commission: number;
  commissionVat: number;
  deliveryFee: number;
  deliveryFeeVat: number;
  totalVat: number;
  discount: number;
  grandTotal: number;
  commissionDiscount: number;
  sellPrice: number;
  paymentId: string;
  addOnsTotal: number;
  addOnsVat: number;
  addOnsGrandTotal: number;
  realEstateVat: number;
}
