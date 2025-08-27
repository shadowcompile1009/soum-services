// Original file: node_modules/soum-proto/proto/v2.proto

export interface GetMobileNumberUserResponse {
  isValid?: boolean;
  countryCode?: string;
  mobileNumber?: string;
  userType?: string;
  userId?: string;
  userStatus?: string;
  otpVerification?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface GetMobileNumberUserResponse__Output {
  isValid: boolean;
  countryCode: string;
  mobileNumber: string;
  userType: string;
  userId: string;
  userStatus: string;
  otpVerification: boolean;
  isActive: boolean;
  isDeleted: boolean;
}
