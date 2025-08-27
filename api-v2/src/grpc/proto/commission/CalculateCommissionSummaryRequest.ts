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
  PaymentOption as _commission_PaymentOption,
  PaymentOption__Output as _commission_PaymentOption__Output,
} from '../commission/PaymentOption';
import type {
  Reservation as _commission_Reservation,
  Reservation__Output as _commission_Reservation__Output,
} from '../commission/Reservation';
import type {
  FinancingRequest as _commission_FinancingRequest,
  FinancingRequest__Output as _commission_FinancingRequest__Output,
} from '../commission/FinancingRequest';

export interface CalculateCommissionSummaryRequest {
  commission?: _commission_CommissionFilters | null;
  product?: _commission_Product | null;
  calculationSettings?: _commission_CalculationSettings | null;
  promoCode?: _commission_PromoCode | null;
  allPayments?: boolean;
  paymentModuleName?: string;
  paymentOption?: _commission_PaymentOption | null;
  reservation?: _commission_Reservation | null;
  addonIds?: string[];
  financingRequest?: _commission_FinancingRequest | null;
}

export interface CalculateCommissionSummaryRequest__Output {
  commission: _commission_CommissionFilters__Output | null;
  product: _commission_Product__Output | null;
  calculationSettings: _commission_CalculationSettings__Output | null;
  promoCode: _commission_PromoCode__Output | null;
  allPayments: boolean;
  paymentModuleName: string;
  paymentOption: _commission_PaymentOption__Output | null;
  reservation: _commission_Reservation__Output | null;
  addonIds: string[];
  financingRequest: _commission_FinancingRequest__Output | null;
}
