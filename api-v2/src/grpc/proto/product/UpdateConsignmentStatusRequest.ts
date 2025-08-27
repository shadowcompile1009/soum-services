// Original file: node_modules/soum-proto/proto/product.proto

export interface UpdateConsignmentStatusRequest {
  status?: string;
  id?: string;
  orderNumber?: string;
  _id?: 'id';
  _orderNumber?: 'orderNumber';
}

export interface UpdateConsignmentStatusRequest__Output {
  status: string;
  id?: string;
  orderNumber?: string;
  _id: 'id';
  _orderNumber: 'orderNumber';
}
