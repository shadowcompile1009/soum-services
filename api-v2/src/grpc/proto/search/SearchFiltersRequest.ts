// Original file: node_modules/soum-proto/proto/search.proto

import type {
  OperationMode as _search_OperationMode,
  OperationMode__Output as _search_OperationMode__Output,
} from '../search/OperationMode';

export interface SearchFiltersRequest {
  q?: string;
  queryBy?: string[];
  queryByWeights?: string[];
  prefix?: string[];
  filterBy?: string;
  sortBy?: string[];
  facetBy?: string[];
  maxFacetValues?: number;
  facetQuery?: string;
  facetQueryNumTypos?: number;
  page?: number;
  perPage?: number;
  groupBy?: string[];
  groupLimit?: number;
  includeFields?: string[];
  excludeFields?: string[];
  highlightFields?: string[];
  highlightFullFields?: string[];
  highlightAffixNumTokens?: number;
  highlightStartTag?: string;
  highlightEndTag?: string;
  snippetThreshold?: number;
  numTypos?: number[];
  minLen_1typo?: number;
  minLen_2typo?: number;
  splitJoinTokens?: _search_OperationMode[];
  exhaustiveSearch?: boolean;
  dropTokensThreshold?: number;
  typoTokensThreshold?: number;
  pinnedHits?: string[];
  hiddenHits?: string[];
  limitHits?: number;
  preSegmentedQuery?: boolean;
  enableOverrides?: boolean;
  prioritizeExactMatch?: boolean;
  prioritizeTokenPosition?: boolean;
  searchCutoffMs?: number;
  useCache?: boolean;
  maxCandidates?: number;
  infix?: _search_OperationMode[];
  preset?: string;
  textMatchType?: string;
  vectorQuery?: string;
  xTypesenseApiKey?: string;
  xTypesenseUserId?: string;
  offset?: number;
  limit?: number;
}

export interface SearchFiltersRequest__Output {
  q: string;
  queryBy: string[];
  queryByWeights: string[];
  prefix: string[];
  filterBy: string;
  sortBy: string[];
  facetBy: string[];
  maxFacetValues: number;
  facetQuery: string;
  facetQueryNumTypos: number;
  page: number;
  perPage: number;
  groupBy: string[];
  groupLimit: number;
  includeFields: string[];
  excludeFields: string[];
  highlightFields: string[];
  highlightFullFields: string[];
  highlightAffixNumTokens: number;
  highlightStartTag: string;
  highlightEndTag: string;
  snippetThreshold: number;
  numTypos: number[];
  minLen_1typo: number;
  minLen_2typo: number;
  splitJoinTokens: _search_OperationMode__Output[];
  exhaustiveSearch: boolean;
  dropTokensThreshold: number;
  typoTokensThreshold: number;
  pinnedHits: string[];
  hiddenHits: string[];
  limitHits: number;
  preSegmentedQuery: boolean;
  enableOverrides: boolean;
  prioritizeExactMatch: boolean;
  prioritizeTokenPosition: boolean;
  searchCutoffMs: number;
  useCache: boolean;
  maxCandidates: number;
  infix: _search_OperationMode__Output[];
  preset: string;
  textMatchType: string;
  vectorQuery: string;
  xTypesenseApiKey: string;
  xTypesenseUserId: string;
  offset: number;
  limit: number;
}
