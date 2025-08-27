// Original file: node_modules/soum-proto/proto/v2.proto


export interface Consignment {
  'orderNumber'?: (string);
  'payoutAmount'?: (number | string);
  'payoutStatus'?: (string);
}

export interface Consignment__Output {
  'orderNumber': (string);
  'payoutAmount': (number);
  'payoutStatus': (string);
}
