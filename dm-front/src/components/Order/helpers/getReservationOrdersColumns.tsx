import { DeepKeys, createColumnHelper } from '@tanstack/react-table';

import { TableDateView } from '@/components/Shared/TableComponents';
import { Text } from '@/components/Text';
import { OrderStatusSelect } from '@/components/Shared/OrderStatusSelect';

import { Order } from '@/models/Order';

import { OrderDetailsLink } from '../OrderDetailsLink';
import { PayoutAction } from '@/components/Payout/PayoutAction';
import { CaptureLink } from '../CaptureLink';

const columnHelper = createColumnHelper<Order>();

export interface OrderColumnReservationV2 {
  accessor: DeepKeys<Order>;
  header: string;
}

interface getReservationOrderColumnsProps {
  columns: OrderColumnReservationV2[];
  queryKey: string[];
  modalName?: string;
}

export function getReservationOrderColumns(
  props: getReservationOrderColumnsProps
) {
  const { columns, queryKey, modalName = 'closedOrders' } = props;

  return columns.map((column) => {
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
        cell: (info) => (
          <Text
            as="span"
            color={info.getValue().textColor}
            fontSize="smallestText"
            fontWeight="semibold"
          >
            {info.getValue().status}
          </Text>
        ),
        header,
      });
    }
    if (accessor === 'captureOrder') {
      return columnHelper.accessor(accessor, {
        cell: (info) => (
          <Text
            as="span"
            color={info.getValue()?.textColor}
            fontSize="smallestText"
            fontWeight="semibold"
          >
            {info.getValue()?.captureStatus}
          </Text>
        ),
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

    if (accessor === 'id' && modalName === 'closedOrders') {
      return columnHelper.accessor(accessor, {
        cell: (info) => (
          <PayoutAction
            orderId={info.row.original.id}
            sellerId={info.row.original.seller.id}
            modalName={modalName}
          />
        ),
        header,
      });
    }

    if (accessor === 'captureTransaction') {
      return columnHelper.accessor(accessor, {
        cell: (info) => (
          <CaptureLink
            orderId={info.row.original.id}
            captureOrderDetails={info.row.original.captureOrder}
          >
            {info.row.original.orderNumber}
          </CaptureLink>
        ),
        header,
      });
    }

    return columnHelper.accessor(accessor, {
      cell: (info) => info.getValue(),
      header,
    });
  });
}
