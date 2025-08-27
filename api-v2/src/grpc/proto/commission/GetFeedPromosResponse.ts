// Original file: node_modules/soum-proto/proto/commission.proto

import type {
  DetailedPromoCode as _commission_DetailedPromoCode,
  DetailedPromoCode__Output as _commission_DetailedPromoCode__Output,
} from '../commission/DetailedPromoCode';

export interface GetFeedPromosResponse {
  DetailedPromoCode?: _commission_DetailedPromoCode[];
}

export interface GetFeedPromosResponse__Output {
  DetailedPromoCode: _commission_DetailedPromoCode__Output[];
}
