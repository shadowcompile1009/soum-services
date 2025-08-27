// Original file: node_modules/soum-proto/proto/commission.proto

export interface ProductCommissionSummaryByIdResponse {
  id?: string;
  commission?: number;
  commissionVat?: number;
  deliveryFee?: number;
  deliveryFeeVat?: number;
  totalVat?: number;
  discount?: number;
  grandTotal?: number;
  commissionDiscount?: number;
  productId?: string;
  orderId?: string;
  sellPrice?: number;
}

export interface ProductCommissionSummaryByIdResponse__Output {
  id: string;
  commission: number;
  commissionVat: number;
  deliveryFee: number;
  deliveryFeeVat: number;
  totalVat: number;
  discount: number;
  grandTotal: number;
  commissionDiscount: number;
  productId: string;
  orderId: string;
  sellPrice: number;
}
