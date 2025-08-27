import { createColumnHelper } from '@tanstack/react-table';

import { TableDateView } from '@/components/Shared/TableComponents';
import { OrderStatusSelect } from '@/components/Shared/OrderStatusSelect';
import { Column, Order } from '@/models/Order';

import { PayoutAction } from '../PayoutAction';
import { OrderDetailsLink } from '@/components/Order/OrderDetailsLink';

const columnHelper = createColumnHelper<Order>();

interface getPayoutColumnsProps {
  columns: Column[];
  queryKey: string[];
  modalName: 'buyerRefund' | 'sellerPayout';
}

export function getPayoutColumns(props: getPayoutColumnsProps) {
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

    if (accessor === 'payment') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.getValue().paymentType,
        header,
      });
    }
    if (accessor === 'orderNumber') {
      return columnHelper.accessor(accessor, {
        cell: (info) => (
          <OrderDetailsLink orderId={info.row.original.id}>
            {info.row.original.orderNumber}
          </OrderDetailsLink>
        ),
        header,
      });
    }

    return columnHelper.accessor(accessor, {
      cell: (info) => info.getValue(),
      header,
    });
  });

  const isRefundOrPayout = modalName === 'buyerRefund';
  const actionsColumn = [
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <PayoutAction
          orderId={info.row.original.id}
          sellerId={info.row.original.seller.id}
          modalName={modalName}
        />
      ),
      header: isRefundOrPayout ? 'Refund' : 'Payout',
    }),
  ];

  return [...mappedColumns, ...actionsColumn];
}
