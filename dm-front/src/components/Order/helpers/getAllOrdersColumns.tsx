import { DeepKeys, createColumnHelper } from '@tanstack/react-table';

import { TableDateView } from '@src/components/Shared/TableComponents';
import { Action } from '@src/components/Shared/Action/Action';
import { OrderV3 } from '@src/models/Order';
import { EditIcon } from '@src/components/Shared/EditIcon';
import { ViewIcon } from '@src/components/Shared/Action/ViewIcon';

const columnHelper = createColumnHelper<OrderV3>();

export interface Column {
  accessor: DeepKeys<OrderV3>;
  header: string;
  sortingFn?: 'alphanumeric' | 'numeric';
}

export interface getOrderColumnsProps {
  columns: Column[];
  queryKey: string[];
  modalName?: string;
}

export function getAllOrderColumns(props: getOrderColumnsProps) {
  const { columns } = props;

  return columns.map((column) => {
    const { accessor, header } = column;

    if (accessor === 'actions') {
      return columnHelper.accessor(accessor, {
        cell: (info) => (
          <Action
            firstPathName={`/orders/all/${info.row.original.orderId}`}
            secondPathName={`/orders/all/edit-order/${info.row.original.orderId}`}
            firstIcon={<ViewIcon />}
            firstIconText="View"
            secondIcon={<EditIcon />}
            secondIconText="Edit"
          />
        ),
        header,
      });
    }

    if (accessor === 'orderId') {
      return columnHelper.accessor(accessor, {
        cell: (info) =>
          !!info.getValue() ? info.row.original.orderNumber : 'N/A',
        header,
      });
    }

    if (accessor === 'dateCreatedAt') {
      return columnHelper.accessor(accessor, {
        cell: (info) => <TableDateView date={info.getValue()} />,
        header,
      });
    }

    if (accessor === 'orderType') {
      return columnHelper.accessor(accessor, {
        cell: (info) => (!!info.getValue() ? info.getValue() : 'N/A'),
        header,
      });
    }

    if (accessor === 'logisticService') {
      return columnHelper.accessor(accessor, {
        cell: (info) => (!!info.getValue() ? info.getValue() : 'N/A'),
        header,
      });
    }

    if (accessor === 'operatingModel') {
      return columnHelper.accessor(accessor, {
        cell: (info) => (!!info.getValue() ? info.getValue() : 'N/A'),
        header,
      });
    }

    if (accessor === 'sellerType') {
      return columnHelper.accessor(accessor, {
        cell: (info) => (!!info.getValue() ? info.getValue() : 'N/A'),
        header,
      });
    }

    if (accessor === 'sellerCategory') {
      return columnHelper.accessor(accessor, {
        cell: (info) => (!!info.getValue() ? info.getValue() : 'N/A'),
        header,
      });
    }

    if (accessor === 'orderStatus') {
      return columnHelper.accessor(accessor, {
        cell: (info) => (!!info.getValue() ? info.getValue() : 'N/A'),
        header,
      });
    }

    return columnHelper.accessor(accessor as keyof OrderV3, {
      cell: (info) => (!!info.getValue() ? info.getValue() : 'N/A'),
      header,
    });
  });
}
