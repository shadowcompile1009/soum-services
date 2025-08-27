import { DeviceModel } from '@/models/DeviceModel';
import { createColumnHelper } from '@tanstack/react-table';
import Actions from '../Actions/Actions';
import { DeviceModelColumn } from './columns';
import { ActualImage } from '@/components/Frontliners/ActualImage';

interface Props {
  columns: DeviceModelColumn[];
  currentPage: number;
  pageSize: number;
  queryKey: string;
}

const columnHelper = createColumnHelper<DeviceModel>();

const getDeviceModelColumns = (props: Props) => {
  const { columns, currentPage, pageSize, queryKey } = props;
  const numberColumn = [
    columnHelper.display({
      id: 'row_number',
      cell: (info) => {
        return (currentPage - 1) * pageSize + info.row.index + 1;
      },
      header: 'No.',
    }),
  ];

  const actionsColumn = [
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        return <Actions deviceModel={info.row.original} queryKey={queryKey} />;
      },
      header: 'Actions',
    }),
  ];

  const mappedColumns = columns.map((column) => {
    const { accessor, header } = column;

    if (header === 'No.') {
      return columnHelper.accessor(accessor, {
        header,
      });
    }

    if (accessor === 'modelIcon') {
      return columnHelper.accessor(accessor, {
        cell: (info) => {
          return (
            info.getValue() && (
              <ActualImage
                width={100}
                height={100}
                imageUrl={info.getValue()}
              />
            )
          );
        },
        header,
      });
    }

    return columnHelper.accessor(accessor, {
      cell: (info) => info.getValue(),
      header,
    });
  });

  return [...numberColumn, ...mappedColumns, ...actionsColumn];
};

export default getDeviceModelColumns;
