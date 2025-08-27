import { createColumnHelper } from '@tanstack/react-table';
import Actions from '../Actions/Actions';
import { AddonColumn } from './columns';
import { Addon } from '@/models/Addon';
import { ActualImage } from '@/components/Frontliners/ActualImage';
import { Box } from '@/components/Box';

interface Props {
  columns: AddonColumn[];
  offset?: number;
  limit?: number;
  currentPage?: number;
  pageSize?: number;
  queryKey: string[] | string;
}

const columnHelper = createColumnHelper<Addon>();

export const getSubAddonColumns = (props: Props) => {
  const { columns, currentPage, pageSize } = props;
  const numberColumn = [
    columnHelper.display({
      id: 'row_number',
      cell: (info) => {
        return (
          currentPage &&
          pageSize &&
          (currentPage - 1) * pageSize + info.row.index + 1
        );
      },
      header: 'Add-on No.',
    }),
  ];
  const actionsColumn = [
    columnHelper.display({
      id: 'actions',
      cell: (info: any) => {
        return <Actions addon={info.data} refetch={info.refetch} />;
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

    if (accessor === 'image') {
      return columnHelper.accessor(accessor, {
        cell: (info) => {
          const imageUrl = info.getValue();
          return (
            info.getValue() && (
              <ActualImage width={100} height={100} imageUrl={imageUrl} />
            )
          );
        },
        header,
      });
    }

    if (accessor === 'price') {
      return columnHelper.accessor(accessor, {
        cell: (info) => {
          const price = info.getValue();
          return (
            <Box>
              {price} {info.row.original.priceType === 'fixed' ? 'SAR' : '%'}{' '}
            </Box>
          );
        },
        header,
      });
    }

    if (accessor === 'period') {
      return columnHelper.accessor(accessor, {
        cell: (info) => {
          const period = info.getValue();
          const value = parseInt(period.split(' ')[0]);
          const unit = period.split(' ')[1];
          const result = !value
            ? ''
            : `${value} ${unit}${value > 1 ? 's' : ''}`;
          return <Box>{result}</Box>;
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

export const getMainAddonColumns = (props: Props) => {
  const { columns, offset } = props;
  const numberColumn = [
    columnHelper.display({
      id: 'row_number',
      cell: (info) => {
        // @ts-ignore
        return offset + info.row.index + 1;
      },
      header: 'Add-on No.',
    }),
  ];
  const actionsColumn = [
    columnHelper.display({
      id: 'actions',
      cell: (info: any) => {
        return <Actions addon={info.data} refetch={info.refetch} />;
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

    if (accessor === 'image') {
      return columnHelper.accessor(accessor, {
        cell: (info) => {
          const imageUrl = info.getValue();
          return (
            info.getValue() && (
              <ActualImage width={100} height={100} imageUrl={imageUrl} />
            )
          );
        },
        header,
      });
    }

    if (accessor === 'price') {
      return columnHelper.accessor(accessor, {
        cell: (info) => {
          const price = info.getValue();
          return (
            <Box>
              {price} {info.row.original.priceType === 'fixed' ? 'SAR' : '%'}{' '}
            </Box>
          );
        },
        header,
      });
    }

    if (accessor === 'period') {
      return columnHelper.accessor(accessor, {
        cell: (info) => {
          const period = info.getValue();
          const value = parseInt(period.split(' ')[0]);
          const unit = period.split(' ')[1];
          const result = !value
            ? ''
            : `${value} ${unit}${value > 1 ? 's' : ''}`;
          return <Box>{result}</Box>;
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
