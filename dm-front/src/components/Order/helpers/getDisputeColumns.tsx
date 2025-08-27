import { formatDistanceToNow } from 'date-fns';
import { DeepKeys, createColumnHelper } from '@tanstack/react-table';

import { TableDateView } from '@src/components/Shared/TableComponents';
import { ActionSelect } from '@src/components/Order';
import { OrderV2 } from '@src/models/Order';

import { OrderDetailsLink } from '../OrderDetailsLink';

const columnHelper = createColumnHelper<OrderV2>();

export interface OrderColumnDisputeV2 {
  accessor: DeepKeys<OrderV2>;
  header: string;
}

interface getDisputeColumnsProps {
  columns: OrderColumnDisputeV2[];
  queryKey: string[];
}

export function getDisputeColumns(props: getDisputeColumnsProps) {
  const { columns, queryKey } = props;

  return columns.map((column) => {
    const { accessor, header } = column;

    if (accessor === 'deliveryDate' && header === 'Time since Delivery') {
      return columnHelper.accessor(accessor, {
        cell: (info) =>
          info.getValue() ? formatDistanceToNow(new Date(info.getValue())) : '',
        header,
      });
    }
    if (accessor === 'disputeDate' && header === 'Time since Dispute') {
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
            submodule={'dispute'}
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
