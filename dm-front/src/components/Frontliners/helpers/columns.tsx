import { DeepKeys } from '@tanstack/react-table';

import { FlaggedListing } from '@/models/FlaggedListings';

export interface Column {
  accessor: DeepKeys<FlaggedListing>;
  header: string;
  id?: string;
}

export const flaggedListingColumn: Column[] = [
  {
    accessor: 'actualProductImage',
    header: 'Original',
  },
  {
    accessor: 'images',
    header: 'Listed',
  },
  {
    accessor: 'listingDate',
    header: 'Listing Timestamp',
  },
  {
    accessor: 'productId',
    header: 'Product ID',
  },
  {
    accessor: 'phoneNumber',
    header: 'Seller Contact',
  },
  {
    accessor: 'modelName',
    header: 'Model',
  },
  {
    accessor: 'buyNowPrice',
    header: 'Price',
  },
  {
    accessor: 'discount',
    header: 'Discount %',
  },
  {
    accessor: 'pauseStatus',
    header: 'Paused',
  },
  {
    accessor: 'isFraudDetected',
    header: 'AI Status',
  },
  {
    accessor: 'productCondition',
    header: 'Product Condition',
  },
  {
    accessor: 'productDescription',
    header: 'Product Description',
  },
];
