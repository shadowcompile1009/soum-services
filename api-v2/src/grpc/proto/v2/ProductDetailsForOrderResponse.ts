// Original file: node_modules/soum-proto/proto/v2.proto

import type {
  ProductBillingSettings as _v2_ProductBillingSettings,
  ProductBillingSettings__Output as _v2_ProductBillingSettings__Output,
} from '../v2/ProductBillingSettings';

export interface _v2_ProductDetailsForOrderResponse_ProductProperties {
  modelId?: string;
  varientId?: string;
  categoryId?: string;
  brandId?: string;
  modelName?: string;
  modelNameAr?: string;
  varientName?: string;
  varientNameAr?: string;
  categoryName?: string;
  categoryNameAr?: string;
  brandName?: string;
  brandNameAr?: string;
  currentPrice?: number | string;
  grade?: string;
  gradeAr?: string;
  productImages?: string[];
}

export interface _v2_ProductDetailsForOrderResponse_ProductProperties__Output {
  modelId: string;
  varientId: string;
  categoryId: string;
  brandId: string;
  modelName: string;
  modelNameAr: string;
  varientName: string;
  varientNameAr: string;
  categoryName: string;
  categoryNameAr: string;
  brandName: string;
  brandNameAr: string;
  currentPrice: number;
  grade: string;
  gradeAr: string;
  productImages: string[];
}

export interface ProductDetailsForOrderResponse {
  sellStatus?: string;
  userId?: string;
  status?: string;
  id?: string;
  sellPrice?: number | string;
  billingSettings?: _v2_ProductBillingSettings | null;
  conditionId?: string;
  userType?: string;
  productProperties?: _v2_ProductDetailsForOrderResponse_ProductProperties | null;
  _billingSettings?: 'billingSettings';
}

export interface ProductDetailsForOrderResponse__Output {
  sellStatus: string;
  userId: string;
  status: string;
  id: string;
  sellPrice: number;
  billingSettings?: _v2_ProductBillingSettings__Output | null;
  conditionId: string;
  userType: string;
  productProperties: _v2_ProductDetailsForOrderResponse_ProductProperties__Output | null;
  _billingSettings: 'billingSettings';
}
