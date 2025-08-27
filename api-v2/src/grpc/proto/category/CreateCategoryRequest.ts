// Original file: node_modules/soum-proto/proto/category.proto

import type {
  Icon as _category_Icon,
  Icon__Output as _category_Icon__Output,
} from '../category/Icon';

export interface CreateCategoryRequest {
  name?: string;
  nameAr?: string;
  position?: number;
  status?: string;
  type?: string;
  parentId?: string;
  icons?: _category_Icon[];
  id?: string;
}

export interface CreateCategoryRequest__Output {
  name: string;
  nameAr: string;
  position: number;
  status: string;
  type: string;
  parentId: string;
  icons: _category_Icon__Output[];
  id: string;
}
