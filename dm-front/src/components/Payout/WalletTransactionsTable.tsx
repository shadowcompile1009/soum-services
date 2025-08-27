import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { TableDateView } from '@/components/Shared/TableComponents';

import { IResponseWalletOrderTransaction, Wallet } from '@/models/Wallet';

import { useWalletTransaction } from './hooks/useWalletTransaction';
import { WalletTransactionHistoryTable } from '@/components/Shared/WalletTransactionHistoryTable';

interface WalletTransactionsTableProps {
  orderId: string;
}

const columnHelper = createColumnHelper<IResponseWalletOrderTransaction>();

const columns = [
  columnHelper.accessor('transactionId', {
    cell: (info) => info.getValue(),
    header: 'Transaction ID',
  }),
  columnHelper.accessor('walletId', {
    cell: (info) => info.getValue(),
    header: 'Wallet ID',
  }),
  columnHelper.accessor('createdAt', {
    cell: (info) => <TableDateView date={info.getValue()} />,
    header: 'Date',
  }),
  columnHelper.accessor('status', {
    cell: (info) => info.getValue(),
    header: 'Transaction Status',
  }),
  columnHelper.accessor('amount', {
    cell: (info) => info.getValue(),
    header: 'Amount',
  }),
  columnHelper.accessor('type', {
    cell: (info) => info.getValue(),
    header: 'Type',
  }),
  columnHelper.accessor('agentName', {
    cell: (info) => info.getValue(),
    header: 'Done by',
  }),
];

export function WalletTransactionsTable(props: WalletTransactionsTableProps) {
  const { orderId } = props;
  const { data } = useWalletTransaction(orderId);

  const mappedWalletTransactions = useMemo(
    () => Wallet.mapOrderTransactions(data || []),
    [data]
  );

  return (
    <WalletTransactionHistoryTable
      ExternalColumns={columns}
      transactionDetails={mappedWalletTransactions}
    />
  );
}
