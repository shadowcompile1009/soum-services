// Original file: node_modules/soum-proto/proto/category.proto

import type {
  CategoryIds as _category_CategoryIds,
  CategoryIds__Output as _category_CategoryIds__Output,
} from '../category/CategoryIds';

export interface GetCategoriesRequest {
  limit?: number;
  offset?: number;
  type?: string;
  categories?: _category_CategoryIds | null;
  _categories?: 'categories';
}

export interface GetCategoriesRequest__Output {
  limit: number;
  offset: number;
  type: string;
  categories?: _category_CategoryIds__Output | null;
  _categories: 'categories';
}
