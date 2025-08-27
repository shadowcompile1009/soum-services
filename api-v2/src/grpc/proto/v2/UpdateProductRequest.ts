// Original file: node_modules/soum-proto/proto/v2.proto

import type { UpdateProduct as _v2_UpdateProduct, UpdateProduct__Output as _v2_UpdateProduct__Output } from '../v2/UpdateProduct';

export interface UpdateProductRequest {
  'productId'?: (string);
  'updateProduct'?: (_v2_UpdateProduct | null);
}

export interface UpdateProductRequest__Output {
  'productId': (string);
  'updateProduct': (_v2_UpdateProduct__Output | null);
}
