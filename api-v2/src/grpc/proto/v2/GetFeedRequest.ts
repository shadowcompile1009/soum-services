// Original file: node_modules/soum-proto/proto/v2.proto


export interface GetFeedRequest {
  'size'?: (number);
  'feedTypes'?: (string)[];
  'brands'?: (string)[];
  'models'?: (string)[];
  'categories'?: (string)[];
  'category'?: (string);
  '_category'?: "category";
}

export interface GetFeedRequest__Output {
  'size': (number);
  'feedTypes': (string)[];
  'brands': (string)[];
  'models': (string)[];
  'categories': (string)[];
  'category'?: (string);
  '_category': "category";
}
