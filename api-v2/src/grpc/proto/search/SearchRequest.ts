// Original file: node_modules/soum-proto/proto/search.proto

import type {
  SearchFiltersRequest as _search_SearchFiltersRequest,
  SearchFiltersRequest__Output as _search_SearchFiltersRequest__Output,
} from '../search/SearchFiltersRequest';

export interface SearchRequest {
  filters?: _search_SearchFiltersRequest | null;
}

export interface SearchRequest__Output {
  filters: _search_SearchFiltersRequest__Output | null;
}
