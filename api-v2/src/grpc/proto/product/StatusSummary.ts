// Original file: node_modules/soum-proto/proto/product.proto

export interface StatusSummary {
  isApproved?: boolean;
  isExpired?: boolean;
  isDeleted?: boolean;
  isReported?: boolean;
  isVerifiedByAdmin?: boolean;
  isFraudDetected?: boolean;
  isSearchSync?: boolean;
}

export interface StatusSummary__Output {
  isApproved: boolean;
  isExpired: boolean;
  isDeleted: boolean;
  isReported: boolean;
  isVerifiedByAdmin: boolean;
  isFraudDetected: boolean;
  isSearchSync: boolean;
}
