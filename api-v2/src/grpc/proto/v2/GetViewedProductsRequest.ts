// Original file: node_modules/soum-proto/proto/v2.proto


export interface GetViewedProductsRequest {
  'productIds'?: (string)[];
  'shouldSkipExpire'?: (boolean);
  'categoryId'?: (string);
  'getSpecificCategory'?: (boolean);
  '_shouldSkipExpire'?: "shouldSkipExpire";
  '_categoryId'?: "categoryId";
  '_getSpecificCategory'?: "getSpecificCategory";
}

export interface GetViewedProductsRequest__Output {
  'productIds': (string)[];
  'shouldSkipExpire'?: (boolean);
  'categoryId'?: (string);
  'getSpecificCategory'?: (boolean);
  '_shouldSkipExpire': "shouldSkipExpire";
  '_categoryId': "categoryId";
  '_getSpecificCategory': "getSpecificCategory";
}
