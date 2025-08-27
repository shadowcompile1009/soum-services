// Original file: node_modules/soum-proto/proto/commission.proto

export interface ForceUpdateSellerAndBuyerCommissionRequest {
  productId?: string;
  orderId?: string;
  grandTotal?: number | string;
  payout?: number | string;
  discount?: number | string;
  buyerCommission?: number | string;
  sellPrice?: number | string;
}

export interface ForceUpdateSellerAndBuyerCommissionRequest__Output {
  productId: string;
  orderId: string;
  grandTotal: number;
  payout: number;
  discount: number;
  buyerCommission: number;
  sellPrice: number;
}
