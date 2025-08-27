// Original file: node_modules/soum-proto/proto/addon.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  GetAddonsRequest as _addon_GetAddonsRequest,
  GetAddonsRequest__Output as _addon_GetAddonsRequest__Output,
} from '../addon/GetAddonsRequest';
import type {
  GetAddonsResponse as _addon_GetAddonsResponse,
  GetAddonsResponse__Output as _addon_GetAddonsResponse__Output,
} from '../addon/GetAddonsResponse';

export interface AddonServiceClient extends grpc.Client {
  GetAddons(
    argument: _addon_GetAddonsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_addon_GetAddonsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetAddons(
    argument: _addon_GetAddonsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_addon_GetAddonsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetAddons(
    argument: _addon_GetAddonsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_addon_GetAddonsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetAddons(
    argument: _addon_GetAddonsRequest,
    callback: grpc.requestCallback<_addon_GetAddonsResponse__Output>
  ): grpc.ClientUnaryCall;
  getAddons(
    argument: _addon_GetAddonsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_addon_GetAddonsResponse__Output>
  ): grpc.ClientUnaryCall;
  getAddons(
    argument: _addon_GetAddonsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_addon_GetAddonsResponse__Output>
  ): grpc.ClientUnaryCall;
  getAddons(
    argument: _addon_GetAddonsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_addon_GetAddonsResponse__Output>
  ): grpc.ClientUnaryCall;
  getAddons(
    argument: _addon_GetAddonsRequest,
    callback: grpc.requestCallback<_addon_GetAddonsResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface AddonServiceHandlers
  extends grpc.UntypedServiceImplementation {
  GetAddons: grpc.handleUnaryCall<
    _addon_GetAddonsRequest__Output,
    _addon_GetAddonsResponse
  >;
}

export interface AddonServiceDefinition extends grpc.ServiceDefinition {
  GetAddons: MethodDefinition<
    _addon_GetAddonsRequest,
    _addon_GetAddonsResponse,
    _addon_GetAddonsRequest__Output,
    _addon_GetAddonsResponse__Output
  >;
}
