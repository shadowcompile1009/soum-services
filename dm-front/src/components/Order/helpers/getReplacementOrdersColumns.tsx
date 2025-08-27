import { DeepKeys, createColumnHelper } from '@tanstack/react-table';

import { Order } from '@/models/Order';
import { OrderStatusSelect } from '@/components/Shared/OrderStatusSelect';

import { OrderDetailsLink } from '../OrderDetailsLink';

import { useReplaceProductId } from '../hooks';

const columnHelper = createColumnHelper<Order>();

export interface OrderColumnReplacement {
  accessor: DeepKeys<Order>;
  header: string;
}

interface getReplacementOrdersColumnsProps {
  columns: OrderColumnReplacement[];
  queryKey: string[];
  replacementRefs: React.MutableRefObject<Record<string, string>>;
}

export function getReplacementOrdersColumns(
  props: getReplacementOrdersColumnsProps
) {
  const { columns, queryKey, replacementRefs } = props;

  return columns.map((column) => {
    const { accessor, header } = column;

    if (accessor === 'replacedProductId') {
      return columnHelper.accessor(accessor, {
        cell: (info) => {
          if (info.getValue()) return info.getValue();

          const RowCell = () => {
            const { ReplaceProductIdInput } = useReplaceProductId({
              rowId: info.row.id,
              replacedProductId: info.row.original.replacedProductId,
              replacementRefs,
              queryKey,
              orderId: info.row.original.id,
            });

            return <ReplaceProductIdInput />;
          };

          return <RowCell />;
        },
        header,
      });
    }

    if (accessor === 'issueReplacement') {
      return columnHelper.accessor(accessor, {
        cell: (info) => {
          const RowCell = () => {
            const { ReplaceProductIdSubmit } = useReplaceProductId({
              rowId: info.row.id,
              replacedProductId: info.row.original.replacedProductId,
              replacementRefs,
              queryKey,
              orderId: info.row.original.id,
            });
            return <ReplaceProductIdSubmit />;
          };

          return <RowCell />;
        },
        header,
      });
    }

    if (accessor === 'orderStatus') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.getValue(),
        header,
      });
    }

    if (accessor === 'productId') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.getValue(),
        header,
      });
    }

    if (accessor === 'productName') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.getValue(),
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

    if (accessor === 'replacedOrderId') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.getValue(),
        header,
      });
    }

    if (accessor === 'orderStatus.displayName') {
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

    return columnHelper.accessor(accessor, {
      cell: (info) => info.getValue(),
      header,
    });
  });
}
