// Original file: node_modules/soum-proto/proto/v2.proto

import type { CommissionAnalysis as _v2_CommissionAnalysis, CommissionAnalysis__Output as _v2_CommissionAnalysis__Output } from '../v2/CommissionAnalysis';

export interface CommissionSummaryResponse {
  'id'?: (string);
  'commission'?: (number | string);
  'commissionVat'?: (number | string);
  'deliveryFee'?: (number | string);
  'deliveryFeeVat'?: (number | string);
  'totalVat'?: (number | string);
  'discount'?: (number | string);
  'grandTotal'?: (number | string);
  'commissionDiscount'?: (number | string);
  'sellPrice'?: (number | string);
  'commissionAnalysis'?: (_v2_CommissionAnalysis | null);
  'paymentId'?: (string);
}

export interface CommissionSummaryResponse__Output {
  'id': (string);
  'commission': (number);
  'commissionVat': (number);
  'deliveryFee': (number);
  'deliveryFeeVat': (number);
  'totalVat': (number);
  'discount': (number);
  'grandTotal': (number);
  'commissionDiscount': (number);
  'sellPrice': (number);
  'commissionAnalysis': (_v2_CommissionAnalysis__Output | null);
  'paymentId': (string);
}
