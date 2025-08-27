import { DeepKeys, createColumnHelper } from '@tanstack/react-table';
import { TableDateView } from '@/components/Shared/TableComponents';
import { Text } from '@/components/Text';

import { PaymentLogs } from '@/models/PaymentLogs';
import { PaymentLogsAction } from '@/components/Payout/PaymentLogsAction';

const columnHelper = createColumnHelper<PaymentLogs>();

export interface Column {
  accessor: DeepKeys<PaymentLogs>;
  header: string;
}

interface getOrderColumnsProps {
  columns: Column[];
  queryKey: string[];
  modalName?: string;
}

export function getPaymentLogsColumns(props: getOrderColumnsProps) {
  const { columns } = props;

  const mappedColumns = columns.map((column) => {
    const { accessor, header } = column;

    switch (accessor) {
      case 'actionDate':
        return columnHelper.accessor(accessor, {
          cell: (info) => {
            const dateValue = new Date(info.getValue() as string); // Safely convert string to Date
            return <TableDateView date={dateValue} />;
          },
          header,
        });

      case 'paymentErrorId':
      case 'errorMessage':
        return columnHelper.accessor(accessor, {
          cell: (info) => (
            <Text
              as="span"
              fontSize="smallText"
              color={'static.red'}
              fontWeight={'smallText'}
            >
              {info.getValue()}
            </Text>
          ),
          header,
        });

      case 'paymentProvidor':
        return columnHelper.accessor(accessor, {
          cell: (info) => (
            <span style={{ textTransform: 'capitalize' }}>
              {info.getValue()}
            </span>
          ),
          header,
        });

      case 'orderId':
        return columnHelper.accessor(accessor, {
          cell: (info) =>
            (info.getValue() as string) === 'NON' ? 'N/A' : info.getValue(),
          header,
        });

      default:
        return columnHelper.accessor(accessor, {
          cell: (info) => info.getValue(),
          header,
        });
    }
  });

  const actionsColumn = [
    columnHelper.display({
      id: 'actions',
      cell: (info) => <PaymentLogsAction rowData={info.row.original} />,
      header: 'View Details',
    }),
  ];

  return [...mappedColumns, ...actionsColumn];
}
