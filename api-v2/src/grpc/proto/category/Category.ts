// Original file: node_modules/soum-proto/proto/category.proto

import type {
  Icon as _category_Icon,
  Icon__Output as _category_Icon__Output,
} from '../category/Icon';

export interface Category {
  id?: string;
  name?: string;
  nameAr?: string;
  status?: string;
  type?: string;
  parentId?: string;
  icon?: _category_Icon | null;
  position?: number;
}

export interface Category__Output {
  id: string;
  name: string;
  nameAr: string;
  status: string;
  type: string;
  parentId: string;
  icon: _category_Icon__Output | null;
  position: number;
}
