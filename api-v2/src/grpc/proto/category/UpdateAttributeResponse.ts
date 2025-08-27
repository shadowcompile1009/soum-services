// Original file: node_modules/soum-proto/proto/category.proto

import type {
  Option as _category_Option,
  Option__Output as _category_Option__Output,
} from '../category/Option';

export interface UpdateAttributeResponse {
  id?: string;
  name?: string;
  nameAr?: string;
  status?: string;
  options?: _category_Option[];
}

export interface UpdateAttributeResponse__Output {
  id: string;
  name: string;
  nameAr: string;
  status: string;
  options: _category_Option__Output[];
}
