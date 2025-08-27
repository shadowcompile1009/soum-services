/* eslint-disable */
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

export interface GetCategoryByNameRequest {
  name: string;
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

export interface GetAttributesRequest {
  size: number;
  page: number;
  search: string;
  optionsIncluded?: boolean | undefined;
}

export interface Option {
  id: string;
  nameEn: string;
  nameAr: string;
  status: string;
}

export interface Attribute {
  id: string;
  nameEn: string;
  nameAr: string;
  status: string;
  options: Option[];
}

export interface UpdateAttributeRequest {
  id: string;
  nameEn: string;
  nameAr: string;
  status: string;
  options: Option[];
}

export interface UpdateAttributeResponse {
  id: string;
  name: string;
  nameAr: string;
  status: string;
  options: Option[];
}

export interface GetAttributesResponse {
  attributes: Attribute[];
  total: number;
}

export interface DeleteAttributeRequest {
  id: string;
}

export interface DeleteAttributeResponse {
}

export interface GetAttributeRequest {
  id: string;
}

export interface GetAttributeResponse {
  attribute: Attribute | undefined;
}

export interface CreateAttributeRequest {
  name: string;
  nameAr: string;
  status: string;
  options: Option[];
}

export interface CreateAttributeResponse {
  id: string;
  name: string;
  nameAr: string;
  status: string;
  options: Option[];
}

export interface GetConditionsRequest {
  ids: string[];
}

export interface GetConditionsResponse {
  conditions: Condition[];
}

export interface GetMultipleAttributeRequest {
  ids: string[];
}

export interface GetMultipleAttributeResponse {
  attributes: Attribute[];
}

export const CATEGORY_PACKAGE_NAME = "category";

export interface CategoryServiceClient {
  getCatConPriceRange(request: GetCatConPriceRangeRequest): Observable<GetCatConPriceRangeResponse>;

  getProductCatCon(request: GetProductCatConRequest): Observable<GetProductCatConResponse>;

  getConditions(request: GetConditionsRequest): Observable<GetConditionsResponse>;

  getCategories(request: GetCategoriesRequest): Observable<GetCategoriesResponse>;

  createCategory(request: CreateCategoryRequest): Observable<CreateCategoryResponse>;

  getCategoryByName(request: GetCategoryByNameRequest): Observable<Category>;

  getAttributes(request: GetAttributesRequest): Observable<GetAttributesResponse>;

  updateAttribute(request: UpdateAttributeRequest): Observable<UpdateAttributeResponse>;

  deleteAttribute(request: DeleteAttributeRequest): Observable<DeleteAttributeResponse>;

  getAttribute(request: GetAttributeRequest): Observable<GetAttributeResponse>;

  createAttribute(request: CreateAttributeRequest): Observable<CreateAttributeResponse>;

  getMultipleAttribute(request: GetMultipleAttributeRequest): Observable<GetMultipleAttributeResponse>;
}

export interface CategoryServiceController {
  getCatConPriceRange(
    request: GetCatConPriceRangeRequest,
  ): Promise<GetCatConPriceRangeResponse> | Observable<GetCatConPriceRangeResponse> | GetCatConPriceRangeResponse;

  getProductCatCon(
    request: GetProductCatConRequest,
  ): Promise<GetProductCatConResponse> | Observable<GetProductCatConResponse> | GetProductCatConResponse;

  getConditions(
    request: GetConditionsRequest,
  ): Promise<GetConditionsResponse> | Observable<GetConditionsResponse> | GetConditionsResponse;

  getCategories(
    request: GetCategoriesRequest,
  ): Promise<GetCategoriesResponse> | Observable<GetCategoriesResponse> | GetCategoriesResponse;

  createCategory(
    request: CreateCategoryRequest,
  ): Promise<CreateCategoryResponse> | Observable<CreateCategoryResponse> | CreateCategoryResponse;

  getCategoryByName(request: GetCategoryByNameRequest): Promise<Category> | Observable<Category> | Category;

  getAttributes(
    request: GetAttributesRequest,
  ): Promise<GetAttributesResponse> | Observable<GetAttributesResponse> | GetAttributesResponse;

  updateAttribute(
    request: UpdateAttributeRequest,
  ): Promise<UpdateAttributeResponse> | Observable<UpdateAttributeResponse> | UpdateAttributeResponse;

  deleteAttribute(
    request: DeleteAttributeRequest,
  ): Promise<DeleteAttributeResponse> | Observable<DeleteAttributeResponse> | DeleteAttributeResponse;

  getAttribute(
    request: GetAttributeRequest,
  ): Promise<GetAttributeResponse> | Observable<GetAttributeResponse> | GetAttributeResponse;

  createAttribute(
    request: CreateAttributeRequest,
  ): Promise<CreateAttributeResponse> | Observable<CreateAttributeResponse> | CreateAttributeResponse;

  getMultipleAttribute(
    request: GetMultipleAttributeRequest,
  ): Promise<GetMultipleAttributeResponse> | Observable<GetMultipleAttributeResponse> | GetMultipleAttributeResponse;
}

export function CategoryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getCatConPriceRange",
      "getProductCatCon",
      "getConditions",
      "getCategories",
      "createCategory",
      "getCategoryByName",
      "getAttributes",
      "updateAttribute",
      "deleteAttribute",
      "getAttribute",
      "createAttribute",
      "getMultipleAttribute",
    ];
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
