import { createColumnHelper } from '@tanstack/react-table';

import { Promocode } from '@/models/Promocode';

import { Column } from './columns';
import { StatusSwitch } from '../Actions/StatusSwitch';
import { Actions } from '../Actions/Actions';
import { format } from 'date-fns';

interface GetPromocodeColumnsProps {
  columns: Column[];
  currentPage: number;
  pageSize: number;
  queryKey: string;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  setSelectedPromocode: (promocode: Promocode | null) => void;
  setIsBulkModalOpen: (value: boolean) => void;
  isBulkModalOpen: boolean;
}

const columnHelper = createColumnHelper<Promocode>();

export function getPromocodeColumns(props: GetPromocodeColumnsProps) {
  const {
    columns,
    currentPage,
    pageSize,
    queryKey,
    isModalOpen,
    setIsModalOpen,
    setSelectedPromocode,
    setIsBulkModalOpen,
    isBulkModalOpen,
  } = props;

  const actionsColumn = [
    columnHelper.display({
      id: 'row_number',
      cell: (info) => {
        return (currentPage - 1) * pageSize + info.row.index + 1;
      },
      header: 'No.',
    }),
  ];

  const mappedColumns = columns.map((column) => {
    const { accessorKey, header } = column;

    if (header === 'No.') {
      return columnHelper.accessor(accessorKey, {
        header,
      });
    }
    if (header === 'Code') {
      return columnHelper.accessor(accessorKey, {
        cell: ({ row }) => {
          const { code, bulkPrefix } = row.original;
          const title = bulkPrefix && code === null ? bulkPrefix : code;

          return <p>{title || 'missing'}</p>;
        },
        header,
      });
    }
    if (header === 'Fixed Amount') {
      return columnHelper.accessor(accessorKey, {
        cell: ({ row }) => {
          const { promoType, discount, percentage } = row.original;
          return promoType === 'Fixed'
            ? `${discount || 'missing '}`
            : `${percentage || 'missing '}%`;
        },
        header,
      });
    }

    if (header === 'Start Date' || header === 'End Date') {
      return columnHelper.accessor(accessorKey, {
        cell: ({ row }) => {
          const date =
            header === 'Start Date'
              ? row.original.fromDate
              : row.original.toDate;
          return date ? format(new Date(date), 'dd/MM/yyyy') : 'missing';
        },
        header,
      });
    }

    if (accessorKey === 'promoCodeScope') {
      return columnHelper.accessor(accessorKey, {
        cell: ({ row }) => {
          const { promoCodeScope } = row.original;
          return (
            <p
              style={{
                textTransform: 'capitalize',
              }}
            >
              {promoCodeScope?.[0]?.promoCodeScopeType}
            </p>
          );
        },
        header,
      });
    }
    if (header === 'Enter ID') {
      return columnHelper.accessor(accessorKey, {
        cell: ({ row }) => {
          const { promoCodeScope } = row.original;

          return <p>{promoCodeScope?.[0]?.ids?.[0]}</p>;
        },
        header,
      });
    }
    if (accessorKey === 'status') {
      return columnHelper.accessor(accessorKey, {
        cell: ({ row }) => (
          <StatusSwitch promocode={row.original} queryKey={queryKey} />
        ),
        header,
      });
    }
    if (accessorKey === 'note') {
      return columnHelper.accessor(accessorKey, {
        cell: ({ row }) => {
          const { note } = row.original;
          return (
            <p
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                margin: 0,
                width: '11rem',
              }}
            >
              {note ? note : '-'}
            </p>
          );
        },
        header,
      });
    }
    if (header === 'Action') {
      return columnHelper.accessor(accessorKey, {
        cell: ({ row }) => {
          const { bulkPrefix, code } = row.original;
          const isBulk = bulkPrefix && code === null;
          return (
            <Actions
              isBulk={isBulk as boolean}
              promocode={row.original}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              setSelectedPromocode={setSelectedPromocode}
              isBulkModalOpen={isBulkModalOpen}
              setIsBulkModalOpen={setIsBulkModalOpen}
            />
          );
        },
        header: 'Actions',
      });
    }
    return columnHelper.accessor(accessorKey, {
      cell: (info) => info.getValue(),
      header,
    });
  });

  return [...actionsColumn, ...mappedColumns];
}
