import { formatDistanceToNow } from 'date-fns';
import { DeepKeys, createColumnHelper } from '@tanstack/react-table';

import { TableDateView } from '@/components/Shared/TableComponents';
import { ActionSelect } from '@/components/Order';

import { OrderV2 } from '@/models/Order';

import { OrderDetailsLink } from '../OrderDetailsLink';

const columnHelper = createColumnHelper<OrderV2>();

export interface OrderColumnV2 {
  accessor: DeepKeys<OrderV2>;
  header: string;
}

interface getConfirmOrderColumnsProps {
  columns: OrderColumnV2[];
  queryKey: string[];
}

export function getConfirmOrderColumns(props: getConfirmOrderColumnsProps) {
  const { columns, queryKey } = props;

  return columns.map((column) => {
    const { accessor, header } = column;

    if (accessor === 'date' && header === 'Time since order') {
      return columnHelper.accessor(accessor, {
        cell: (info) => formatDistanceToNow(new Date(info.getValue())),
        header,
        id: 'time-since-order',
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
            submodule={'confirmation'}
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
