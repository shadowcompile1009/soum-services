// Original file: node_modules/soum-proto/proto/v2.proto

import type { Bank as _v2_Bank, Bank__Output as _v2_Bank__Output } from '../v2/Bank';
import type { Address as _v2_Address, Address__Output as _v2_Address__Output } from '../v2/Address';

export interface GetUserResponse {
  'id'?: (string);
  'name'?: (string);
  'phoneNumber'?: (string);
  'bankDetail'?: (_v2_Bank | null);
  'address'?: (_v2_Address | null);
  'email'?: (string);
  'isKeySeller'?: (boolean);
  'isMerchant'?: (boolean);
  'activeListings'?: (number | string);
  'soldListings'?: (number | string);
  'avatar'?: (string);
  'activatedDate'?: (string);
  'bio'?: (string);
  'isCompliant'?: (boolean);
}

export interface GetUserResponse__Output {
  'id': (string);
  'name': (string);
  'phoneNumber': (string);
  'bankDetail': (_v2_Bank__Output | null);
  'address': (_v2_Address__Output | null);
  'email': (string);
  'isKeySeller': (boolean);
  'isMerchant': (boolean);
  'activeListings': (number);
  'soldListings': (number);
  'avatar': (string);
  'activatedDate': (string);
  'bio': (string);
  'isCompliant': (boolean);
}
