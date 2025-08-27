// Original file: node_modules/soum-proto/proto/product.proto

import type {
  ProductImgSections as _product_ProductImgSections,
  ProductImgSections__Output as _product_ProductImgSections__Output,
} from '../product/ProductImgSections';

export interface GetPreSignURLProductImgsRequest {
  categoryId?: string;
  productImages?: _product_ProductImgSections[];
}

export interface GetPreSignURLProductImgsRequest__Output {
  categoryId: string;
  productImages: _product_ProductImgSections__Output[];
}
