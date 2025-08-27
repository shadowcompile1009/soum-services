// Original file: node_modules/soum-proto/proto/v2.proto


export interface GetBannersRequest {
  'bannerPage'?: (string)[];
  'bannerPosition'?: (string);
  'region'?: (string);
  'lang'?: (string);
  'type'?: (string);
  '_type'?: "type";
}

export interface GetBannersRequest__Output {
  'bannerPage': (string)[];
  'bannerPosition': (string);
  'region': (string);
  'lang': (string);
  'type'?: (string);
  '_type': "type";
}
