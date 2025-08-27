// Original file: node_modules/soum-proto/proto/commission.proto

import type {
  CommissionFilters as _commission_CommissionFilters,
  CommissionFilters__Output as _commission_CommissionFilters__Output,
} from '../commission/CommissionFilters';
import type {
  Product as _commission_Product,
  Product__Output as _commission_Product__Output,
} from '../commission/Product';
import type {
  CalculationSettings as _commission_CalculationSettings,
  CalculationSettings__Output as _commission_CalculationSettings__Output,
} from '../commission/CalculationSettings';
import type {
  PromoCode as _commission_PromoCode,
  PromoCode__Output as _commission_PromoCode__Output,
} from '../commission/PromoCode';
import type {
  Order as _commission_Order,
  Order__Output as _commission_Order__Output,
} from '../commission/Order';
import type {
  PaymentOption as _commission_PaymentOption,
  PaymentOption__Output as _commission_PaymentOption__Output,
} from '../commission/PaymentOption';

export interface CommissionSummaryRequest {
  commission?: _commission_CommissionFilters | null;
  product?: _commission_Product | null;
  calculationSettings?: _commission_CalculationSettings | null;
  promoCode?: _commission_PromoCode | null;
  order?: _commission_Order | null;
  saveCalculation?: boolean;
  paymentOption?: _commission_PaymentOption | null;
}

export interface CommissionSummaryRequest__Output {
  commission: _commission_CommissionFilters__Output | null;
  product: _commission_Product__Output | null;
  calculationSettings: _commission_CalculationSettings__Output | null;
  promoCode: _commission_PromoCode__Output | null;
  order: _commission_Order__Output | null;
  saveCalculation: boolean;
  paymentOption: _commission_PaymentOption__Output | null;
}
