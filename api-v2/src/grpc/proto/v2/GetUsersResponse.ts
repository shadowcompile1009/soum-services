// Original file: node_modules/soum-proto/proto/v2.proto

import type { Bank as _v2_Bank, Bank__Output as _v2_Bank__Output } from '../v2/Bank';

export interface _v2_GetUsersResponse_User {
  'id'?: (string);
  'name'?: (string);
  'phoneNumber'?: (string);
  'bankDetail'?: (_v2_Bank | null);
  'isKeySeller'?: (boolean);
  'isMerchant'?: (boolean);
}

export interface _v2_GetUsersResponse_User__Output {
  'id': (string);
  'name': (string);
  'phoneNumber': (string);
  'bankDetail': (_v2_Bank__Output | null);
  'isKeySeller': (boolean);
  'isMerchant': (boolean);
}

export interface GetUsersResponse {
  'users'?: (_v2_GetUsersResponse_User)[];
}

export interface GetUsersResponse__Output {
  'users': (_v2_GetUsersResponse_User__Output)[];
}
