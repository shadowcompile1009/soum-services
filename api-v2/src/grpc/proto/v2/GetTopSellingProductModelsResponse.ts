// Original file: node_modules/soum-proto/proto/v2.proto


export interface _v2_GetTopSellingProductModelsResponse_TopSellingProduct {
  'modelName'?: (string);
  'varient'?: (string);
  'totalSales'?: (number);
  'modelIcon'?: (string);
  'modelNameAR'?: (string);
  'totalAmount'?: (number | string);
  'varientAR'?: (string);
}

export interface _v2_GetTopSellingProductModelsResponse_TopSellingProduct__Output {
  'modelName': (string);
  'varient': (string);
  'totalSales': (number);
  'modelIcon': (string);
  'modelNameAR': (string);
  'totalAmount': (number);
  'varientAR': (string);
}

export interface GetTopSellingProductModelsResponse {
  'products'?: (_v2_GetTopSellingProductModelsResponse_TopSellingProduct)[];
  'totalItems'?: (number);
  'totalPages'?: (number);
  'currentPage'?: (number);
  'pageSize'?: (number);
}

export interface GetTopSellingProductModelsResponse__Output {
  'products': (_v2_GetTopSellingProductModelsResponse_TopSellingProduct__Output)[];
  'totalItems': (number);
  'totalPages': (number);
  'currentPage': (number);
  'pageSize': (number);
}
