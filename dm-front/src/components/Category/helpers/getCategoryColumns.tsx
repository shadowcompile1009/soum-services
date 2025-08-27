import ImageItem from '@/components/Shared/ImageViewer/ImageItem';
import { CategoriesValues, Category } from '@/models/Category';
import { createColumnHelper } from '@tanstack/react-table';
import Actions from '../Actions/Actions';
import { CategoryColumn } from './columns';

interface Props {
  categoryType: CategoriesValues;
  columns: CategoryColumn[];
  currentPage: number;
  pageSize: number;
  queryKey: string;
}

const columnHelper = createColumnHelper<Category>();

const getCategoryColumns = (props: Props) => {
  const { columns, currentPage, pageSize, queryKey, categoryType } = props;
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
        return <Actions category={info.row.original} queryKey={queryKey} categoryType={categoryType} />;
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

    if (accessor === 'icon') {
      return columnHelper.accessor(accessor, {
        cell: (info) => {
          return info.getValue() && (
            <ImageItem
              src={info.getValue()}
              alt={info.getValue()}
              onDelete={() => {}}
              onExpand={() => {}}
            />
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

  return [...actionsColumn, ...mappedColumns];
};

export default getCategoryColumns;
