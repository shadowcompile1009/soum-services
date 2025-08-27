// Original file: node_modules/soum-proto/proto/v2.proto

import type {
  MigrateCategoryCondition as _v2_MigrateCategoryCondition,
  MigrateCategoryCondition__Output as _v2_MigrateCategoryCondition__Output,
} from '../v2/MigrateCategoryCondition';

export interface MigrateCondition {
  categoryConditions?: _v2_MigrateCategoryCondition[];
  name?: string;
  nameAr?: string;
  categoryId?: string;
  scoreRangeMin?: number;
  scoreRangeMax?: number;
}

export interface MigrateCondition__Output {
  categoryConditions: _v2_MigrateCategoryCondition__Output[];
  name: string;
  nameAr: string;
  categoryId: string;
  scoreRangeMin: number;
  scoreRangeMax: number;
}
