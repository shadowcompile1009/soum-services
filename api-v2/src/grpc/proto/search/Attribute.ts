// Original file: node_modules/soum-proto/proto/search.proto

import type {
  Title as _search_Title,
  Title__Output as _search_Title__Output,
} from '../search/Title';
import type {
  Value as _search_Value,
  Value__Output as _search_Value__Output,
} from '../search/Value';

export interface Attribute {
  title?: _search_Title | null;
  value?: _search_Value | null;
}

export interface Attribute__Output {
  title: _search_Title__Output | null;
  value: _search_Value__Output | null;
}
