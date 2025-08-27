// Original file: node_modules/soum-proto/proto/v2.proto

import type { Category as _v2_Category, Category__Output as _v2_Category__Output } from '../v2/Category';
import type { StatusSummary as _v2_StatusSummary, StatusSummary__Output as _v2_StatusSummary__Output } from '../v2/StatusSummary';

export interface ProductForProductService {
  'id'?: (string);
  'description'?: (string);
  'categories'?: (_v2_Category)[];
  'imagesUrl'?: (string)[];
  'score'?: (number | string);
  'sellPrice'?: (number | string);
  'status'?: (string);
  'sellType'?: (string);
  'userId'?: (string);
  'groupListingId'?: (string);
  'statusSummary'?: (_v2_StatusSummary | null);
}

export interface ProductForProductService__Output {
  'id': (string);
  'description': (string);
  'categories': (_v2_Category__Output)[];
  'imagesUrl': (string)[];
  'score': (number);
  'sellPrice': (number);
  'status': (string);
  'sellType': (string);
  'userId': (string);
  'groupListingId': (string);
  'statusSummary': (_v2_StatusSummary__Output | null);
}
