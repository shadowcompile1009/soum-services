import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';

import { ERequestStatus, Wallet } from '@/models/Wallet';
import { TableDateView } from '@/components/Shared/TableComponents';
import { useWalletDetails } from './hooks/useWalletDetails';
import { TransactionStatus } from './TransactionStatus';
import { WalletTransactionHistoryTable } from '../Shared/WalletTransactionHistoryTable';

interface walletTransactionsTableProps {
  walletId: string;
}

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: 'Transaction ID',
  }),
  columnHelper.accessor('type', {
    cell: (info) => info.getValue(),
    header: 'Transaction Type',
  }),
  columnHelper.accessor('createdAt', {
    cell: (info) => <TableDateView date={info.getValue()} />,
    header: 'Creation Date',
  }),
  columnHelper.accessor('amount', {
    cell: (info) => info.getValue(),
    header: 'Amount',
  }),
  columnHelper.accessor('status', {
    cell: (info) => (
      <TransactionStatus status={info.getValue() as ERequestStatus} />
    ),
    header: 'Status',
  }),
  // disable until implement delete backend side

  // columnHelper.display({
  //   id: 'actions',
  //   cell: (info) => (
  //     <DeleteTransactionAction
  //       walletId={info.row.original.id}
  //     />
  //   ),
  //   header: 'Actions',
  // }),
];

export function WalletTransactionsTable(props: walletTransactionsTableProps) {
  const { walletId } = props;
  const { data } = useWalletDetails(walletId);

  const mappedWalletTransactions = useMemo(
    () => Wallet.mapTransaction(data?.data?.transaction || {}),
    [data]
  );

  return (
    <WalletTransactionHistoryTable
      ExternalColumns={columns}
      transactionDetails={mappedWalletTransactions}
    />
  );
}
