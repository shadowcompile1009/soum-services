// Original file: node_modules/soum-proto/proto/authz.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  GetGroupRolesRequest as _authz_GetGroupRolesRequest,
  GetGroupRolesRequest__Output as _authz_GetGroupRolesRequest__Output,
} from '../authz/GetGroupRolesRequest';
import type {
  GetGroupRolesResponse as _authz_GetGroupRolesResponse,
  GetGroupRolesResponse__Output as _authz_GetGroupRolesResponse__Output,
} from '../authz/GetGroupRolesResponse';
import type {
  GetRoleRequest as _authz_GetRoleRequest,
  GetRoleRequest__Output as _authz_GetRoleRequest__Output,
} from '../authz/GetRoleRequest';
import type {
  GetRoleResponse as _authz_GetRoleResponse,
  GetRoleResponse__Output as _authz_GetRoleResponse__Output,
} from '../authz/GetRoleResponse';
import type {
  GetUserDataRequest as _authz_GetUserDataRequest,
  GetUserDataRequest__Output as _authz_GetUserDataRequest__Output,
} from '../authz/GetUserDataRequest';
import type {
  GetUserDataResponse as _authz_GetUserDataResponse,
  GetUserDataResponse__Output as _authz_GetUserDataResponse__Output,
} from '../authz/GetUserDataResponse';
import type {
  GetUserRolesRequest as _authz_GetUserRolesRequest,
  GetUserRolesRequest__Output as _authz_GetUserRolesRequest__Output,
} from '../authz/GetUserRolesRequest';
import type {
  GetUserRolesResponse as _authz_GetUserRolesResponse,
  GetUserRolesResponse__Output as _authz_GetUserRolesResponse__Output,
} from '../authz/GetUserRolesResponse';

export interface RoleServiceClient extends grpc.Client {
  GetGroupRoles(
    argument: _authz_GetGroupRolesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetGroupRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetGroupRoles(
    argument: _authz_GetGroupRolesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_authz_GetGroupRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetGroupRoles(
    argument: _authz_GetGroupRolesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetGroupRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetGroupRoles(
    argument: _authz_GetGroupRolesRequest,
    callback: grpc.requestCallback<_authz_GetGroupRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  getGroupRoles(
    argument: _authz_GetGroupRolesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetGroupRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  getGroupRoles(
    argument: _authz_GetGroupRolesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_authz_GetGroupRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  getGroupRoles(
    argument: _authz_GetGroupRolesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetGroupRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  getGroupRoles(
    argument: _authz_GetGroupRolesRequest,
    callback: grpc.requestCallback<_authz_GetGroupRolesResponse__Output>
  ): grpc.ClientUnaryCall;

  GetRole(
    argument: _authz_GetRoleRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetRoleResponse__Output>
  ): grpc.ClientUnaryCall;
  GetRole(
    argument: _authz_GetRoleRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_authz_GetRoleResponse__Output>
  ): grpc.ClientUnaryCall;
  GetRole(
    argument: _authz_GetRoleRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetRoleResponse__Output>
  ): grpc.ClientUnaryCall;
  GetRole(
    argument: _authz_GetRoleRequest,
    callback: grpc.requestCallback<_authz_GetRoleResponse__Output>
  ): grpc.ClientUnaryCall;
  getRole(
    argument: _authz_GetRoleRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetRoleResponse__Output>
  ): grpc.ClientUnaryCall;
  getRole(
    argument: _authz_GetRoleRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_authz_GetRoleResponse__Output>
  ): grpc.ClientUnaryCall;
  getRole(
    argument: _authz_GetRoleRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetRoleResponse__Output>
  ): grpc.ClientUnaryCall;
  getRole(
    argument: _authz_GetRoleRequest,
    callback: grpc.requestCallback<_authz_GetRoleResponse__Output>
  ): grpc.ClientUnaryCall;

  GetUserData(
    argument: _authz_GetUserDataRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetUserDataResponse__Output>
  ): grpc.ClientUnaryCall;
  GetUserData(
    argument: _authz_GetUserDataRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_authz_GetUserDataResponse__Output>
  ): grpc.ClientUnaryCall;
  GetUserData(
    argument: _authz_GetUserDataRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetUserDataResponse__Output>
  ): grpc.ClientUnaryCall;
  GetUserData(
    argument: _authz_GetUserDataRequest,
    callback: grpc.requestCallback<_authz_GetUserDataResponse__Output>
  ): grpc.ClientUnaryCall;
  getUserData(
    argument: _authz_GetUserDataRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetUserDataResponse__Output>
  ): grpc.ClientUnaryCall;
  getUserData(
    argument: _authz_GetUserDataRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_authz_GetUserDataResponse__Output>
  ): grpc.ClientUnaryCall;
  getUserData(
    argument: _authz_GetUserDataRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetUserDataResponse__Output>
  ): grpc.ClientUnaryCall;
  getUserData(
    argument: _authz_GetUserDataRequest,
    callback: grpc.requestCallback<_authz_GetUserDataResponse__Output>
  ): grpc.ClientUnaryCall;

  GetUserRoles(
    argument: _authz_GetUserRolesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetUserRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetUserRoles(
    argument: _authz_GetUserRolesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_authz_GetUserRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetUserRoles(
    argument: _authz_GetUserRolesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetUserRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetUserRoles(
    argument: _authz_GetUserRolesRequest,
    callback: grpc.requestCallback<_authz_GetUserRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  getUserRoles(
    argument: _authz_GetUserRolesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetUserRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  getUserRoles(
    argument: _authz_GetUserRolesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_authz_GetUserRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  getUserRoles(
    argument: _authz_GetUserRolesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_authz_GetUserRolesResponse__Output>
  ): grpc.ClientUnaryCall;
  getUserRoles(
    argument: _authz_GetUserRolesRequest,
    callback: grpc.requestCallback<_authz_GetUserRolesResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface RoleServiceHandlers extends grpc.UntypedServiceImplementation {
  GetGroupRoles: grpc.handleUnaryCall<
    _authz_GetGroupRolesRequest__Output,
    _authz_GetGroupRolesResponse
  >;

  GetRole: grpc.handleUnaryCall<
    _authz_GetRoleRequest__Output,
    _authz_GetRoleResponse
  >;

  GetUserData: grpc.handleUnaryCall<
    _authz_GetUserDataRequest__Output,
    _authz_GetUserDataResponse
  >;

  GetUserRoles: grpc.handleUnaryCall<
    _authz_GetUserRolesRequest__Output,
    _authz_GetUserRolesResponse
  >;
}

export interface RoleServiceDefinition extends grpc.ServiceDefinition {
  GetGroupRoles: MethodDefinition<
    _authz_GetGroupRolesRequest,
    _authz_GetGroupRolesResponse,
    _authz_GetGroupRolesRequest__Output,
    _authz_GetGroupRolesResponse__Output
  >;
  GetRole: MethodDefinition<
    _authz_GetRoleRequest,
    _authz_GetRoleResponse,
    _authz_GetRoleRequest__Output,
    _authz_GetRoleResponse__Output
  >;
  GetUserData: MethodDefinition<
    _authz_GetUserDataRequest,
    _authz_GetUserDataResponse,
    _authz_GetUserDataRequest__Output,
    _authz_GetUserDataResponse__Output
  >;
  GetUserRoles: MethodDefinition<
    _authz_GetUserRolesRequest,
    _authz_GetUserRolesResponse,
    _authz_GetUserRolesRequest__Output,
    _authz_GetUserRolesResponse__Output
  >;
}
