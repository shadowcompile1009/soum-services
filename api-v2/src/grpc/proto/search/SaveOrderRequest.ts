// Original file: node_modules/soum-proto/proto/search.proto

import type {
  Order as _search_Order,
  Order__Output as _search_Order__Output,
} from '../search/Order';

export interface SaveOrderRequest {
  orders?: _search_Order[];
}

export interface SaveOrderRequest__Output {
  orders: _search_Order__Output[];
}
