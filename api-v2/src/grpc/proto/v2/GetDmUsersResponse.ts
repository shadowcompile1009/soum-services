// Original file: node_modules/soum-proto/proto/v2.proto


export interface _v2_GetDmUsersResponse_DmUser {
  'id'?: (string);
  'username'?: (string);
  'phoneNumber'?: (string);
}

export interface _v2_GetDmUsersResponse_DmUser__Output {
  'id': (string);
  'username': (string);
  'phoneNumber': (string);
}

export interface GetDmUsersResponse {
  'users'?: (_v2_GetDmUsersResponse_DmUser)[];
}

export interface GetDmUsersResponse__Output {
  'users': (_v2_GetDmUsersResponse_DmUser__Output)[];
}
