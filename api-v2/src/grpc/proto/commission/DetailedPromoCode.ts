// Original file: node_modules/soum-proto/proto/commission.proto

import type {
  PromoCodeScope as _commission_PromoCodeScope,
  PromoCodeScope__Output as _commission_PromoCodeScope__Output,
} from '../commission/PromoCodeScope';
import type {
  AvailablePayment as _commission_AvailablePayment,
  AvailablePayment__Output as _commission_AvailablePayment__Output,
} from '../commission/AvailablePayment';

export interface DetailedPromoCode {
  promoLimit?: number | string;
  promoType?: string;
  promoGenerator?: string;
  discount?: number | string;
  percentage?: number | string;
  id?: string;
  userType?: string;
  status?: string;
  code?: string;
  isDefault?: boolean;
  promoCodeScope?: _commission_PromoCodeScope[];
  availablePayment?: _commission_AvailablePayment[];
  _promoLimit?: 'promoLimit';
  _discount?: 'discount';
  _percentage?: 'percentage';
}

export interface DetailedPromoCode__Output {
  promoLimit?: number;
  promoType: string;
  promoGenerator: string;
  discount?: number;
  percentage?: number;
  id: string;
  userType: string;
  status: string;
  code: string;
  isDefault: boolean;
  promoCodeScope: _commission_PromoCodeScope__Output[];
  availablePayment: _commission_AvailablePayment__Output[];
  _promoLimit: 'promoLimit';
  _discount: 'discount';
  _percentage: 'percentage';
}
