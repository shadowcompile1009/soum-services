// Original file: node_modules/soum-proto/proto/v2.proto

import type {
  CategoriesWithValueSetting as _v2_CategoriesWithValueSetting,
  CategoriesWithValueSetting__Output as _v2_CategoriesWithValueSetting__Output,
} from '../v2/CategoriesWithValueSetting';

export interface GetSettingsForOrderCreationResponse {
  deliveryFee?: number | string;
  deliveryThreshold?: number | string;
  applyDeliveryFee?: boolean;
  applyReferralCodes?: boolean;
  referralDiscountType?: string;
  referralPercentage?: number | string;
  referralFixedAmount?: number | string;
  buyerCommissionPercentage?: number | string;
  vatPercentage?: number | string;
  applyDeliveryFeeMpps?: boolean;
  applyDeliveryFeeSpps?: boolean;
  priceQualityExtraCommission?: number | string;
  categoriesWithReservation?: _v2_CategoriesWithValueSetting[];
  enableReservation?: boolean;
  enableFinancing?: boolean;
  categoriesWithFinancing?: _v2_CategoriesWithValueSetting[];
  _deliveryFee?: 'deliveryFee';
  _deliveryThreshold?: 'deliveryThreshold';
  _applyDeliveryFee?: 'applyDeliveryFee';
  _applyReferralCodes?: 'applyReferralCodes';
  _referralDiscountType?: 'referralDiscountType';
  _referralPercentage?: 'referralPercentage';
  _referralFixedAmount?: 'referralFixedAmount';
  _buyerCommissionPercentage?: 'buyerCommissionPercentage';
  _vatPercentage?: 'vatPercentage';
  _applyDeliveryFeeMpps?: 'applyDeliveryFeeMpps';
  _applyDeliveryFeeSpps?: 'applyDeliveryFeeSpps';
  _priceQualityExtraCommission?: 'priceQualityExtraCommission';
  _enableReservation?: 'enableReservation';
  _enableFinancing?: 'enableFinancing';
}

export interface GetSettingsForOrderCreationResponse__Output {
  deliveryFee?: number;
  deliveryThreshold?: number;
  applyDeliveryFee?: boolean;
  applyReferralCodes?: boolean;
  referralDiscountType?: string;
  referralPercentage?: number;
  referralFixedAmount?: number;
  buyerCommissionPercentage?: number;
  vatPercentage?: number;
  applyDeliveryFeeMpps?: boolean;
  applyDeliveryFeeSpps?: boolean;
  priceQualityExtraCommission?: number;
  categoriesWithReservation: _v2_CategoriesWithValueSetting__Output[];
  enableReservation?: boolean;
  enableFinancing?: boolean;
  categoriesWithFinancing: _v2_CategoriesWithValueSetting__Output[];
  _deliveryFee: 'deliveryFee';
  _deliveryThreshold: 'deliveryThreshold';
  _applyDeliveryFee: 'applyDeliveryFee';
  _applyReferralCodes: 'applyReferralCodes';
  _referralDiscountType: 'referralDiscountType';
  _referralPercentage: 'referralPercentage';
  _referralFixedAmount: 'referralFixedAmount';
  _buyerCommissionPercentage: 'buyerCommissionPercentage';
  _vatPercentage: 'vatPercentage';
  _applyDeliveryFeeMpps: 'applyDeliveryFeeMpps';
  _applyDeliveryFeeSpps: 'applyDeliveryFeeSpps';
  _priceQualityExtraCommission: 'priceQualityExtraCommission';
  _enableReservation: 'enableReservation';
  _enableFinancing: 'enableFinancing';
}
