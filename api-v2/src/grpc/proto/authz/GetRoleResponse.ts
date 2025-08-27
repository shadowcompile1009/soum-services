// Original file: node_modules/soum-proto/proto/authz.proto

import type {
  Group as _authz_Group,
  Group__Output as _authz_Group__Output,
} from '../authz/Group';
import type {
  Permission as _authz_Permission,
  Permission__Output as _authz_Permission__Output,
} from '../authz/Permission';

export interface GetRoleResponse {
  id?: string;
  name?: string;
  displayName?: string;
  canAccessAll?: boolean;
  group?: _authz_Group | null;
  permissions?: _authz_Permission[];
}

export interface GetRoleResponse__Output {
  id: string;
  name: string;
  displayName: string;
  canAccessAll: boolean;
  group: _authz_Group__Output | null;
  permissions: _authz_Permission__Output[];
}
