// Original file: node_modules/soum-proto/proto/commission.proto

export interface CommissionAnalysis {
  commissionTotalPercentage?: number | string;
  commissionTotalFixed?: number | string;
  paymentCommissionExtraFees?: number | string;
  paymentCommission?: number | string;
  paymentCommissionVat?: number | string;
  nonPaymentCommission?: number | string;
  nonPaymentCommissionVat?: number | string;
  paymentCommissionWithVat?: number | string;
  nonPaymentCommissionWithVat?: number | string;
  penaltyCommission?: number | string;
  penaltyCommissionVat?: number | string;
  realEstateVat?: number | string;
}

export interface CommissionAnalysis__Output {
  commissionTotalPercentage: number;
  commissionTotalFixed: number;
  paymentCommissionExtraFees: number;
  paymentCommission: number;
  paymentCommissionVat: number;
  nonPaymentCommission: number;
  nonPaymentCommissionVat: number;
  paymentCommissionWithVat: number;
  nonPaymentCommissionWithVat: number;
  penaltyCommission: number;
  penaltyCommissionVat: number;
  realEstateVat: number;
}
