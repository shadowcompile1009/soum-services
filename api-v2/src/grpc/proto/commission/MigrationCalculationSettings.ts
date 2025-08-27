// Original file: node_modules/soum-proto/proto/commission.proto

export interface MigrationCalculationSettings {
  vatPercentage?: number;
  applyDeliveryFeeSPPs?: boolean;
  applyDeliveryFeeMPPs?: boolean;
  applyDeliveryFee?: boolean;
  deliveryFeeThreshold?: number;
  deliveryFee?: number;
  referralFixedAmount?: number;
  buyerCommissionPercentage?: number;
  sellerCommissionPercentage?: number;
  priceQualityExtraCommission?: number;
}

export interface MigrationCalculationSettings__Output {
  vatPercentage: number;
  applyDeliveryFeeSPPs: boolean;
  applyDeliveryFeeMPPs: boolean;
  applyDeliveryFee: boolean;
  deliveryFeeThreshold: number;
  deliveryFee: number;
  referralFixedAmount: number;
  buyerCommissionPercentage: number;
  sellerCommissionPercentage: number;
  priceQualityExtraCommission: number;
}
