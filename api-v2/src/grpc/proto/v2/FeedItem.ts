// Original file: node_modules/soum-proto/proto/v2.proto

import type { FeedProduct as _v2_FeedProduct, FeedProduct__Output as _v2_FeedProduct__Output } from '../v2/FeedProduct';

export interface FeedItem {
  'id'?: (string);
  'arName'?: (string);
  'enName'?: (string);
  'items'?: (_v2_FeedProduct)[];
  'arTitle'?: (string);
  'enTitle'?: (string);
  'expiryDate'?: (string);
  'feedType'?: (string);
  'maxBudget'?: (number);
  'imgURL'?: (string);
  'position'?: (number);
  'totalActiveProducts'?: (number);
  'totalProducts'?: (number);
}

export interface FeedItem__Output {
  'id': (string);
  'arName': (string);
  'enName': (string);
  'items': (_v2_FeedProduct__Output)[];
  'arTitle': (string);
  'enTitle': (string);
  'expiryDate': (string);
  'feedType': (string);
  'maxBudget': (number);
  'imgURL': (string);
  'position': (number);
  'totalActiveProducts': (number);
  'totalProducts': (number);
}
