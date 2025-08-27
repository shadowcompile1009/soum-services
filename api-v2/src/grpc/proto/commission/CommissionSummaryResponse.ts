// Original file: node_modules/soum-proto/proto/commission.proto

import type {
  CommissionAnalysis as _commission_CommissionAnalysis,
  CommissionAnalysis__Output as _commission_CommissionAnalysis__Output,
} from '../commission/CommissionAnalysis';
import type {
  Reservation as _commission_Reservation,
  Reservation__Output as _commission_Reservation__Output,
} from '../commission/Reservation';
import type {
  FinancingRequest as _commission_FinancingRequest,
  FinancingRequest__Output as _commission_FinancingRequest__Output,
} from '../commission/FinancingRequest';

export interface CommissionSummaryResponse {
  id?: string;
  commission?: number | string;
  commissionVat?: number | string;
  deliveryFee?: number | string;
  deliveryFeeVat?: number | string;
  totalVat?: number | string;
  discount?: number | string;
  grandTotal?: number | string;
  commissionDiscount?: number | string;
  sellPrice?: number | string;
  commissionAnalysis?: _commission_CommissionAnalysis | null;
  paymentId?: string;
  reservation?: _commission_Reservation | null;
  addOnsTotal?: number | string;
  addOnsVat?: number | string;
  addOnsGrandTotal?: number | string;
  realEstateVat?: number | string;
  financingRequest?: _commission_FinancingRequest | null;
  paymentCardType?: string;
  _paymentCardType?: 'paymentCardType';
}

export interface CommissionSummaryResponse__Output {
  id: string;
  commission: number;
  commissionVat: number;
  deliveryFee: number;
  deliveryFeeVat: number;
  totalVat: number;
  discount: number;
  grandTotal: number;
  commissionDiscount: number;
  sellPrice: number;
  commissionAnalysis: _commission_CommissionAnalysis__Output | null;
  paymentId: string;
  reservation: _commission_Reservation__Output | null;
  addOnsTotal: number;
  addOnsVat: number;
  addOnsGrandTotal: number;
  realEstateVat: number;
  financingRequest: _commission_FinancingRequest__Output | null;
  paymentCardType?: string;
  _paymentCardType: 'paymentCardType';
}
