import { DeepKeys } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Promocode } from '@/models/Promocode';

export interface Column {
  accessorKey: DeepKeys<Promocode>;
  header: string;
  id?: string;
  cell?: any;
}

export const promocodeColumns = [
  {
    header: 'Code',
    accessorKey: 'code',
  },
  {
    header: 'Discount Type',
    accessorKey: 'promoType',
  },
  {
    header: 'Fixed Amount',
    accessorKey: 'amount',
    cell: ({ row }: any) => {
      const { promoType, discount, percentage } = row.original;
      return promoType === 'Fixed' ? `${discount}` : `${percentage}%`;
    },
  },
  {
    header: 'Minimum Spend Limit',
    accessorKey: 'promoLimit',
  },
  {
    header: 'Start Date',
    accessorKey: 'fromDate',
    cell: ({ row }: any) =>
      format(new Date(row.original.fromDate), 'dd/MM/yyyy'),
  },
  {
    header: 'End Date',
    accessorKey: 'toDate',
    cell: ({ row }: any) => format(new Date(row.original.toDate), 'dd/MM/yyyy'),
  },
  {
    header: 'Limit Promocode',
    accessorKey: 'promoCodeScope',
  },
  {
    header: 'Enter ID',
    accessorKey: 'ids',
  },
  {
    header: 'Bulk Generation',
    accessorKey: 'totalCodes',
  },
  {
    header: 'Usage Limit',
    accessorKey: 'totalAllowedUsage',
  },
  {
    header: 'Note',
    accessorKey: 'note',
  },
  {
    header: 'Active/Inactive',
    accessorKey: 'status',
  },
  {
    header: 'Action',
    accessorKey: 'actions',
  },
];
