import { DeepKeys, createColumnHelper } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';

import { TableDateView } from '@src/components/Shared/TableComponents';
import { Action } from '@src/components/Shared/Action/Action';
import { OrderV3 } from '@src/models/Order';
import { ViewIcon } from '@src/components/Shared/Action/ViewIcon';
import { ProcessDisputeIcon } from '@src/components/Shared/ProcessDisputeIcon';

const columnHelper = createColumnHelper<OrderV3>();

export interface OrderColumnDisputeV3 {
  accessor: DeepKeys<OrderV3>;
  header: string;
}

interface getDisputeOrdersColumnsProps {
  columns: OrderColumnDisputeV3[];
  queryKey: string[];
}

export function getDisputeOrdersColumns(props: getDisputeOrdersColumnsProps) {
  const { columns } = props;

  const mappedColumns = columns.map((column) => {
    const { accessor, header } = column;

    if (accessor === 'deliveryDate' && header === 'Time since Delivery') {
      return columnHelper.accessor(accessor, {
        cell: (info) =>
          info.getValue()
            ? formatDistanceToNow(new Date(info.getValue()))
            : 'NA',
        header,
      });
    }
    if (accessor === 'disputeDate' && header === 'Time since Dispute') {
      return columnHelper.accessor(accessor, {
        cell: (info) =>
          info.getValue()
            ? formatDistanceToNow(new Date(info.getValue()))
            : 'NA',
        header,
      });
    }
    if (accessor === 'date') {
      return columnHelper.accessor(accessor, {
        cell: (info) => <TableDateView date={info.getValue()} />,
        header,
      });
    }

    if (accessor === 'orderId') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.row.original.orderNumber,
        header,
      });
    }

    if (accessor === 'disputeStatus') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.row.original.orderStatus,
        header,
      });
    }

    return columnHelper.accessor(accessor, {
      cell: (info) => info.getValue(),
      header,
    });
  });

  const actionsColumn = [
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <Action
          firstPathName={`/orders/all/${info.row.original.orderId}`}
          secondPathName={`/dispute/${info.row.original.orderId}`}
          firstIcon={<ViewIcon />}
          firstIconText="View"
          secondIcon={<ProcessDisputeIcon />}
          secondIconText="Process Dispute"
        />
      ),
      header: 'Actions',
    }),
  ];

  return [...mappedColumns, ...actionsColumn];
}
