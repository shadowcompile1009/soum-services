// Original file: node_modules/soum-proto/proto/review.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  DummyRequest as _review_DummyRequest,
  DummyRequest__Output as _review_DummyRequest__Output,
} from '../review/DummyRequest';
import type {
  DummyResponse as _review_DummyResponse,
  DummyResponse__Output as _review_DummyResponse__Output,
} from '../review/DummyResponse';
import type {
  GetRatingSellerRequest as _review_GetRatingSellerRequest,
  GetRatingSellerRequest__Output as _review_GetRatingSellerRequest__Output,
} from '../review/GetRatingSellerRequest';
import type {
  GetRatingSellerResponse as _review_GetRatingSellerResponse,
  GetRatingSellerResponse__Output as _review_GetRatingSellerResponse__Output,
} from '../review/GetRatingSellerResponse';
import type {
  GetResponseOfProductRequest as _review_GetResponseOfProductRequest,
  GetResponseOfProductRequest__Output as _review_GetResponseOfProductRequest__Output,
} from '../review/GetResponseOfProductRequest';
import type {
  GetResponseOfProductResponse as _review_GetResponseOfProductResponse,
  GetResponseOfProductResponse__Output as _review_GetResponseOfProductResponse__Output,
} from '../review/GetResponseOfProductResponse';

export interface ReviewServiceClient extends grpc.Client {
  Dummy(
    argument: _review_DummyRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_review_DummyResponse__Output>
  ): grpc.ClientUnaryCall;
  Dummy(
    argument: _review_DummyRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_review_DummyResponse__Output>
  ): grpc.ClientUnaryCall;
  Dummy(
    argument: _review_DummyRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_review_DummyResponse__Output>
  ): grpc.ClientUnaryCall;
  Dummy(
    argument: _review_DummyRequest,
    callback: grpc.requestCallback<_review_DummyResponse__Output>
  ): grpc.ClientUnaryCall;
  dummy(
    argument: _review_DummyRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_review_DummyResponse__Output>
  ): grpc.ClientUnaryCall;
  dummy(
    argument: _review_DummyRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_review_DummyResponse__Output>
  ): grpc.ClientUnaryCall;
  dummy(
    argument: _review_DummyRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_review_DummyResponse__Output>
  ): grpc.ClientUnaryCall;
  dummy(
    argument: _review_DummyRequest,
    callback: grpc.requestCallback<_review_DummyResponse__Output>
  ): grpc.ClientUnaryCall;

  GetRatingSeller(
    argument: _review_GetRatingSellerRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_review_GetRatingSellerResponse__Output>
  ): grpc.ClientUnaryCall;
  GetRatingSeller(
    argument: _review_GetRatingSellerRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_review_GetRatingSellerResponse__Output>
  ): grpc.ClientUnaryCall;
  GetRatingSeller(
    argument: _review_GetRatingSellerRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_review_GetRatingSellerResponse__Output>
  ): grpc.ClientUnaryCall;
  GetRatingSeller(
    argument: _review_GetRatingSellerRequest,
    callback: grpc.requestCallback<_review_GetRatingSellerResponse__Output>
  ): grpc.ClientUnaryCall;
  getRatingSeller(
    argument: _review_GetRatingSellerRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_review_GetRatingSellerResponse__Output>
  ): grpc.ClientUnaryCall;
  getRatingSeller(
    argument: _review_GetRatingSellerRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_review_GetRatingSellerResponse__Output>
  ): grpc.ClientUnaryCall;
  getRatingSeller(
    argument: _review_GetRatingSellerRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_review_GetRatingSellerResponse__Output>
  ): grpc.ClientUnaryCall;
  getRatingSeller(
    argument: _review_GetRatingSellerRequest,
    callback: grpc.requestCallback<_review_GetRatingSellerResponse__Output>
  ): grpc.ClientUnaryCall;

  GetResponsesOfProduct(
    argument: _review_GetResponseOfProductRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_review_GetResponseOfProductResponse__Output>
  ): grpc.ClientUnaryCall;
  GetResponsesOfProduct(
    argument: _review_GetResponseOfProductRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_review_GetResponseOfProductResponse__Output>
  ): grpc.ClientUnaryCall;
  GetResponsesOfProduct(
    argument: _review_GetResponseOfProductRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_review_GetResponseOfProductResponse__Output>
  ): grpc.ClientUnaryCall;
  GetResponsesOfProduct(
    argument: _review_GetResponseOfProductRequest,
    callback: grpc.requestCallback<_review_GetResponseOfProductResponse__Output>
  ): grpc.ClientUnaryCall;
  getResponsesOfProduct(
    argument: _review_GetResponseOfProductRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_review_GetResponseOfProductResponse__Output>
  ): grpc.ClientUnaryCall;
  getResponsesOfProduct(
    argument: _review_GetResponseOfProductRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_review_GetResponseOfProductResponse__Output>
  ): grpc.ClientUnaryCall;
  getResponsesOfProduct(
    argument: _review_GetResponseOfProductRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_review_GetResponseOfProductResponse__Output>
  ): grpc.ClientUnaryCall;
  getResponsesOfProduct(
    argument: _review_GetResponseOfProductRequest,
    callback: grpc.requestCallback<_review_GetResponseOfProductResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface ReviewServiceHandlers
  extends grpc.UntypedServiceImplementation {
  Dummy: grpc.handleUnaryCall<
    _review_DummyRequest__Output,
    _review_DummyResponse
  >;

  GetRatingSeller: grpc.handleUnaryCall<
    _review_GetRatingSellerRequest__Output,
    _review_GetRatingSellerResponse
  >;

  GetResponsesOfProduct: grpc.handleUnaryCall<
    _review_GetResponseOfProductRequest__Output,
    _review_GetResponseOfProductResponse
  >;
}

export interface ReviewServiceDefinition extends grpc.ServiceDefinition {
  Dummy: MethodDefinition<
    _review_DummyRequest,
    _review_DummyResponse,
    _review_DummyRequest__Output,
    _review_DummyResponse__Output
  >;
  GetRatingSeller: MethodDefinition<
    _review_GetRatingSellerRequest,
    _review_GetRatingSellerResponse,
    _review_GetRatingSellerRequest__Output,
    _review_GetRatingSellerResponse__Output
  >;
  GetResponsesOfProduct: MethodDefinition<
    _review_GetResponseOfProductRequest,
    _review_GetResponseOfProductResponse,
    _review_GetResponseOfProductRequest__Output,
    _review_GetResponseOfProductResponse__Output
  >;
}
