import { createColumnHelper } from '@tanstack/react-table';

import { FlaggedListing } from '@/models/FlaggedListings';
import { TableDateView } from '@/components/Shared/TableComponents';
import { ActualImage } from '@/components/Frontliners/ActualImage';
import { ListingImages } from '@/components/Shared/ListingImages';
import { Actions } from '@/components/Frontliners/Actions';

import { Column } from './columns';

interface getFlaggedListingColumnsProps {
  columns: Column[];
  currentPage: number;
  pageSize: number;
  queryKey: string;
}

const columnHelper = createColumnHelper<FlaggedListing>();

export function getFlaggedListingColumns(props: getFlaggedListingColumnsProps) {
  const { columns, currentPage, pageSize, queryKey } = props;

  const actionsColumn = [
    columnHelper.display({
      id: 'row_number',
      cell: (info) => {
        return (currentPage - 1) * pageSize + info.row.index + 1;
      },
      header: 'No.',
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        return <Actions listing={info.row.original} queryKey={queryKey} />;
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

    if (accessor === 'actualProductImage') {
      return columnHelper.accessor(accessor, {
        cell: (info) => <ActualImage imageUrl={info.getValue()} />,
        header,
      });
    }

    if (accessor === 'images') {
      return columnHelper.accessor(accessor, {
        cell: (info) => {
          const mappedImages = info.getValue().map((image) => ({
            original: image,
          }));

          return <ListingImages images={mappedImages} />;
        },
        header,
      });
    }

    if (accessor === 'listingDate') {
      return columnHelper.accessor(accessor, {
        cell: (info) => <TableDateView date={info.getValue()} />,
        header,
      });
    }
    return columnHelper.accessor(accessor, {
      cell: (info) => info.getValue(),
      header,
    });
  });

  return [...actionsColumn, ...mappedColumns];
}
