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
  MigrationCalculationSettings as _commission_MigrationCalculationSettings,
  MigrationCalculationSettings__Output as _commission_MigrationCalculationSettings__Output,
} from '../commission/MigrationCalculationSettings';
import type {
  PromoCode as _commission_PromoCode,
  PromoCode__Output as _commission_PromoCode__Output,
} from '../commission/PromoCode';
import type {
  Order as _commission_Order,
  Order__Output as _commission_Order__Output,
} from '../commission/Order';

export interface MigrateCommissionSummaryRequest {
  commission?: _commission_CommissionFilters | null;
  product?: _commission_Product | null;
  calculationSettings?: _commission_MigrationCalculationSettings | null;
  promoCode?: _commission_PromoCode | null;
  order?: _commission_Order | null;
  paymentModuleName?: string;
}

export interface MigrateCommissionSummaryRequest__Output {
  commission: _commission_CommissionFilters__Output | null;
  product: _commission_Product__Output | null;
  calculationSettings: _commission_MigrationCalculationSettings__Output | null;
  promoCode: _commission_PromoCode__Output | null;
  order: _commission_Order__Output | null;
  paymentModuleName: string;
}
