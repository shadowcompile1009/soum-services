// Original file: node_modules/soum-proto/proto/v2.proto


export interface _v2_CreateNewUserResponse_Listings {
  'activeListings'?: (number | string);
  'completedSales'?: (number | string);
  'purchasedProducts'?: (number | string);
  'soldListings'?: (number | string);
}

export interface _v2_CreateNewUserResponse_Listings__Output {
  'activeListings': (number);
  'completedSales': (number);
  'purchasedProducts': (number);
  'soldListings': (number);
}

export interface CreateNewUserResponse {
  'userId'?: (string);
  'userStatus'?: (string);
  'language'?: (string);
  'ratesScan'?: (boolean);
  'profilePic'?: (string);
  'listings'?: (_v2_CreateNewUserResponse_Listings | null);
}

export interface CreateNewUserResponse__Output {
  'userId': (string);
  'userStatus': (string);
  'language': (string);
  'ratesScan': (boolean);
  'profilePic': (string);
  'listings': (_v2_CreateNewUserResponse_Listings__Output | null);
}
