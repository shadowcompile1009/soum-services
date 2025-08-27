import { DeepKeys } from '@tanstack/react-table';

import { ProductListing } from '@/models/ProductListing';

export interface Column {
  accessor: DeepKeys<ProductListing>;
  header: string;
  id?: string;
}

export const columns: Column[] = [
  {
    accessor: 'modelName',
    header: 'Name',
  },
  {
    accessor: 'categoryName',
    header: 'Device',
  },
  {
    accessor: 'brandName',
    header: 'Brand',
  },
  {
    accessor: 'sellPrice',
    header: 'Buy Now Price',
  },
  {
    accessor: 'variantName',
    header: 'Variant',
  },
  {
    accessor: 'bidPrice',
    header: 'Bid Price',
  },
  {
    accessor: 'sellStatus',
    header: 'Status',
  },
  {
    accessor: 'code',
    header: 'Code',
  },
  {
    accessor: 'isListedBefore',
    header: 'Listed elsewhere',
  },
  {
    accessor: 'bidding',
    header: 'No. of bids',
  },
];
