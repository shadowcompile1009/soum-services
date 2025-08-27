// Original file: node_modules/soum-proto/proto/search.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  SaveOrderRequest as _search_SaveOrderRequest,
  SaveOrderRequest__Output as _search_SaveOrderRequest__Output,
} from '../search/SaveOrderRequest';
import type {
  SaveOrderResponse as _search_SaveOrderResponse,
  SaveOrderResponse__Output as _search_SaveOrderResponse__Output,
} from '../search/SaveOrderResponse';
import type {
  SearchRequest as _search_SearchRequest,
  SearchRequest__Output as _search_SearchRequest__Output,
} from '../search/SearchRequest';
import type {
  SearchResultsResponse as _search_SearchResultsResponse,
  SearchResultsResponse__Output as _search_SearchResultsResponse__Output,
} from '../search/SearchResultsResponse';

export interface SearchServiceClient extends grpc.Client {
  GetProducts(
    argument: _search_SearchRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_search_SearchResultsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetProducts(
    argument: _search_SearchRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_search_SearchResultsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetProducts(
    argument: _search_SearchRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_search_SearchResultsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetProducts(
    argument: _search_SearchRequest,
    callback: grpc.requestCallback<_search_SearchResultsResponse__Output>
  ): grpc.ClientUnaryCall;
  getProducts(
    argument: _search_SearchRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_search_SearchResultsResponse__Output>
  ): grpc.ClientUnaryCall;
  getProducts(
    argument: _search_SearchRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_search_SearchResultsResponse__Output>
  ): grpc.ClientUnaryCall;
  getProducts(
    argument: _search_SearchRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_search_SearchResultsResponse__Output>
  ): grpc.ClientUnaryCall;
  getProducts(
    argument: _search_SearchRequest,
    callback: grpc.requestCallback<_search_SearchResultsResponse__Output>
  ): grpc.ClientUnaryCall;

  SaveOrders(
    argument: _search_SaveOrderRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_search_SaveOrderResponse__Output>
  ): grpc.ClientUnaryCall;
  SaveOrders(
    argument: _search_SaveOrderRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_search_SaveOrderResponse__Output>
  ): grpc.ClientUnaryCall;
  SaveOrders(
    argument: _search_SaveOrderRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_search_SaveOrderResponse__Output>
  ): grpc.ClientUnaryCall;
  SaveOrders(
    argument: _search_SaveOrderRequest,
    callback: grpc.requestCallback<_search_SaveOrderResponse__Output>
  ): grpc.ClientUnaryCall;
  saveOrders(
    argument: _search_SaveOrderRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_search_SaveOrderResponse__Output>
  ): grpc.ClientUnaryCall;
  saveOrders(
    argument: _search_SaveOrderRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_search_SaveOrderResponse__Output>
  ): grpc.ClientUnaryCall;
  saveOrders(
    argument: _search_SaveOrderRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_search_SaveOrderResponse__Output>
  ): grpc.ClientUnaryCall;
  saveOrders(
    argument: _search_SaveOrderRequest,
    callback: grpc.requestCallback<_search_SaveOrderResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface SearchServiceHandlers
  extends grpc.UntypedServiceImplementation {
  GetProducts: grpc.handleUnaryCall<
    _search_SearchRequest__Output,
    _search_SearchResultsResponse
  >;

  SaveOrders: grpc.handleUnaryCall<
    _search_SaveOrderRequest__Output,
    _search_SaveOrderResponse
  >;
}

export interface SearchServiceDefinition extends grpc.ServiceDefinition {
  GetProducts: MethodDefinition<
    _search_SearchRequest,
    _search_SearchResultsResponse,
    _search_SearchRequest__Output,
    _search_SearchResultsResponse__Output
  >;
  SaveOrders: MethodDefinition<
    _search_SaveOrderRequest,
    _search_SaveOrderResponse,
    _search_SaveOrderRequest__Output,
    _search_SaveOrderResponse__Output
  >;
}
