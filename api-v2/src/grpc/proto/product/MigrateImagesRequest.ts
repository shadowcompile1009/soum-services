// Original file: node_modules/soum-proto/proto/product.proto

import type {
  ProductImgSections as _product_ProductImgSections,
  ProductImgSections__Output as _product_ProductImgSections__Output,
} from '../product/ProductImgSections';

export interface MigrateImagesRequest {
  productId?: string;
  imagesUrl?: string[];
  categoryId?: string;
  productImgSections?: _product_ProductImgSections[];
}

export interface MigrateImagesRequest__Output {
  productId: string;
  imagesUrl: string[];
  categoryId: string;
  productImgSections: _product_ProductImgSections__Output[];
}
