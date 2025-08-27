// Original file: node_modules/soum-proto/proto/commission.proto

export interface CalculationSettings {
  vatPercentage?: number;
  applyDeliveryFeeSPPs?: boolean;
  applyDeliveryFeeMPPs?: boolean;
  applyDeliveryFee?: boolean;
  deliveryFeeThreshold?: number;
  deliveryFee?: number;
  referralFixedAmount?: number;
  applyReservation?: boolean;
  applyFinancing?: boolean;
}

export interface CalculationSettings__Output {
  vatPercentage: number;
  applyDeliveryFeeSPPs: boolean;
  applyDeliveryFeeMPPs: boolean;
  applyDeliveryFee: boolean;
  deliveryFeeThreshold: number;
  deliveryFee: number;
  referralFixedAmount: number;
  applyReservation: boolean;
  applyFinancing: boolean;
}
