// Original file: node_modules/soum-proto/proto/product.proto

import type {
  Banner as _product_Banner,
  Banner__Output as _product_Banner__Output,
} from '../product/Banner';

export interface Condition {
  id?: string;
  name?: string;
  nameAr?: string;
  labelColor?: string;
  textColor?: string;
  banners?: _product_Banner[];
}

export interface Condition__Output {
  id: string;
  name: string;
  nameAr: string;
  labelColor: string;
  textColor: string;
  banners: _product_Banner__Output[];
}
