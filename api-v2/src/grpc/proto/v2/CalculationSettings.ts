// Original file: node_modules/soum-proto/proto/v2.proto


export interface CalculationSettings {
  'vatPercentage'?: (number);
  'applyDeliveryFeeSPPs'?: (boolean);
  'applyDeliveryFeeMPPs'?: (boolean);
  'applyDeliveryFee'?: (boolean);
  'deliveryFeeThreshold'?: (number);
  'deliveryFee'?: (number);
  'referralFixedAmount'?: (number);
  'buyerCommissionPercentage'?: (number);
  'sellerCommissionPercentage'?: (number);
  'priceQualityExtraCommission'?: (number);
}

export interface CalculationSettings__Output {
  'vatPercentage': (number);
  'applyDeliveryFeeSPPs': (boolean);
  'applyDeliveryFeeMPPs': (boolean);
  'applyDeliveryFee': (boolean);
  'deliveryFeeThreshold': (number);
  'deliveryFee': (number);
  'referralFixedAmount': (number);
  'buyerCommissionPercentage': (number);
  'sellerCommissionPercentage': (number);
  'priceQualityExtraCommission': (number);
}
