// Original file: node_modules/soum-proto/proto/recommendation.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  AddFeedbackRequest as _recommendation_AddFeedbackRequest,
  AddFeedbackRequest__Output as _recommendation_AddFeedbackRequest__Output,
} from '../recommendation/AddFeedbackRequest';
import type {
  AddFeedbackResponse as _recommendation_AddFeedbackResponse,
  AddFeedbackResponse__Output as _recommendation_AddFeedbackResponse__Output,
} from '../recommendation/AddFeedbackResponse';
import type {
  AddMultipleItemsRequest as _recommendation_AddMultipleItemsRequest,
  AddMultipleItemsRequest__Output as _recommendation_AddMultipleItemsRequest__Output,
} from '../recommendation/AddMultipleItemsRequest';
import type {
  AddMultipleItemsResponse as _recommendation_AddMultipleItemsResponse,
  AddMultipleItemsResponse__Output as _recommendation_AddMultipleItemsResponse__Output,
} from '../recommendation/AddMultipleItemsResponse';
import type {
  AddNewItemRequest as _recommendation_AddNewItemRequest,
  AddNewItemRequest__Output as _recommendation_AddNewItemRequest__Output,
} from '../recommendation/AddNewItemRequest';
import type {
  AddNewItemResponse as _recommendation_AddNewItemResponse,
  AddNewItemResponse__Output as _recommendation_AddNewItemResponse__Output,
} from '../recommendation/AddNewItemResponse';
import type {
  AddNewUserRequest as _recommendation_AddNewUserRequest,
  AddNewUserRequest__Output as _recommendation_AddNewUserRequest__Output,
} from '../recommendation/AddNewUserRequest';
import type {
  AddNewUserResponse as _recommendation_AddNewUserResponse,
  AddNewUserResponse__Output as _recommendation_AddNewUserResponse__Output,
} from '../recommendation/AddNewUserResponse';
import type {
  DeleteItemsRequest as _recommendation_DeleteItemsRequest,
  DeleteItemsRequest__Output as _recommendation_DeleteItemsRequest__Output,
} from '../recommendation/DeleteItemsRequest';
import type {
  DeleteItemsResponse as _recommendation_DeleteItemsResponse,
  DeleteItemsResponse__Output as _recommendation_DeleteItemsResponse__Output,
} from '../recommendation/DeleteItemsResponse';
import type {
  RemoveFeedbackRequest as _recommendation_RemoveFeedbackRequest,
  RemoveFeedbackRequest__Output as _recommendation_RemoveFeedbackRequest__Output,
} from '../recommendation/RemoveFeedbackRequest';
import type {
  RemoveFeedbackResponse as _recommendation_RemoveFeedbackResponse,
  RemoveFeedbackResponse__Output as _recommendation_RemoveFeedbackResponse__Output,
} from '../recommendation/RemoveFeedbackResponse';

export interface RecommendationServiceClient extends grpc.Client {
  AddFeedback(
    argument: _recommendation_AddFeedbackRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  AddFeedback(
    argument: _recommendation_AddFeedbackRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_recommendation_AddFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  AddFeedback(
    argument: _recommendation_AddFeedbackRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  AddFeedback(
    argument: _recommendation_AddFeedbackRequest,
    callback: grpc.requestCallback<_recommendation_AddFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  addFeedback(
    argument: _recommendation_AddFeedbackRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  addFeedback(
    argument: _recommendation_AddFeedbackRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_recommendation_AddFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  addFeedback(
    argument: _recommendation_AddFeedbackRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  addFeedback(
    argument: _recommendation_AddFeedbackRequest,
    callback: grpc.requestCallback<_recommendation_AddFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;

  AddMultipleItems(
    argument: _recommendation_AddMultipleItemsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddMultipleItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  AddMultipleItems(
    argument: _recommendation_AddMultipleItemsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_recommendation_AddMultipleItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  AddMultipleItems(
    argument: _recommendation_AddMultipleItemsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddMultipleItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  AddMultipleItems(
    argument: _recommendation_AddMultipleItemsRequest,
    callback: grpc.requestCallback<_recommendation_AddMultipleItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  addMultipleItems(
    argument: _recommendation_AddMultipleItemsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddMultipleItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  addMultipleItems(
    argument: _recommendation_AddMultipleItemsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_recommendation_AddMultipleItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  addMultipleItems(
    argument: _recommendation_AddMultipleItemsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddMultipleItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  addMultipleItems(
    argument: _recommendation_AddMultipleItemsRequest,
    callback: grpc.requestCallback<_recommendation_AddMultipleItemsResponse__Output>
  ): grpc.ClientUnaryCall;

  AddNewItem(
    argument: _recommendation_AddNewItemRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddNewItemResponse__Output>
  ): grpc.ClientUnaryCall;
  AddNewItem(
    argument: _recommendation_AddNewItemRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_recommendation_AddNewItemResponse__Output>
  ): grpc.ClientUnaryCall;
  AddNewItem(
    argument: _recommendation_AddNewItemRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddNewItemResponse__Output>
  ): grpc.ClientUnaryCall;
  AddNewItem(
    argument: _recommendation_AddNewItemRequest,
    callback: grpc.requestCallback<_recommendation_AddNewItemResponse__Output>
  ): grpc.ClientUnaryCall;
  addNewItem(
    argument: _recommendation_AddNewItemRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddNewItemResponse__Output>
  ): grpc.ClientUnaryCall;
  addNewItem(
    argument: _recommendation_AddNewItemRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_recommendation_AddNewItemResponse__Output>
  ): grpc.ClientUnaryCall;
  addNewItem(
    argument: _recommendation_AddNewItemRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddNewItemResponse__Output>
  ): grpc.ClientUnaryCall;
  addNewItem(
    argument: _recommendation_AddNewItemRequest,
    callback: grpc.requestCallback<_recommendation_AddNewItemResponse__Output>
  ): grpc.ClientUnaryCall;

  AddNewUser(
    argument: _recommendation_AddNewUserRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddNewUserResponse__Output>
  ): grpc.ClientUnaryCall;
  AddNewUser(
    argument: _recommendation_AddNewUserRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_recommendation_AddNewUserResponse__Output>
  ): grpc.ClientUnaryCall;
  AddNewUser(
    argument: _recommendation_AddNewUserRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddNewUserResponse__Output>
  ): grpc.ClientUnaryCall;
  AddNewUser(
    argument: _recommendation_AddNewUserRequest,
    callback: grpc.requestCallback<_recommendation_AddNewUserResponse__Output>
  ): grpc.ClientUnaryCall;
  addNewUser(
    argument: _recommendation_AddNewUserRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddNewUserResponse__Output>
  ): grpc.ClientUnaryCall;
  addNewUser(
    argument: _recommendation_AddNewUserRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_recommendation_AddNewUserResponse__Output>
  ): grpc.ClientUnaryCall;
  addNewUser(
    argument: _recommendation_AddNewUserRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_AddNewUserResponse__Output>
  ): grpc.ClientUnaryCall;
  addNewUser(
    argument: _recommendation_AddNewUserRequest,
    callback: grpc.requestCallback<_recommendation_AddNewUserResponse__Output>
  ): grpc.ClientUnaryCall;

  DeleteItems(
    argument: _recommendation_DeleteItemsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_DeleteItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  DeleteItems(
    argument: _recommendation_DeleteItemsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_recommendation_DeleteItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  DeleteItems(
    argument: _recommendation_DeleteItemsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_DeleteItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  DeleteItems(
    argument: _recommendation_DeleteItemsRequest,
    callback: grpc.requestCallback<_recommendation_DeleteItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  deleteItems(
    argument: _recommendation_DeleteItemsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_DeleteItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  deleteItems(
    argument: _recommendation_DeleteItemsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_recommendation_DeleteItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  deleteItems(
    argument: _recommendation_DeleteItemsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_DeleteItemsResponse__Output>
  ): grpc.ClientUnaryCall;
  deleteItems(
    argument: _recommendation_DeleteItemsRequest,
    callback: grpc.requestCallback<_recommendation_DeleteItemsResponse__Output>
  ): grpc.ClientUnaryCall;

  RemoveFeedback(
    argument: _recommendation_RemoveFeedbackRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_RemoveFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  RemoveFeedback(
    argument: _recommendation_RemoveFeedbackRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_recommendation_RemoveFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  RemoveFeedback(
    argument: _recommendation_RemoveFeedbackRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_RemoveFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  RemoveFeedback(
    argument: _recommendation_RemoveFeedbackRequest,
    callback: grpc.requestCallback<_recommendation_RemoveFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  removeFeedback(
    argument: _recommendation_RemoveFeedbackRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_RemoveFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  removeFeedback(
    argument: _recommendation_RemoveFeedbackRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_recommendation_RemoveFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  removeFeedback(
    argument: _recommendation_RemoveFeedbackRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_recommendation_RemoveFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
  removeFeedback(
    argument: _recommendation_RemoveFeedbackRequest,
    callback: grpc.requestCallback<_recommendation_RemoveFeedbackResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface RecommendationServiceHandlers
  extends grpc.UntypedServiceImplementation {
  AddFeedback: grpc.handleUnaryCall<
    _recommendation_AddFeedbackRequest__Output,
    _recommendation_AddFeedbackResponse
  >;

  AddMultipleItems: grpc.handleUnaryCall<
    _recommendation_AddMultipleItemsRequest__Output,
    _recommendation_AddMultipleItemsResponse
  >;

  AddNewItem: grpc.handleUnaryCall<
    _recommendation_AddNewItemRequest__Output,
    _recommendation_AddNewItemResponse
  >;

  AddNewUser: grpc.handleUnaryCall<
    _recommendation_AddNewUserRequest__Output,
    _recommendation_AddNewUserResponse
  >;

  DeleteItems: grpc.handleUnaryCall<
    _recommendation_DeleteItemsRequest__Output,
    _recommendation_DeleteItemsResponse
  >;

  RemoveFeedback: grpc.handleUnaryCall<
    _recommendation_RemoveFeedbackRequest__Output,
    _recommendation_RemoveFeedbackResponse
  >;
}

export interface RecommendationServiceDefinition
  extends grpc.ServiceDefinition {
  AddFeedback: MethodDefinition<
    _recommendation_AddFeedbackRequest,
    _recommendation_AddFeedbackResponse,
    _recommendation_AddFeedbackRequest__Output,
    _recommendation_AddFeedbackResponse__Output
  >;
  AddMultipleItems: MethodDefinition<
    _recommendation_AddMultipleItemsRequest,
    _recommendation_AddMultipleItemsResponse,
    _recommendation_AddMultipleItemsRequest__Output,
    _recommendation_AddMultipleItemsResponse__Output
  >;
  AddNewItem: MethodDefinition<
    _recommendation_AddNewItemRequest,
    _recommendation_AddNewItemResponse,
    _recommendation_AddNewItemRequest__Output,
    _recommendation_AddNewItemResponse__Output
  >;
  AddNewUser: MethodDefinition<
    _recommendation_AddNewUserRequest,
    _recommendation_AddNewUserResponse,
    _recommendation_AddNewUserRequest__Output,
    _recommendation_AddNewUserResponse__Output
  >;
  DeleteItems: MethodDefinition<
    _recommendation_DeleteItemsRequest,
    _recommendation_DeleteItemsResponse,
    _recommendation_DeleteItemsRequest__Output,
    _recommendation_DeleteItemsResponse__Output
  >;
  RemoveFeedback: MethodDefinition<
    _recommendation_RemoveFeedbackRequest,
    _recommendation_RemoveFeedbackResponse,
    _recommendation_RemoveFeedbackRequest__Output,
    _recommendation_RemoveFeedbackResponse__Output
  >;
}
