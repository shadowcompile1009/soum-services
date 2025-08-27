import { formatDistanceToNow } from 'date-fns';
import { DeepKeys, createColumnHelper } from '@tanstack/react-table';

import { TableDateView } from '@/components/Shared/TableComponents';
import { ActionSelect } from '@/components/Order';

import { OrderV2 } from '@/models/Order';

import { OrderDetailsLink } from '../OrderDetailsLink';

const columnHelper = createColumnHelper<OrderV2>();

export interface OrderColumnBacklogV2 {
  accessor: DeepKeys<OrderV2>;
  header: string;
}

interface getBacklogOrderColumnsProps {
  columns: OrderColumnBacklogV2[];
  queryKey: string[];
}

export function getBacklogOrderColumns(props: getBacklogOrderColumnsProps) {
  const { columns, queryKey } = props;

  return columns.map((column) => {
    const { accessor, header } = column;

    if (accessor === 'shippingDate' && header === 'Time Since Shipping') {
      return columnHelper.accessor(accessor, {
        cell: (info) =>
          info.getValue() ? formatDistanceToNow(new Date(info.getValue())) : '',

        header,
      });
    }
    if (accessor === 'deliveryDate' && header === 'Time Since Delivery') {
      return columnHelper.accessor(accessor, {
        cell: (info) =>
          info.getValue() ? formatDistanceToNow(new Date(info.getValue())) : '',

        header,
      });
    }
    if (accessor === 'date') {
      return columnHelper.accessor(accessor, {
        cell: (info) => <TableDateView date={info.getValue()} />,
        header,
      });
    }
    if (accessor === 'orderStatus') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.getValue(),
        header,
      });
    }

    if (accessor === 'actions') {
      return columnHelper.accessor(accessor, {
        cell: (info) => (
          <ActionSelect
            options={info.getValue()}
            order={info.row.original}
            queryKey={queryKey}
            submodule={'backlog'}
          />
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

    return columnHelper.accessor(accessor, {
      cell: (info) => info.getValue(),
      header,
    });
  });
}
