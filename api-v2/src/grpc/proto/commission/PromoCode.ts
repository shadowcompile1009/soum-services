// Original file: node_modules/soum-proto/proto/commission.proto

export interface PromoCode {
  promoLimit?: number;
  type?: string;
  generator?: string;
  discount?: number;
  percentage?: number;
}

export interface PromoCode__Output {
  promoLimit: number;
  type: string;
  generator: string;
  discount: number;
  percentage: number;
}
