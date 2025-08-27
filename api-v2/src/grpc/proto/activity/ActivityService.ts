// Original file: node_modules/soum-proto/proto/activity.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  GetUserActivityRequest as _activity_GetUserActivityRequest,
  GetUserActivityRequest__Output as _activity_GetUserActivityRequest__Output,
} from '../activity/GetUserActivityRequest';
import type {
  GetUserActivityResponse as _activity_GetUserActivityResponse,
  GetUserActivityResponse__Output as _activity_GetUserActivityResponse__Output,
} from '../activity/GetUserActivityResponse';

export interface ActivityServiceClient extends grpc.Client {
  GetUserActivity(
    argument: _activity_GetUserActivityRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_activity_GetUserActivityResponse__Output>
  ): grpc.ClientUnaryCall;
  GetUserActivity(
    argument: _activity_GetUserActivityRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_activity_GetUserActivityResponse__Output>
  ): grpc.ClientUnaryCall;
  GetUserActivity(
    argument: _activity_GetUserActivityRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_activity_GetUserActivityResponse__Output>
  ): grpc.ClientUnaryCall;
  GetUserActivity(
    argument: _activity_GetUserActivityRequest,
    callback: grpc.requestCallback<_activity_GetUserActivityResponse__Output>
  ): grpc.ClientUnaryCall;
  getUserActivity(
    argument: _activity_GetUserActivityRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_activity_GetUserActivityResponse__Output>
  ): grpc.ClientUnaryCall;
  getUserActivity(
    argument: _activity_GetUserActivityRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_activity_GetUserActivityResponse__Output>
  ): grpc.ClientUnaryCall;
  getUserActivity(
    argument: _activity_GetUserActivityRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_activity_GetUserActivityResponse__Output>
  ): grpc.ClientUnaryCall;
  getUserActivity(
    argument: _activity_GetUserActivityRequest,
    callback: grpc.requestCallback<_activity_GetUserActivityResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface ActivityServiceHandlers
  extends grpc.UntypedServiceImplementation {
  GetUserActivity: grpc.handleUnaryCall<
    _activity_GetUserActivityRequest__Output,
    _activity_GetUserActivityResponse
  >;
}

export interface ActivityServiceDefinition extends grpc.ServiceDefinition {
  GetUserActivity: MethodDefinition<
    _activity_GetUserActivityRequest,
    _activity_GetUserActivityResponse,
    _activity_GetUserActivityRequest__Output,
    _activity_GetUserActivityResponse__Output
  >;
}
