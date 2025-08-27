// Original file: node_modules/soum-proto/proto/v2.proto


export interface CommissionAnalysis {
  'commissionTotalPercentage'?: (number | string);
  'commissionTotalFixed'?: (number | string);
  'paymentCommissionExtraFees'?: (number | string);
  'paymentCommission'?: (number | string);
  'paymentCommissionVat'?: (number | string);
  'nonPaymentCommission'?: (number | string);
  'nonPaymentCommissionVat'?: (number | string);
  'paymentCommissionWithVat'?: (number | string);
  'nonPaymentCommissionWithVat'?: (number | string);
}

export interface CommissionAnalysis__Output {
  'commissionTotalPercentage': (number);
  'commissionTotalFixed': (number);
  'paymentCommissionExtraFees': (number);
  'paymentCommission': (number);
  'paymentCommissionVat': (number);
  'nonPaymentCommission': (number);
  'nonPaymentCommissionVat': (number);
  'paymentCommissionWithVat': (number);
  'nonPaymentCommissionWithVat': (number);
}
