// Original file: node_modules/soum-proto/proto/search.proto

import type {
  GroupedHits as _search_GroupedHits,
  GroupedHits__Output as _search_GroupedHits__Output,
} from '../search/GroupedHits';
import type {
  Attribute as _search_Attribute,
  Attribute__Output as _search_Attribute__Output,
} from '../search/Attribute';

export interface _search_SearchResultsResponse_Product {
  arGrade?: string;
  arModelName?: string;
  arVariantName?: string;
  attributes?: _search_Attribute[];
  brandId?: string;
  brandPosition?: number;
  categoryId?: string;
  categoryPosition?: number;
  completionRate?: number | string;
  createdDate?: string;
  grade?: string;
  id?: string;
  isGreatDeal?: boolean;
  isMerchant?: boolean;
  keywordsAr?: string;
  keywordsEn?: string;
  modelId?: string;
  modelName?: string;
  modelImage?: string;
  modelPosition?: number;
  originalPrice?: number;
  priceRange?: string;
  productId?: string;
  productImage?: string;
  productImages?: string[];
  sellPrice?: number;
  sellerId?: string;
  sortScore?: number;
  tags?: string;
  variantName?: string;
}

export interface _search_SearchResultsResponse_Product__Output {
  arGrade: string;
  arModelName: string;
  arVariantName: string;
  attributes: _search_Attribute__Output[];
  brandId: string;
  brandPosition: number;
  categoryId: string;
  categoryPosition: number;
  completionRate: number;
  createdDate: string;
  grade: string;
  id: string;
  isGreatDeal: boolean;
  isMerchant: boolean;
  keywordsAr: string;
  keywordsEn: string;
  modelId: string;
  modelName: string;
  modelImage: string;
  modelPosition: number;
  originalPrice: number;
  priceRange: string;
  productId: string;
  productImage: string;
  productImages: string[];
  sellPrice: number;
  sellerId: string;
  sortScore: number;
  tags: string;
  variantName: string;
}

export interface SearchResultsResponse {
  hits?: _search_SearchResultsResponse_Product[];
  found?: number;
  foundDocs?: number;
  outOf?: number;
  page?: number;
  groupedHits?: _search_GroupedHits[];
}

export interface SearchResultsResponse__Output {
  hits: _search_SearchResultsResponse_Product__Output[];
  found: number;
  foundDocs: number;
  outOf: number;
  page: number;
  groupedHits: _search_GroupedHits__Output[];
}
