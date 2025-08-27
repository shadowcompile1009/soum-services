// Original file: node_modules/soum-proto/proto/category.proto

import type {
  Banner as _category_Banner,
  Banner__Output as _category_Banner__Output,
} from '../category/Banner';

export interface Condition {
  id?: string;
  name?: string;
  nameAr?: string;
  labelColor?: string;
  textColor?: string;
  banners?: _category_Banner[];
  positionEn?: number;
  positionAr?: number;
}

export interface Condition__Output {
  id: string;
  name: string;
  nameAr: string;
  labelColor: string;
  textColor: string;
  banners: _category_Banner__Output[];
  positionEn: number;
  positionAr: number;
}
