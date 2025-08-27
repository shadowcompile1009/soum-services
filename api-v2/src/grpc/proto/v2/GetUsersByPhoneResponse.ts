// Original file: node_modules/soum-proto/proto/v2.proto

import type { Bank as _v2_Bank, Bank__Output as _v2_Bank__Output } from '../v2/Bank';

export interface _v2_GetUsersByPhoneResponse_User {
  'id'?: (string);
  'name'?: (string);
  'phoneNumber'?: (string);
  'bankDetail'?: (_v2_Bank | null);
}

export interface _v2_GetUsersByPhoneResponse_User__Output {
  'id': (string);
  'name': (string);
  'phoneNumber': (string);
  'bankDetail': (_v2_Bank__Output | null);
}

export interface GetUsersByPhoneResponse {
  'users'?: (_v2_GetUsersByPhoneResponse_User)[];
}

export interface GetUsersByPhoneResponse__Output {
  'users': (_v2_GetUsersByPhoneResponse_User__Output)[];
}
