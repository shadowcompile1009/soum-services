// Original file: node_modules/soum-proto/proto/category.proto

import type {
  Condition as _category_Condition,
  Condition__Output as _category_Condition__Output,
} from '../category/Condition';

export interface GetConditionsResponse {
  conditions?: _category_Condition[];
}

export interface GetConditionsResponse__Output {
  conditions: _category_Condition__Output[];
}
