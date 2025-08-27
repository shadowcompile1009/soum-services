// Original file: node_modules/soum-proto/proto/commission.proto

import type {
  AddonSummaryCalculateData as _commission_AddonSummaryCalculateData,
  AddonSummaryCalculateData__Output as _commission_AddonSummaryCalculateData__Output,
} from '../commission/AddonSummaryCalculateData';

export interface CalculateAddonSummaryRequest {
  productPrice?: number | string;
  addonSummaryCalculateData?: _commission_AddonSummaryCalculateData[];
}

export interface CalculateAddonSummaryRequest__Output {
  productPrice: number;
  addonSummaryCalculateData: _commission_AddonSummaryCalculateData__Output[];
}
