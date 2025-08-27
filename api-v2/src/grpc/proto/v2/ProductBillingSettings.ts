// Original file: node_modules/soum-proto/proto/v2.proto

export interface ProductBillingSettings {
  buyerCommissionPercentage?: number | string;
  sellerCommissionPercentage?: number | string;
  shippingChargePercentage?: number | string;
  vatPercentage?: number | string;
  referralDiscountType?: string;
  referralPercentage?: number | string;
  referralFixedAmount?: number | string;
  deliverThreshold?: number | string;
  applyDeliveryFee?: boolean;
  deliveryFee?: number | string;
  priceQualityExtraCommission?: number | string;
  activateBidding?: boolean;
  availablePaymentBidding?: string;
  configBidSettings?: string;
  startBid?: number | string;
  highestBid?: number | string;
  _buyerCommissionPercentage?: 'buyerCommissionPercentage';
  _sellerCommissionPercentage?: 'sellerCommissionPercentage';
  _shippingChargePercentage?: 'shippingChargePercentage';
  _vatPercentage?: 'vatPercentage';
  _referralDiscountType?: 'referralDiscountType';
  _referralPercentage?: 'referralPercentage';
  _referralFixedAmount?: 'referralFixedAmount';
  _deliverThreshold?: 'deliverThreshold';
  _applyDeliveryFee?: 'applyDeliveryFee';
  _deliveryFee?: 'deliveryFee';
  _priceQualityExtraCommission?: 'priceQualityExtraCommission';
  _activateBidding?: 'activateBidding';
  _availablePaymentBidding?: 'availablePaymentBidding';
  _configBidSettings?: 'configBidSettings';
  _startBid?: 'startBid';
  _highestBid?: 'highestBid';
}

export interface ProductBillingSettings__Output {
  buyerCommissionPercentage?: number;
  sellerCommissionPercentage?: number;
  shippingChargePercentage?: number;
  vatPercentage?: number;
  referralDiscountType?: string;
  referralPercentage?: number;
  referralFixedAmount?: number;
  deliverThreshold?: number;
  applyDeliveryFee?: boolean;
  deliveryFee?: number;
  priceQualityExtraCommission?: number;
  activateBidding?: boolean;
  availablePaymentBidding?: string;
  configBidSettings?: string;
  startBid?: number;
  highestBid?: number;
  _buyerCommissionPercentage: 'buyerCommissionPercentage';
  _sellerCommissionPercentage: 'sellerCommissionPercentage';
  _shippingChargePercentage: 'shippingChargePercentage';
  _vatPercentage: 'vatPercentage';
  _referralDiscountType: 'referralDiscountType';
  _referralPercentage: 'referralPercentage';
  _referralFixedAmount: 'referralFixedAmount';
  _deliverThreshold: 'deliverThreshold';
  _applyDeliveryFee: 'applyDeliveryFee';
  _deliveryFee: 'deliveryFee';
  _priceQualityExtraCommission: 'priceQualityExtraCommission';
  _activateBidding: 'activateBidding';
  _availablePaymentBidding: 'availablePaymentBidding';
  _configBidSettings: 'configBidSettings';
  _startBid: 'startBid';
  _highestBid: 'highestBid';
}
