import { Actions } from '@/components/Stories/Actions';
import { Story } from '@/models/Story';
import { createColumnHelper } from '@tanstack/react-table';
import { Column } from './columns';
import { ListingImages } from '@/components/Shared/ListingImages';
import { format } from 'date-fns';

interface getStoriesColumnsProps {
  columns: Column[];
  queryKey: string[];
}

const columnHelper = createColumnHelper<Story>();

const getStoriesColumns = (props: getStoriesColumnsProps) => {
  const { columns, queryKey } = props;
  const actionsColumn = [
    columnHelper.display({
      id: 'actions',
      cell: (info: any) => {
        return (
          <Actions
            refetch={info.refetch}
            story={info.data}
            queryKey={queryKey}
          />
        );
      },
      header: 'Actions',
    }),
  ];

  const mappedColumns = columns.map((column) => {
    const { accessor, header } = column;

    if (accessor === 'storyURLs') {
      return columnHelper.accessor(accessor, {
        header,
        cell: (info) => {
          const mappedImages = info.getValue().map((image) => ({
            original: image,
            isVideo: image.endsWith('.mp4'),
          }));

          return <ListingImages images={mappedImages} />;
        },
      });
    }

    if (accessor === 'startDate' || accessor === 'endDate') {
      return columnHelper.accessor(accessor, {
        // cell: (info) => <TableDateView date={info.getValue() as Date} />,
        cell: (info) => (
          <span>{format(new Date(info.getValue()), 'MM/dd/yyyy')}</span>
        ),
        header,
      });
    }

    return columnHelper.accessor(accessor, {
      cell: (info) => info.getValue(),
      header,
    });
  });
  return [...mappedColumns, ...actionsColumn];
};

export default getStoriesColumns;
