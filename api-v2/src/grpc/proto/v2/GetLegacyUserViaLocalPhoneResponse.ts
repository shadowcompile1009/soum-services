// Original file: node_modules/soum-proto/proto/v2.proto


export interface _v2_GetLegacyUserViaLocalPhoneResponse_Listings {
  'activeListings'?: (number | string);
  'completedSales'?: (number | string);
  'purchasedProducts'?: (number | string);
  'soldListings'?: (number | string);
}

export interface _v2_GetLegacyUserViaLocalPhoneResponse_Listings__Output {
  'activeListings': (number);
  'completedSales': (number);
  'purchasedProducts': (number);
  'soldListings': (number);
}

export interface GetLegacyUserViaLocalPhoneResponse {
  'isValid'?: (boolean);
  'countryCode'?: (string);
  'mobileNumber'?: (string);
  'userType'?: (string);
  'userId'?: (string);
  'userStatus'?: (string);
  'otpVerification'?: (boolean);
  'isActive'?: (boolean);
  'isDeleted'?: (boolean);
  'isMerchant'?: (boolean);
  'language'?: (string);
  'ratesScan'?: (boolean);
  'profilePic'?: (string);
  'listings'?: (_v2_GetLegacyUserViaLocalPhoneResponse_Listings | null);
  'name'?: (string);
  'cards'?: (string)[];
  'isAllowedMobileNumber'?: (boolean);
  'region'?: (string);
  'isKeySeller'?: (boolean);
  '_isKeySeller'?: "isKeySeller";
}

export interface GetLegacyUserViaLocalPhoneResponse__Output {
  'isValid': (boolean);
  'countryCode': (string);
  'mobileNumber': (string);
  'userType': (string);
  'userId': (string);
  'userStatus': (string);
  'otpVerification': (boolean);
  'isActive': (boolean);
  'isDeleted': (boolean);
  'isMerchant': (boolean);
  'language': (string);
  'ratesScan': (boolean);
  'profilePic': (string);
  'listings': (_v2_GetLegacyUserViaLocalPhoneResponse_Listings__Output | null);
  'name': (string);
  'cards': (string)[];
  'isAllowedMobileNumber': (boolean);
  'region': (string);
  'isKeySeller'?: (boolean);
  '_isKeySeller': "isKeySeller";
}
