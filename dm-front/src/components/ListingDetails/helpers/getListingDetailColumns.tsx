import { createColumnHelper } from '@tanstack/react-table';

import { ProductListing } from '@/models/ProductListing';

import { Column } from './columns';

interface getListingDetailColumnsProps {
  columns: Column[];
}

const columnHelper = createColumnHelper<ProductListing>();

export function getListingDetailColumns(props: getListingDetailColumnsProps) {
  const { columns } = props;

  return columns.map((column) => {
    const { accessor, header } = column;

    if (accessor === 'code' || accessor === 'isListedBefore') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.getValue() || 'N/A',
        header,
      });
    }

    if (accessor === 'bidding') {
      return columnHelper.accessor(accessor, {
        cell: (info) => info.getValue().length,
        header,
      });
    }

    return columnHelper.accessor(accessor, {
      cell: (info) => info.getValue(),
      header,
    });
  });
}
