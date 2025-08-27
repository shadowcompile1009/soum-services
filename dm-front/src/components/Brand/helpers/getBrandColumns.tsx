import ImageItem from '@/components/Shared/ImageViewer/ImageItem';
import { CategoriesValues } from '@/models/Category';
import { createColumnHelper } from '@tanstack/react-table';
import Actions from '../Actions/Actions';
import { BrandColumn } from './columns';
import { Brand } from '@/models/Brand';

interface Props {
  categoryType: CategoriesValues;
  columns: BrandColumn[];
  currentPage: number;
  pageSize: number;
  categoryId: string;
  queryKey: string;
}

const columnHelper = createColumnHelper<Brand>();

const getBrandColumns = (props: Props) => {
  const { columns, currentPage, pageSize, queryKey, categoryType, categoryId } =
    props;

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
        return (
          <Actions
            brand={info.row.original}
            categoryId={categoryId}
            queryKey={queryKey}
            categoryType={categoryType}
          />
        );
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

    if (accessor === 'brandIcon') {
      return columnHelper.accessor(accessor, {
        cell: (info) => {
          return (
            info.getValue() && (
              <ImageItem
                src={info.getValue()}
                alt={info.getValue()}
                onDelete={() => {}}
                onExpand={() => {}}
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

  return [...actionsColumn, ...mappedColumns];
};

export default getBrandColumns;
