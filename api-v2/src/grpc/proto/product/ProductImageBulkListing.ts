// Original file: node_modules/soum-proto/proto/product.proto

import type {
  URLData as _product_URLData,
  URLData__Output as _product_URLData__Output,
} from '../product/URLData';

export interface ProductImageBulkListing {
  sectionId?: string;
  urls?: _product_URLData[];
}

export interface ProductImageBulkListing__Output {
  sectionId: string;
  urls: _product_URLData__Output[];
}
