// Original file: node_modules/soum-proto/proto/recommendation.proto

import type {
  AddNewItemRequest as _recommendation_AddNewItemRequest,
  AddNewItemRequest__Output as _recommendation_AddNewItemRequest__Output,
} from '../recommendation/AddNewItemRequest';

export interface AddMultipleItemsRequest {
  items?: _recommendation_AddNewItemRequest[];
}

export interface AddMultipleItemsRequest__Output {
  items: _recommendation_AddNewItemRequest__Output[];
}
