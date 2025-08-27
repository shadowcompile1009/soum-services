// Original file: node_modules/soum-proto/proto/v2.proto


export interface UpdateSecurityFeeRequest {
  'userId'?: (string);
  'amount'?: (number | string);
  'isOptIn'?: (boolean);
}

export interface UpdateSecurityFeeRequest__Output {
  'userId': (string);
  'amount': (number);
  'isOptIn': (boolean);
}
