// Original file: node_modules/soum-proto/proto/v2.proto

import type { FeedProductAttribute as _v2_FeedProductAttribute, FeedProductAttribute__Output as _v2_FeedProductAttribute__Output } from '../v2/FeedProductAttribute';
import type { Condition as _v2_Condition, Condition__Output as _v2_Condition__Output } from '../v2/Condition';

export interface FeedProduct {
  'originalPrice'?: (number);
  'modelName'?: (string);
  'arModelName'?: (string);
  'productId'?: (string);
  'sellPrice'?: (number);
  'grade'?: (string);
  'arGrade'?: (string);
  'productImage'?: (string);
  'variantName'?: (string);
  'arVariantName'?: (string);
  'discount'?: (number | string);
  'attributes'?: (_v2_FeedProductAttribute)[];
  'productImages'?: (string)[];
  'condition'?: (_v2_Condition | null);
  'showSecurityBadge'?: (boolean);
}

export interface FeedProduct__Output {
  'originalPrice': (number);
  'modelName': (string);
  'arModelName': (string);
  'productId': (string);
  'sellPrice': (number);
  'grade': (string);
  'arGrade': (string);
  'productImage': (string);
  'variantName': (string);
  'arVariantName': (string);
  'discount': (number);
  'attributes': (_v2_FeedProductAttribute__Output)[];
  'productImages': (string)[];
  'condition': (_v2_Condition__Output | null);
  'showSecurityBadge': (boolean);
}
