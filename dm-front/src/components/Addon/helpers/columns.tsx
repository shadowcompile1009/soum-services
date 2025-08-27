import { Addon } from '@/models/Addon';
import { DeepKeys } from '@tanstack/react-table';

export interface AddonColumn {
  accessor: DeepKeys<Addon>;
  header: string;
}
export const addOnsColumns: AddonColumn[] = [
  {
    header: 'Add-on Type',
    accessor: 'type',
  },
  {
    header: 'Image',
    accessor: 'image',
  },
  {
    header: 'Name',
    accessor: 'name',
  },
  {
    header: 'Price',
    accessor: 'price',
  },
  {
    header: 'Tag Lines',
    accessor: 'tagLines',
  },
  {
    header: 'Period',
    accessor: 'period',
  },
  {
    header: 'Description EN',
    accessor: 'description',
  },
  {
    header: 'Description AR',
    accessor: 'descriptionAr',
  },
];
