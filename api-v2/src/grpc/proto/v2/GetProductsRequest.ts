// Original file: node_modules/soum-proto/proto/v2.proto


export interface GetProductsRequest {
  'productIds'?: (string)[];
  'getAttributes'?: (boolean);
  '_getAttributes'?: "getAttributes";
}

export interface GetProductsRequest__Output {
  'productIds': (string)[];
  'getAttributes'?: (boolean);
  '_getAttributes': "getAttributes";
}
