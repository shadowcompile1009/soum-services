// Original file: node_modules/soum-proto/proto/v2.proto

import type { Models as _v2_Models, Models__Output as _v2_Models__Output } from '../v2/Models';

export interface Brand {
  'id'?: (string);
  'categoryId'?: (string);
  'brandNameAr'?: (string);
  'brandName'?: (string);
  'brandIcon'?: (string);
  'status'?: (string);
  'totalAvailableProducts'?: (number);
  'models'?: (_v2_Models)[];
}

export interface Brand__Output {
  'id': (string);
  'categoryId': (string);
  'brandNameAr': (string);
  'brandName': (string);
  'brandIcon': (string);
  'status': (string);
  'totalAvailableProducts': (number);
  'models': (_v2_Models__Output)[];
}
