// Original file: node_modules/soum-proto/proto/wallet.proto

import type {
  Permission as _wallet_Permission,
  Permission__Output as _wallet_Permission__Output,
} from '../wallet/Permission';

export interface GetPermissionsResponse {
  permissions?: _wallet_Permission[];
}

export interface GetPermissionsResponse__Output {
  permissions: _wallet_Permission__Output[];
}
