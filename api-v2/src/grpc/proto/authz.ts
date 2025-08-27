import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  RoleServiceClient as _authz_RoleServiceClient,
  RoleServiceDefinition as _authz_RoleServiceDefinition,
} from './authz/RoleService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  authz: {
    GetGroupRolesRequest: MessageTypeDefinition;
    GetGroupRolesResponse: MessageTypeDefinition;
    GetRoleRequest: MessageTypeDefinition;
    GetRoleResponse: MessageTypeDefinition;
    GetUserDataRequest: MessageTypeDefinition;
    GetUserDataResponse: MessageTypeDefinition;
    GetUserRolesRequest: MessageTypeDefinition;
    GetUserRolesResponse: MessageTypeDefinition;
    Group: MessageTypeDefinition;
    Permission: MessageTypeDefinition;
    RoleService: SubtypeConstructor<
      typeof grpc.Client,
      _authz_RoleServiceClient
    > & { service: _authz_RoleServiceDefinition };
  };
}
