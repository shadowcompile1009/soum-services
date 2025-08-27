// Original file: node_modules/soum-proto/proto/v2.proto

import type { FeedItem as _v2_FeedItem, FeedItem__Output as _v2_FeedItem__Output } from '../v2/FeedItem';
import type { Model as _v2_Model, Model__Output as _v2_Model__Output } from '../v2/Model';

export interface GetFeedsResponse {
  'feeds'?: (_v2_FeedItem)[];
  'mostSoldModels'?: (_v2_Model)[];
}

export interface GetFeedsResponse__Output {
  'feeds': (_v2_FeedItem__Output)[];
  'mostSoldModels': (_v2_Model__Output)[];
}
