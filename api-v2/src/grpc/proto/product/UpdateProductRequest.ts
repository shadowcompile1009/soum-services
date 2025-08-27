// Original file: node_modules/soum-proto/proto/product.proto

import type {
  OrderUpdateProductRequest as _product_OrderUpdateProductRequest,
  OrderUpdateProductRequest__Output as _product_OrderUpdateProductRequest__Output,
} from '../product/OrderUpdateProductRequest';

export interface UpdateProductRequest {
  productAction?: string;
  productId?: string;
  order?: _product_OrderUpdateProductRequest | null;
  status?: string;
  _order?: 'order';
  _status?: 'status';
}

export interface UpdateProductRequest__Output {
  productAction: string;
  productId: string;
  order?: _product_OrderUpdateProductRequest__Output | null;
  status?: string;
  _order: 'order';
  _status: 'status';
}
