// Original file: node_modules/soum-proto/proto/v2.proto


export interface MigrateCategoryCondition {
  'id'?: (string);
  'categoryId'?: (string);
  'priceNudgeMin'?: (number);
  'priceNudgeMax'?: (number);
  'fairPrice'?: (number);
  'fairTTL'?: (number);
  'excellentPrice'?: (number);
  'excellentTTL'?: (number);
  'expensivePrice'?: (number);
  'expensiveTTL'?: (number);
}

export interface MigrateCategoryCondition__Output {
  'id': (string);
  'categoryId': (string);
  'priceNudgeMin': (number);
  'priceNudgeMax': (number);
  'fairPrice': (number);
  'fairTTL': (number);
  'excellentPrice': (number);
  'excellentTTL': (number);
  'expensivePrice': (number);
  'expensiveTTL': (number);
}
