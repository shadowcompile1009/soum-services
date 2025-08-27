import { CategoryTypes } from '../enums/category-types.enums';

export interface CategoryFilter {
  offset: number;
  limit: number;
  type: CategoryTypes;
}
