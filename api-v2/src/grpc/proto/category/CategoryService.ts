// Original file: node_modules/soum-proto/proto/category.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  Category as _category_Category,
  Category__Output as _category_Category__Output,
} from '../category/Category';
import type {
  CreateAttributeRequest as _category_CreateAttributeRequest,
  CreateAttributeRequest__Output as _category_CreateAttributeRequest__Output,
} from '../category/CreateAttributeRequest';
import type {
  CreateAttributeResponse as _category_CreateAttributeResponse,
  CreateAttributeResponse__Output as _category_CreateAttributeResponse__Output,
} from '../category/CreateAttributeResponse';
import type {
  CreateCategoryRequest as _category_CreateCategoryRequest,
  CreateCategoryRequest__Output as _category_CreateCategoryRequest__Output,
} from '../category/CreateCategoryRequest';
import type {
  CreateCategoryResponse as _category_CreateCategoryResponse,
  CreateCategoryResponse__Output as _category_CreateCategoryResponse__Output,
} from '../category/CreateCategoryResponse';
import type {
  DeleteAttributeRequest as _category_DeleteAttributeRequest,
  DeleteAttributeRequest__Output as _category_DeleteAttributeRequest__Output,
} from '../category/DeleteAttributeRequest';
import type {
  DeleteAttributeResponse as _category_DeleteAttributeResponse,
  DeleteAttributeResponse__Output as _category_DeleteAttributeResponse__Output,
} from '../category/DeleteAttributeResponse';
import type {
  GetAttributeRequest as _category_GetAttributeRequest,
  GetAttributeRequest__Output as _category_GetAttributeRequest__Output,
} from '../category/GetAttributeRequest';
import type {
  GetAttributeResponse as _category_GetAttributeResponse,
  GetAttributeResponse__Output as _category_GetAttributeResponse__Output,
} from '../category/GetAttributeResponse';
import type {
  GetAttributesRequest as _category_GetAttributesRequest,
  GetAttributesRequest__Output as _category_GetAttributesRequest__Output,
} from '../category/GetAttributesRequest';
import type {
  GetAttributesResponse as _category_GetAttributesResponse,
  GetAttributesResponse__Output as _category_GetAttributesResponse__Output,
} from '../category/GetAttributesResponse';
import type {
  GetCatConPriceRangeRequest as _category_GetCatConPriceRangeRequest,
  GetCatConPriceRangeRequest__Output as _category_GetCatConPriceRangeRequest__Output,
} from '../category/GetCatConPriceRangeRequest';
import type {
  GetCatConPriceRangeResponse as _category_GetCatConPriceRangeResponse,
  GetCatConPriceRangeResponse__Output as _category_GetCatConPriceRangeResponse__Output,
} from '../category/GetCatConPriceRangeResponse';
import type {
  GetCategoriesByIdsRequest as _category_GetCategoriesByIdsRequest,
  GetCategoriesByIdsRequest__Output as _category_GetCategoriesByIdsRequest__Output,
} from '../category/GetCategoriesByIdsRequest';
import type {
  GetCategoriesByIdsResponse as _category_GetCategoriesByIdsResponse,
  GetCategoriesByIdsResponse__Output as _category_GetCategoriesByIdsResponse__Output,
} from '../category/GetCategoriesByIdsResponse';
import type {
  GetCategoriesRequest as _category_GetCategoriesRequest,
  GetCategoriesRequest__Output as _category_GetCategoriesRequest__Output,
} from '../category/GetCategoriesRequest';
import type {
  GetCategoriesResponse as _category_GetCategoriesResponse,
  GetCategoriesResponse__Output as _category_GetCategoriesResponse__Output,
} from '../category/GetCategoriesResponse';
import type {
  GetCategoryByNameRequest as _category_GetCategoryByNameRequest,
  GetCategoryByNameRequest__Output as _category_GetCategoryByNameRequest__Output,
} from '../category/GetCategoryByNameRequest';
import type {
  GetConditionsRequest as _category_GetConditionsRequest,
  GetConditionsRequest__Output as _category_GetConditionsRequest__Output,
} from '../category/GetConditionsRequest';
import type {
  GetConditionsResponse as _category_GetConditionsResponse,
  GetConditionsResponse__Output as _category_GetConditionsResponse__Output,
} from '../category/GetConditionsResponse';
import type {
  GetMultipleAttributeRequest as _category_GetMultipleAttributeRequest,
  GetMultipleAttributeRequest__Output as _category_GetMultipleAttributeRequest__Output,
} from '../category/GetMultipleAttributeRequest';
import type {
  GetMultipleAttributeResponse as _category_GetMultipleAttributeResponse,
  GetMultipleAttributeResponse__Output as _category_GetMultipleAttributeResponse__Output,
} from '../category/GetMultipleAttributeResponse';
import type {
  GetProductCatConRequest as _category_GetProductCatConRequest,
  GetProductCatConRequest__Output as _category_GetProductCatConRequest__Output,
} from '../category/GetProductCatConRequest';
import type {
  GetProductCatConResponse as _category_GetProductCatConResponse,
  GetProductCatConResponse__Output as _category_GetProductCatConResponse__Output,
} from '../category/GetProductCatConResponse';
import type {
  UpdateAttributeRequest as _category_UpdateAttributeRequest,
  UpdateAttributeRequest__Output as _category_UpdateAttributeRequest__Output,
} from '../category/UpdateAttributeRequest';
import type {
  UpdateAttributeResponse as _category_UpdateAttributeResponse,
  UpdateAttributeResponse__Output as _category_UpdateAttributeResponse__Output,
} from '../category/UpdateAttributeResponse';

export interface CategoryServiceClient extends grpc.Client {
  CreateAttribute(
    argument: _category_CreateAttributeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_CreateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateAttribute(
    argument: _category_CreateAttributeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_CreateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateAttribute(
    argument: _category_CreateAttributeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_CreateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateAttribute(
    argument: _category_CreateAttributeRequest,
    callback: grpc.requestCallback<_category_CreateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  createAttribute(
    argument: _category_CreateAttributeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_CreateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  createAttribute(
    argument: _category_CreateAttributeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_CreateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  createAttribute(
    argument: _category_CreateAttributeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_CreateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  createAttribute(
    argument: _category_CreateAttributeRequest,
    callback: grpc.requestCallback<_category_CreateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;

  CreateCategory(
    argument: _category_CreateCategoryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_CreateCategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateCategory(
    argument: _category_CreateCategoryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_CreateCategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateCategory(
    argument: _category_CreateCategoryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_CreateCategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateCategory(
    argument: _category_CreateCategoryRequest,
    callback: grpc.requestCallback<_category_CreateCategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  createCategory(
    argument: _category_CreateCategoryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_CreateCategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  createCategory(
    argument: _category_CreateCategoryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_CreateCategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  createCategory(
    argument: _category_CreateCategoryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_CreateCategoryResponse__Output>
  ): grpc.ClientUnaryCall;
  createCategory(
    argument: _category_CreateCategoryRequest,
    callback: grpc.requestCallback<_category_CreateCategoryResponse__Output>
  ): grpc.ClientUnaryCall;

  DeleteAttribute(
    argument: _category_DeleteAttributeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_DeleteAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  DeleteAttribute(
    argument: _category_DeleteAttributeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_DeleteAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  DeleteAttribute(
    argument: _category_DeleteAttributeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_DeleteAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  DeleteAttribute(
    argument: _category_DeleteAttributeRequest,
    callback: grpc.requestCallback<_category_DeleteAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  deleteAttribute(
    argument: _category_DeleteAttributeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_DeleteAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  deleteAttribute(
    argument: _category_DeleteAttributeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_DeleteAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  deleteAttribute(
    argument: _category_DeleteAttributeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_DeleteAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  deleteAttribute(
    argument: _category_DeleteAttributeRequest,
    callback: grpc.requestCallback<_category_DeleteAttributeResponse__Output>
  ): grpc.ClientUnaryCall;

  GetAttribute(
    argument: _category_GetAttributeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetAttribute(
    argument: _category_GetAttributeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetAttribute(
    argument: _category_GetAttributeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetAttribute(
    argument: _category_GetAttributeRequest,
    callback: grpc.requestCallback<_category_GetAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  getAttribute(
    argument: _category_GetAttributeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  getAttribute(
    argument: _category_GetAttributeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  getAttribute(
    argument: _category_GetAttributeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  getAttribute(
    argument: _category_GetAttributeRequest,
    callback: grpc.requestCallback<_category_GetAttributeResponse__Output>
  ): grpc.ClientUnaryCall;

  GetAttributes(
    argument: _category_GetAttributesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetAttributesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetAttributes(
    argument: _category_GetAttributesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetAttributesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetAttributes(
    argument: _category_GetAttributesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetAttributesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetAttributes(
    argument: _category_GetAttributesRequest,
    callback: grpc.requestCallback<_category_GetAttributesResponse__Output>
  ): grpc.ClientUnaryCall;
  getAttributes(
    argument: _category_GetAttributesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetAttributesResponse__Output>
  ): grpc.ClientUnaryCall;
  getAttributes(
    argument: _category_GetAttributesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetAttributesResponse__Output>
  ): grpc.ClientUnaryCall;
  getAttributes(
    argument: _category_GetAttributesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetAttributesResponse__Output>
  ): grpc.ClientUnaryCall;
  getAttributes(
    argument: _category_GetAttributesRequest,
    callback: grpc.requestCallback<_category_GetAttributesResponse__Output>
  ): grpc.ClientUnaryCall;

  GetCatConPriceRange(
    argument: _category_GetCatConPriceRangeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetCatConPriceRangeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCatConPriceRange(
    argument: _category_GetCatConPriceRangeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetCatConPriceRangeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCatConPriceRange(
    argument: _category_GetCatConPriceRangeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetCatConPriceRangeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCatConPriceRange(
    argument: _category_GetCatConPriceRangeRequest,
    callback: grpc.requestCallback<_category_GetCatConPriceRangeResponse__Output>
  ): grpc.ClientUnaryCall;
  getCatConPriceRange(
    argument: _category_GetCatConPriceRangeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetCatConPriceRangeResponse__Output>
  ): grpc.ClientUnaryCall;
  getCatConPriceRange(
    argument: _category_GetCatConPriceRangeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetCatConPriceRangeResponse__Output>
  ): grpc.ClientUnaryCall;
  getCatConPriceRange(
    argument: _category_GetCatConPriceRangeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetCatConPriceRangeResponse__Output>
  ): grpc.ClientUnaryCall;
  getCatConPriceRange(
    argument: _category_GetCatConPriceRangeRequest,
    callback: grpc.requestCallback<_category_GetCatConPriceRangeResponse__Output>
  ): grpc.ClientUnaryCall;

  GetCategories(
    argument: _category_GetCategoriesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetCategoriesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCategories(
    argument: _category_GetCategoriesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetCategoriesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCategories(
    argument: _category_GetCategoriesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetCategoriesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCategories(
    argument: _category_GetCategoriesRequest,
    callback: grpc.requestCallback<_category_GetCategoriesResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategories(
    argument: _category_GetCategoriesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetCategoriesResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategories(
    argument: _category_GetCategoriesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetCategoriesResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategories(
    argument: _category_GetCategoriesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetCategoriesResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategories(
    argument: _category_GetCategoriesRequest,
    callback: grpc.requestCallback<_category_GetCategoriesResponse__Output>
  ): grpc.ClientUnaryCall;

  GetCategoriesByIds(
    argument: _category_GetCategoriesByIdsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetCategoriesByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCategoriesByIds(
    argument: _category_GetCategoriesByIdsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetCategoriesByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCategoriesByIds(
    argument: _category_GetCategoriesByIdsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetCategoriesByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCategoriesByIds(
    argument: _category_GetCategoriesByIdsRequest,
    callback: grpc.requestCallback<_category_GetCategoriesByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategoriesByIds(
    argument: _category_GetCategoriesByIdsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetCategoriesByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategoriesByIds(
    argument: _category_GetCategoriesByIdsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetCategoriesByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategoriesByIds(
    argument: _category_GetCategoriesByIdsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetCategoriesByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCategoriesByIds(
    argument: _category_GetCategoriesByIdsRequest,
    callback: grpc.requestCallback<_category_GetCategoriesByIdsResponse__Output>
  ): grpc.ClientUnaryCall;

  GetCategoryByName(
    argument: _category_GetCategoryByNameRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_Category__Output>
  ): grpc.ClientUnaryCall;
  GetCategoryByName(
    argument: _category_GetCategoryByNameRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_Category__Output>
  ): grpc.ClientUnaryCall;
  GetCategoryByName(
    argument: _category_GetCategoryByNameRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_Category__Output>
  ): grpc.ClientUnaryCall;
  GetCategoryByName(
    argument: _category_GetCategoryByNameRequest,
    callback: grpc.requestCallback<_category_Category__Output>
  ): grpc.ClientUnaryCall;
  getCategoryByName(
    argument: _category_GetCategoryByNameRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_Category__Output>
  ): grpc.ClientUnaryCall;
  getCategoryByName(
    argument: _category_GetCategoryByNameRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_Category__Output>
  ): grpc.ClientUnaryCall;
  getCategoryByName(
    argument: _category_GetCategoryByNameRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_Category__Output>
  ): grpc.ClientUnaryCall;
  getCategoryByName(
    argument: _category_GetCategoryByNameRequest,
    callback: grpc.requestCallback<_category_Category__Output>
  ): grpc.ClientUnaryCall;

  GetConditions(
    argument: _category_GetConditionsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetConditionsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetConditions(
    argument: _category_GetConditionsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetConditionsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetConditions(
    argument: _category_GetConditionsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetConditionsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetConditions(
    argument: _category_GetConditionsRequest,
    callback: grpc.requestCallback<_category_GetConditionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getConditions(
    argument: _category_GetConditionsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetConditionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getConditions(
    argument: _category_GetConditionsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetConditionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getConditions(
    argument: _category_GetConditionsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetConditionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getConditions(
    argument: _category_GetConditionsRequest,
    callback: grpc.requestCallback<_category_GetConditionsResponse__Output>
  ): grpc.ClientUnaryCall;

  GetMultipleAttribute(
    argument: _category_GetMultipleAttributeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetMultipleAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetMultipleAttribute(
    argument: _category_GetMultipleAttributeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetMultipleAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetMultipleAttribute(
    argument: _category_GetMultipleAttributeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetMultipleAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetMultipleAttribute(
    argument: _category_GetMultipleAttributeRequest,
    callback: grpc.requestCallback<_category_GetMultipleAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  getMultipleAttribute(
    argument: _category_GetMultipleAttributeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetMultipleAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  getMultipleAttribute(
    argument: _category_GetMultipleAttributeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetMultipleAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  getMultipleAttribute(
    argument: _category_GetMultipleAttributeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetMultipleAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  getMultipleAttribute(
    argument: _category_GetMultipleAttributeRequest,
    callback: grpc.requestCallback<_category_GetMultipleAttributeResponse__Output>
  ): grpc.ClientUnaryCall;

  GetProductCatCon(
    argument: _category_GetProductCatConRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetProductCatConResponse__Output>
  ): grpc.ClientUnaryCall;
  GetProductCatCon(
    argument: _category_GetProductCatConRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetProductCatConResponse__Output>
  ): grpc.ClientUnaryCall;
  GetProductCatCon(
    argument: _category_GetProductCatConRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetProductCatConResponse__Output>
  ): grpc.ClientUnaryCall;
  GetProductCatCon(
    argument: _category_GetProductCatConRequest,
    callback: grpc.requestCallback<_category_GetProductCatConResponse__Output>
  ): grpc.ClientUnaryCall;
  getProductCatCon(
    argument: _category_GetProductCatConRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetProductCatConResponse__Output>
  ): grpc.ClientUnaryCall;
  getProductCatCon(
    argument: _category_GetProductCatConRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_GetProductCatConResponse__Output>
  ): grpc.ClientUnaryCall;
  getProductCatCon(
    argument: _category_GetProductCatConRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_GetProductCatConResponse__Output>
  ): grpc.ClientUnaryCall;
  getProductCatCon(
    argument: _category_GetProductCatConRequest,
    callback: grpc.requestCallback<_category_GetProductCatConResponse__Output>
  ): grpc.ClientUnaryCall;

  UpdateAttribute(
    argument: _category_UpdateAttributeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_UpdateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateAttribute(
    argument: _category_UpdateAttributeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_UpdateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateAttribute(
    argument: _category_UpdateAttributeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_UpdateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateAttribute(
    argument: _category_UpdateAttributeRequest,
    callback: grpc.requestCallback<_category_UpdateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  updateAttribute(
    argument: _category_UpdateAttributeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_UpdateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  updateAttribute(
    argument: _category_UpdateAttributeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_category_UpdateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  updateAttribute(
    argument: _category_UpdateAttributeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_category_UpdateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
  updateAttribute(
    argument: _category_UpdateAttributeRequest,
    callback: grpc.requestCallback<_category_UpdateAttributeResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface CategoryServiceHandlers
  extends grpc.UntypedServiceImplementation {
  CreateAttribute: grpc.handleUnaryCall<
    _category_CreateAttributeRequest__Output,
    _category_CreateAttributeResponse
  >;

  CreateCategory: grpc.handleUnaryCall<
    _category_CreateCategoryRequest__Output,
    _category_CreateCategoryResponse
  >;

  DeleteAttribute: grpc.handleUnaryCall<
    _category_DeleteAttributeRequest__Output,
    _category_DeleteAttributeResponse
  >;

  GetAttribute: grpc.handleUnaryCall<
    _category_GetAttributeRequest__Output,
    _category_GetAttributeResponse
  >;

  GetAttributes: grpc.handleUnaryCall<
    _category_GetAttributesRequest__Output,
    _category_GetAttributesResponse
  >;

  GetCatConPriceRange: grpc.handleUnaryCall<
    _category_GetCatConPriceRangeRequest__Output,
    _category_GetCatConPriceRangeResponse
  >;

  GetCategories: grpc.handleUnaryCall<
    _category_GetCategoriesRequest__Output,
    _category_GetCategoriesResponse
  >;

  GetCategoriesByIds: grpc.handleUnaryCall<
    _category_GetCategoriesByIdsRequest__Output,
    _category_GetCategoriesByIdsResponse
  >;

  GetCategoryByName: grpc.handleUnaryCall<
    _category_GetCategoryByNameRequest__Output,
    _category_Category
  >;

  GetConditions: grpc.handleUnaryCall<
    _category_GetConditionsRequest__Output,
    _category_GetConditionsResponse
  >;

  GetMultipleAttribute: grpc.handleUnaryCall<
    _category_GetMultipleAttributeRequest__Output,
    _category_GetMultipleAttributeResponse
  >;

  GetProductCatCon: grpc.handleUnaryCall<
    _category_GetProductCatConRequest__Output,
    _category_GetProductCatConResponse
  >;

  UpdateAttribute: grpc.handleUnaryCall<
    _category_UpdateAttributeRequest__Output,
    _category_UpdateAttributeResponse
  >;
}

export interface CategoryServiceDefinition extends grpc.ServiceDefinition {
  CreateAttribute: MethodDefinition<
    _category_CreateAttributeRequest,
    _category_CreateAttributeResponse,
    _category_CreateAttributeRequest__Output,
    _category_CreateAttributeResponse__Output
  >;
  CreateCategory: MethodDefinition<
    _category_CreateCategoryRequest,
    _category_CreateCategoryResponse,
    _category_CreateCategoryRequest__Output,
    _category_CreateCategoryResponse__Output
  >;
  DeleteAttribute: MethodDefinition<
    _category_DeleteAttributeRequest,
    _category_DeleteAttributeResponse,
    _category_DeleteAttributeRequest__Output,
    _category_DeleteAttributeResponse__Output
  >;
  GetAttribute: MethodDefinition<
    _category_GetAttributeRequest,
    _category_GetAttributeResponse,
    _category_GetAttributeRequest__Output,
    _category_GetAttributeResponse__Output
  >;
  GetAttributes: MethodDefinition<
    _category_GetAttributesRequest,
    _category_GetAttributesResponse,
    _category_GetAttributesRequest__Output,
    _category_GetAttributesResponse__Output
  >;
  GetCatConPriceRange: MethodDefinition<
    _category_GetCatConPriceRangeRequest,
    _category_GetCatConPriceRangeResponse,
    _category_GetCatConPriceRangeRequest__Output,
    _category_GetCatConPriceRangeResponse__Output
  >;
  GetCategories: MethodDefinition<
    _category_GetCategoriesRequest,
    _category_GetCategoriesResponse,
    _category_GetCategoriesRequest__Output,
    _category_GetCategoriesResponse__Output
  >;
  GetCategoriesByIds: MethodDefinition<
    _category_GetCategoriesByIdsRequest,
    _category_GetCategoriesByIdsResponse,
    _category_GetCategoriesByIdsRequest__Output,
    _category_GetCategoriesByIdsResponse__Output
  >;
  GetCategoryByName: MethodDefinition<
    _category_GetCategoryByNameRequest,
    _category_Category,
    _category_GetCategoryByNameRequest__Output,
    _category_Category__Output
  >;
  GetConditions: MethodDefinition<
    _category_GetConditionsRequest,
    _category_GetConditionsResponse,
    _category_GetConditionsRequest__Output,
    _category_GetConditionsResponse__Output
  >;
  GetMultipleAttribute: MethodDefinition<
    _category_GetMultipleAttributeRequest,
    _category_GetMultipleAttributeResponse,
    _category_GetMultipleAttributeRequest__Output,
    _category_GetMultipleAttributeResponse__Output
  >;
  GetProductCatCon: MethodDefinition<
    _category_GetProductCatConRequest,
    _category_GetProductCatConResponse,
    _category_GetProductCatConRequest__Output,
    _category_GetProductCatConResponse__Output
  >;
  UpdateAttribute: MethodDefinition<
    _category_UpdateAttributeRequest,
    _category_UpdateAttributeResponse,
    _category_UpdateAttributeRequest__Output,
    _category_UpdateAttributeResponse__Output
  >;
}
