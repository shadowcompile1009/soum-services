// Original file: node_modules/soum-proto/proto/authz.proto

import type {
  GetRoleResponse as _authz_GetRoleResponse,
  GetRoleResponse__Output as _authz_GetRoleResponse__Output,
} from '../authz/GetRoleResponse';

export interface GetUserRolesResponse {
  roles?: _authz_GetRoleResponse[];
}

export interface GetUserRolesResponse__Output {
  roles: _authz_GetRoleResponse__Output[];
}
