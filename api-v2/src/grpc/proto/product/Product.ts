// Original file: node_modules/soum-proto/proto/product.proto

import type {
  Category as _product_Category,
  Category__Output as _product_Category__Output,
} from '../product/Category';
import type {
  StatusSummary as _product_StatusSummary,
  StatusSummary__Output as _product_StatusSummary__Output,
} from '../product/StatusSummary';

export interface Product {
  id?: string;
  description?: string;
  categories?: _product_Category[];
  imagesUrl?: string[];
  score?: number | string;
  sellPrice?: number | string;
  status?: string;
  sellType?: string;
  userId?: string;
  groupListingId?: string;
  statusSummary?: _product_StatusSummary | null;
}

export interface Product__Output {
  id: string;
  description: string;
  categories: _product_Category__Output[];
  imagesUrl: string[];
  score: number;
  sellPrice: number;
  status: string;
  sellType: string;
  userId: string;
  groupListingId: string;
  statusSummary: _product_StatusSummary__Output | null;
}
