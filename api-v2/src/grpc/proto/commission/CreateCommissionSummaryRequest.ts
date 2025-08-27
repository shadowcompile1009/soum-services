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
import type {
  Reservation as _commission_Reservation,
  Reservation__Output as _commission_Reservation__Output,
} from '../commission/Reservation';
import type {
  AddOn as _commission_AddOn,
  AddOn__Output as _commission_AddOn__Output,
} from '../commission/AddOn';
import type {
  FinancingRequest as _commission_FinancingRequest,
  FinancingRequest__Output as _commission_FinancingRequest__Output,
} from '../commission/FinancingRequest';

export interface CreateCommissionSummaryRequest {
  commission?: _commission_CommissionFilters | null;
  product?: _commission_Product | null;
  calculationSettings?: _commission_CalculationSettings | null;
  promoCode?: _commission_PromoCode | null;
  order?: _commission_Order | null;
  paymentModuleName?: string;
  paymentOption?: _commission_PaymentOption | null;
  reservation?: _commission_Reservation | null;
  addOns?: _commission_AddOn[];
  financingRequest?: _commission_FinancingRequest | null;
}

export interface CreateCommissionSummaryRequest__Output {
  commission: _commission_CommissionFilters__Output | null;
  product: _commission_Product__Output | null;
  calculationSettings: _commission_CalculationSettings__Output | null;
  promoCode: _commission_PromoCode__Output | null;
  order: _commission_Order__Output | null;
  paymentModuleName: string;
  paymentOption: _commission_PaymentOption__Output | null;
  reservation: _commission_Reservation__Output | null;
  addOns: _commission_AddOn__Output[];
  financingRequest: _commission_FinancingRequest__Output | null;
}
