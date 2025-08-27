// Original file: node_modules/soum-proto/proto/v2.proto

import type { Title as _v2_Title, Title__Output as _v2_Title__Output } from '../v2/Title';
import type { Value as _v2_Value, Value__Output as _v2_Value__Output } from '../v2/Value';

export interface FeedProductAttribute {
  'title'?: (_v2_Title | null);
  'value'?: (_v2_Value | null);
}

export interface FeedProductAttribute__Output {
  'title': (_v2_Title__Output | null);
  'value': (_v2_Value__Output | null);
}
