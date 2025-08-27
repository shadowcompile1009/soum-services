// Original file: node_modules/soum-proto/proto/category.proto

import type {
  Option as _category_Option,
  Option__Output as _category_Option__Output,
} from '../category/Option';

export interface Attribute {
  id?: string;
  nameEn?: string;
  nameAr?: string;
  status?: string;
  options?: _category_Option[];
}

export interface Attribute__Output {
  id: string;
  nameEn: string;
  nameAr: string;
  status: string;
  options: _category_Option__Output[];
}
