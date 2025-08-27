// Original file: node_modules/soum-proto/proto/category.proto

export interface GetAttributesRequest {
  size?: number;
  page?: number;
  search?: string;
  optionsIncluded?: boolean;
  _optionsIncluded?: 'optionsIncluded';
}

export interface GetAttributesRequest__Output {
  size: number;
  page: number;
  search: string;
  optionsIncluded?: boolean;
  _optionsIncluded: 'optionsIncluded';
}
