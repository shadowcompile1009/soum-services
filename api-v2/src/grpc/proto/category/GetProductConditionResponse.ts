// Original file: node_modules/soum-proto/proto/category.proto

import type {
  Banner as _category_Banner,
  Banner__Output as _category_Banner__Output,
} from '../category/Banner';
import type {
  PriceQuality as _category_PriceQuality,
  PriceQuality__Output as _category_PriceQuality__Output,
} from '../category/PriceQuality';

export interface GetProductCatConResponse {
  id?: string;
  name?: string;
  nameAr?: string;
  labelColor?: string;
  textColor?: string;
  banners?: _category_Banner[];
  priceQuality?: _category_PriceQuality | null;
}

export interface GetProductCatConResponse__Output {
  id: string;
  name: string;
  nameAr: string;
  labelColor: string;
  textColor: string;
  banners: _category_Banner__Output[];
  priceQuality: _category_PriceQuality__Output | null;
}
