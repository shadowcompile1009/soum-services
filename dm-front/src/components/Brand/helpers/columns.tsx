import { DeepKeys } from '@tanstack/react-table';
import { Brand } from '@/models/Brand';

export interface BrandColumn {
  accessor: DeepKeys<Brand>;
  header: string;
}
export const brandColumns: BrandColumn[] = [
  {
    header: 'Picture',
    accessor: 'brandIcon',
  },
  {
    header: 'Brand Name',
    accessor: 'name',
  },
];
