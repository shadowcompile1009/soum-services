// Original file: node_modules/soum-proto/proto/v2.proto

import type { Brand as _v2_Brand, Brand__Output as _v2_Brand__Output } from '../v2/Brand';

export interface GetCategoryModelsCountResponse {
  'brands'?: (_v2_Brand)[];
  'showMileageFilter'?: (boolean);
  'showFinancingFilter'?: (boolean);
  'shopGreatDeals'?: (boolean);
  'carsPrice'?: (boolean);
  'showLT31'?: (boolean);
  'showGT80'?: (boolean);
  'showGT30AndLT60'?: (boolean);
  'showGT60AndLT80'?: (boolean);
}

export interface GetCategoryModelsCountResponse__Output {
  'brands': (_v2_Brand__Output)[];
  'showMileageFilter': (boolean);
  'showFinancingFilter': (boolean);
  'shopGreatDeals': (boolean);
  'carsPrice': (boolean);
  'showLT31': (boolean);
  'showGT80': (boolean);
  'showGT30AndLT60': (boolean);
  'showGT60AndLT80': (boolean);
}
