import { useMemo } from 'react';

import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import isEmpty from 'lodash.isempty';

import { TableDateView } from '@src/components/Shared/TableComponents';
import { Box } from '@src/components/Box';
import { Loader } from '@src/components/Loader';
import { IPaymentResponse, Payment } from '@src/models/Payment';
import { Text } from '@src/components/Text';

import { usePaymentHistory } from './hooks/usePaymentHistory';
import { TableBodyV2 } from '../Shared/TableBodyV2';
import { OrderActivityIcon } from '../Sidebar/OrderActivityIcon';

interface PaymentHistoryTableV2Props {
  orderId: string;
  orderNumber: string;
}

const columnHelper = createColumnHelper<Payment>();

const columns = [
  columnHelper.accessor('transactionId', {
    cell: (info) => info.getValue(),
    header: 'Payout Transaction ID',
  }),
  columnHelper.accessor('orderNumber', {
    cell: (info) => info.getValue(),
    header: 'Order ID',
  }),
  columnHelper.accessor('transactionType', {
    cell: (info) => info.getValue(),
    header: 'Transaction Type',
  }),
  columnHelper.accessor('transactionStatus', {
    cell: (info) => info.getValue(),
    header: 'Transaction Status',
  }),
  columnHelper.accessor('paymentMethod', {
    cell: (info) => info.getValue(),
    header: 'Payment Method',
  }),
  columnHelper.accessor('amount', {
    cell: (info) => info.getValue(),
    header: 'Amount',
  }),
  columnHelper.accessor('paymentGatewayId', {
    cell: (info) => info.getValue(),
    header: 'PG ID',
  }),
  columnHelper.accessor('date', {
    cell: (info) => <TableDateView date={info.getValue()} />,
    header: 'Payment Timestamp',
  }),
  columnHelper.accessor('date', {
    id: 'payment-since',
    cell: (info) => formatDistanceToNow(new Date(info.getValue())),
    header: 'Time since payment',
  }),
  columnHelper.accessor('fulfilledBy', {
    cell: (info) => info.getValue(),
    header: 'Done by',
  }),
];

export function PaymentHistoryTableV2(props: PaymentHistoryTableV2Props) {
  const { orderId, orderNumber } = props;
  const { data, isLoading } = usePaymentHistory(orderId);

  const mappedPaymentHistory = useMemo(
    () =>
      Payment.mapPaymentHistory(
        data?.result.map((item: IPaymentResponse) => {
          return { ...item, orderNumber };
        })
      ),
    [data?.result, orderNumber]
  );

  const table = useReactTable({
    data: mappedPaymentHistory!,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <Box
        cssProps={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Loader size="48px" border="static.blue" marginRight="0" />
      </Box>
    );
  }

  if (isEmpty(mappedPaymentHistory)) {
    return (
      <Text fontSize="baseText" fontWeight="regular" color="static.grays.10">
        No payment history available
      </Text>
    );
  }

  return (
    <TableBodyV2
      table={table}
      title="Transaction History"
      icon={<OrderActivityIcon />}
    />
  );
}
