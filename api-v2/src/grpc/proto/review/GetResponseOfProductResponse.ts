// Original file: node_modules/soum-proto/proto/review.proto

import type {
  Response as _review_Response,
  Response__Output as _review_Response__Output,
} from '../review/Response';

export interface GetResponseOfProductResponse {
  id?: string;
  userId?: string;
  productId?: string;
  score?: number;
  responses?: _review_Response[];
}

export interface GetResponseOfProductResponse__Output {
  id: string;
  userId: string;
  productId: string;
  score: number;
  responses: _review_Response__Output[];
}
