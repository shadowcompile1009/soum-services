import { Upfronts } from '@/models/Upfronts';
import { DeepKeys } from '@tanstack/react-table';

export interface ColumnUpfrontLogs {
  accessor: DeepKeys<Upfronts>;
  header: string;
}

export const newUpfrontColumn: ColumnUpfrontLogs[] = [
  {
    accessor: 'orderNumber',
    header: 'Order ID',
  },
  {
    accessor: 'createdAt',
    header: 'Date',
  },
  {
    accessor: 'product',
    header: 'Product ID',
  },
  {
    accessor: 'userId',
    header: 'User ID',
  },
  {
    accessor: 'trackingNumber',
    header: 'Tracking Number',
  },
  {
    accessor: 'status',
    header: 'Order Status',
  },
];
