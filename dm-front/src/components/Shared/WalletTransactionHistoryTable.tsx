import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from '@tanstack/react-table';
import isEmpty from 'lodash.isempty';

import { TableDateView } from '@src/components/Shared/TableComponents';
import { Text } from '@src/components/Text';

import { TableBodyV2 } from './TableBodyV2';
import { OrderActivityIcon } from '../Sidebar/OrderActivityIcon';

interface WalletTransactionHistoryTableProps {
  transactionDetails: ITransactionsHistoryTable[] | any[];
  ExternalColumns?: any;
}

interface ITransactionsHistoryTable {
  transactionId: string;
  createdAt: Date;
  status: string;
  amount: string;
  hyperpayUniqueId: string;
  userPhoneNumber: string;
  agentId: string;
  agentName: string;
}

const columnHelper = createColumnHelper<ITransactionsHistoryTable>();

const columns = [
  columnHelper.accessor('transactionId', {
    cell: (info) => info.getValue(),
    header: 'Transaction ID',
  }),
  columnHelper.accessor('createdAt', {
    cell: (info) => <TableDateView date={info.getValue()} />,
    header: 'Date',
  }),
  columnHelper.accessor('status', {
    cell: (info) => info.getValue(),
    header: 'Status',
  }),
  columnHelper.accessor('amount', {
    cell: (info) => info.getValue(),
    header: 'Amount',
  }),
  columnHelper.accessor('hyperpayUniqueId', {
    cell: (info) => info.getValue(),
    header: 'Payment Gateway',
  }),
  columnHelper.accessor('userPhoneNumber', {
    cell: (info) => info.getValue(),
    header: 'Transferee Phone',
  }),
  columnHelper.accessor('agentName', {
    cell: (info) => info.getValue(),
    header: 'Done By',
  }),
];

export function WalletTransactionHistoryTable(
  props: WalletTransactionHistoryTableProps
) {
  const { transactionDetails, ExternalColumns } = props;

  const table = useReactTable({
    data: transactionDetails!,
    columns: ExternalColumns?.length ? ExternalColumns : columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isEmpty(transactionDetails)) {
    return (
      <Text fontSize="baseText" fontWeight="regular" color="static.grays.10">
        No transaction history available
      </Text>
    );
  }

  return (
    <TableBodyV2
      table={table}
      title={'Wallet Transactions History'}
      icon={<OrderActivityIcon />}
    />
  );
}
