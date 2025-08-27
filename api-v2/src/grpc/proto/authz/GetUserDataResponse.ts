// Original file: node_modules/soum-proto/proto/authz.proto

export interface GetUserDataResponse {
  storeCRN?: string;
  operatingModel?: string;
  businessModel?: string;
  sellerType?: string;
  sellerCategory?: string;
}

export interface GetUserDataResponse__Output {
  storeCRN: string;
  operatingModel: string;
  businessModel: string;
  sellerType: string;
  sellerCategory: string;
}
