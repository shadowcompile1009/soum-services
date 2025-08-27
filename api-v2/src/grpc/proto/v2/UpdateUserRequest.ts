// Original file: node_modules/soum-proto/proto/v2.proto

export interface UpdateUserRequest {
  userId?: string;
  userStatus?: string;
  otpVerification?: boolean;
}

export interface UpdateUserRequest__Output {
  userId: string;
  userStatus: string;
  otpVerification: boolean;
}
