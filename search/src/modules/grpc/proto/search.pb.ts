/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "search";

export enum OperationMode {
  MODE_UNSPECIFIED = 0,
  OPERATION_MODE_1 = 1,
  OPERATION_MODE_2 = 2,
  UNRECOGNIZED = -1,
}

export interface Title {
  arName: string;
  enName: string;
}

export interface Value {
  arName: string;
  enName: string;
}

export interface Attribute {
  title: Title | undefined;
  value: Value | undefined;
}

export interface SearchResultsResponse {
  products: SearchResultsResponse_Product[];
}

export interface SearchResultsResponse_Product {
  arGrade: string;
  arModelName: string;
  arVariantName: string;
  attributes: Attribute[];
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

export interface SearchRequest {
  filters: SearchFiltersRequest | undefined;
}

export interface SearchFiltersRequest {
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
  minLen1typo: number;
  minLen2typo: number;
  splitJoinTokens: OperationMode[];
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
  infix: OperationMode[];
  preset: string;
  textMatchType: string;
  vectorQuery: string;
  xTypesenseApiKey: string;
  xTypesenseUserId: string;
  offset: number;
  limit: number;
}

export const SEARCH_PACKAGE_NAME = "search";

export interface SearchServiceClient {
  getProducts(request: SearchRequest): Observable<SearchResultsResponse>;
}

export interface SearchServiceController {
  getProducts(request: SearchRequest): Observable<SearchResultsResponse>;
}

export function SearchServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getProducts"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("SearchService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("SearchService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SEARCH_SERVICE_NAME = "SearchService";
