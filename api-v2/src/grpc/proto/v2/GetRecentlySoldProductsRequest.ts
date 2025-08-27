// Original file: node_modules/soum-proto/proto/v2.proto


export interface GetRecentlySoldProductsRequest {
  'hours'?: (number);
  'limit'?: (number);
  'offset'?: (number);
  'categoryId'?: (string);
  'getSpecificCategory'?: (boolean);
  '_categoryId'?: "categoryId";
  '_getSpecificCategory'?: "getSpecificCategory";
}

export interface GetRecentlySoldProductsRequest__Output {
  'hours': (number);
  'limit': (number);
  'offset': (number);
  'categoryId'?: (string);
  'getSpecificCategory'?: (boolean);
  '_categoryId': "categoryId";
  '_getSpecificCategory': "getSpecificCategory";
}
