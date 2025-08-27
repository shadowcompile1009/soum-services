import { DeepKeys } from '@tanstack/react-table';
import { Category } from '@/models/Category';

export interface CategoryColumn {
  accessor: DeepKeys<Category>;
  header: string;
}
export const categoryColumns: CategoryColumn[] = [
  {
    header: 'Picture',
    accessor: 'icon',
  },
  {
    header: 'Category Name',
    accessor: 'name',
  },
  {
    header: 'Max Percentage',
    accessor: 'maxPercentage',
  },
];
