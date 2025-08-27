/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "category";

export interface GetCatConPriceRangeRequest {
  variantId: string;
  conditionId: string;
  catConditionQuality: string;
}

export interface GetCatConPriceRangeResponse {
  priceRange: PriceNudge | undefined;
}

export interface PriceNudge {
  min: number;
  max: number;
}

export interface GetProductCatConRequest {
  id: string;
  variantId: string;
  sellPrice: number;
}

export interface GetProductCatConResponse {
  condition: Condition | undefined;
  priceQuality: PriceQuality | undefined;
}

export interface Banner {
  lang: string;
  url: string;
  source: string;
}

export interface PriceQuality {
  name: string;
}

export interface Condition {
  id: string;
  name: string;
  nameAr: string;
  labelColor: string;
  textColor: string;
  banners: Banner[];
}

export interface GetCategoriesRequest {
  limit: number;
  offset: number;
  type: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  status: string;
  type: string;
  parentId: string;
  icon: Icon | undefined;
  position: number;
}

export interface GetCategoriesResponse {
  categories: Category[];
}

export interface CreateCategoryRequest {
  name: string;
  nameAr: string;
  position: number;
  status: string;
  type: string;
  parentId: string;
  icons: Icon[];
  id: string;
}

export interface Icon {
  type: string;
  url: string;
  source: string;
}

export interface CreateCategoryResponse {
}

export const CATEGORY_PACKAGE_NAME = "category";

export interface CategoryServiceClient {
  getCatConPriceRange(
    request: GetCatConPriceRangeRequest,
    metadata?: Metadata,
  ): Observable<GetCatConPriceRangeResponse>;

  getProductCatCon(request: GetProductCatConRequest, metadata?: Metadata): Observable<GetProductCatConResponse>;

  getCategories(request: GetCategoriesRequest, metadata?: Metadata): Observable<GetCategoriesResponse>;

  createCategory(request: CreateCategoryRequest, metadata?: Metadata): Observable<CreateCategoryResponse>;
}

export interface CategoryServiceController {
  getCatConPriceRange(
    request: GetCatConPriceRangeRequest,
    metadata?: Metadata,
  ): Promise<GetCatConPriceRangeResponse> | Observable<GetCatConPriceRangeResponse> | GetCatConPriceRangeResponse;

  getProductCatCon(
    request: GetProductCatConRequest,
    metadata?: Metadata,
  ): Promise<GetProductCatConResponse> | Observable<GetProductCatConResponse> | GetProductCatConResponse;

  getCategories(
    request: GetCategoriesRequest,
    metadata?: Metadata,
  ): Promise<GetCategoriesResponse> | Observable<GetCategoriesResponse> | GetCategoriesResponse;

  createCategory(
    request: CreateCategoryRequest,
    metadata?: Metadata,
  ): Promise<CreateCategoryResponse> | Observable<CreateCategoryResponse> | CreateCategoryResponse;
}

export function CategoryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getCatConPriceRange", "getProductCatCon", "getCategories", "createCategory"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("CategoryService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("CategoryService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const CATEGORY_SERVICE_NAME = "CategoryService";
