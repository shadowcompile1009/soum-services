// Original file: node_modules/soum-proto/proto/commission.proto

export interface Product {
  id?: string;
  sellPrice?: number;
  priceRange?: string;
  source?: string;
  categoryId?: string;
  modelId?: string;
  varientId?: string;
  conditionId?: string;
}

export interface Product__Output {
  id: string;
  sellPrice: number;
  priceRange: string;
  source: string;
  categoryId: string;
  modelId: string;
  varientId: string;
  conditionId: string;
}
