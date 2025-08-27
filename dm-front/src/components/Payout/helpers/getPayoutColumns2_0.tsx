import { createColumnHelper } from '@tanstack/react-table';

import { TableDateView } from '@src/components/Shared/TableComponents';
import { OrderStatusSelect } from '@src/components/Shared/OrderStatusSelect';
import { Column, Order } from '@src/models/Order';
import { ViewIcon } from '@src/components/Shared/Action/ViewIcon';
import { Action } from '@src/components/Shared/Action/Action';
import { ProcessDisputeIcon } from '@src/components/Shared/ProcessDisputeIcon';
import { Text } from '@src/components/Text';

const columnHelper = createColumnHelper<Order>();

interface getPayoutColumns2_0Props {
  columns: Column[];
  queryKey: string[];
  modalName: 'buyerRefund' | 'sellerPayout';
}

export function getPayoutColumns2_0(props: getPayoutColumns2_0Props) {
  const { columns, modalName, queryKey } = props;

  const mappedColumns = columns.map((column) => {
    const { accessor, header } = column;
    if (accessor === 'date') {
      return columnHelper.accessor(accessor, {
        cell: (info) => <TableDateView date={info.getValue()} />,
        header,
      });
    }

    if (accessor === 'orderStatus') {
      return columnHelper.accessor(accessor, {
        cell: (info) => (
          <OrderStatusSelect
            order={info.row.original}
            value={info.row.original.orderStatus}
            orderId={info.row.original.dmOrderId}
            queryKey={queryKey}
          />
        ),
        header,
      });
    }

    if (accessor === 'payoutType') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.getValue(),
        header,
      });
    }

    if (accessor === 'buyer.promo') {
      return columnHelper.accessor(accessor, {
        cell: () => (
          <Text color="static.black" fontSize="baseText" fontWeight="bold">
            N/A
          </Text>
        ),
        header,
      });
    }

    if (accessor === 'payment') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.getValue().paymentType,
        header,
      });
    }
    if (accessor === 'orderNumber') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.row.original.orderNumber,
        header,
      });
    }

    if (accessor === 'payoutStatus') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.row.original.orderStatus.displayName,
        header,
      });
    }

    return columnHelper.accessor(accessor, {
      cell: (info) => info.getValue(),
      header,
    });
  });

  const isRefundOrPayout = modalName === 'buyerRefund';
  const otherColumns = [
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        const orderId = info.row.original.id;

        return (
          <Action
            firstPathName={`/orders/all/${info.row.original.id}`}
            firstIcon={<ViewIcon />}
            firstIconText="View"
            secondPathName={
              isRefundOrPayout
                ? `/payouts2_0/buyer-refund/${orderId}`
                : `/payouts2_0/seller-payout/${orderId}`
            }
            secondIcon={<ProcessDisputeIcon />}
            secondIconText={
              isRefundOrPayout ? 'Process Refund' : 'Process Payout'
            }
            search={info.row.original.orderNumber}
          />
        );
      },
      header: isRefundOrPayout ? 'Refund' : 'Action',
    }),
  ];

  return [...mappedColumns, ...otherColumns];
}
