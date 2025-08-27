// Original file: node_modules/soum-proto/proto/commission.proto

export interface GetPromoDetailsResponse {
  promoLimit?: number | string;
  promoType?: string;
  promoGenerator?: string;
  discount?: number | string;
  percentage?: number | string;
  id?: string;
  _promoLimit?: 'promoLimit';
  _discount?: 'discount';
  _percentage?: 'percentage';
}

export interface GetPromoDetailsResponse__Output {
  promoLimit?: number;
  promoType: string;
  promoGenerator: string;
  discount?: number;
  percentage?: number;
  id: string;
  _promoLimit: 'promoLimit';
  _discount: 'discount';
  _percentage: 'percentage';
}
