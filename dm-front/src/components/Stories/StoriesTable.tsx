import { Text } from '@/components/Text';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import isEmpty from 'lodash.isempty';
import {
  OverflowWrapper,
  Table,
  TableContainer,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
} from '../Shared/TableComponents';
import { storiesColumn } from './helpers/columns';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { AdminPagination } from '../Pagination';
import getStoriesColumns from './helpers/getStoriesColumns';
import { useAdminStoryPagination } from '../Pagination/hooks/useAdminPagination';
import { useStories } from './hooks/useStories';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { TableLoader } from '../TableLoader';
import { motion } from 'framer-motion';
import StoriesModal from './StoriesModal';
import StoriesOrderModal from './StoriesOrderModal';
import EmptyIcon from 'pages/stories/EmptyIcon';
import { Stack } from '../Layouts';
import { Button } from '../Button';

interface Props {
  isOpen: boolean;
  isOpenOrderModal: boolean;
  setOpenOrderModal: () => void;
  setOpenModal: () => void;
}

const StoriesTable = ({
  isOpen,
  isOpenOrderModal,
  setOpenOrderModal,
  setOpenModal,
}: Props) => {
  const [story, setStory] = useState();
  const router = useRouter();
  const { query } = router;
  const { search = '', filterDate = '' } = query;
  const {
    data: stories,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useStories();

  const paginationData = useAdminStoryPagination({
    totalResult: stories?.total ?? 0,
    pageSize: Number(stories?.limit),
    currentPage: Number(stories?.offset),
  });

  const columns = useMemo(
    () =>
      getStoriesColumns({
        columns: storiesColumn,
        queryKey: [
          QUERY_KEYS.stories,
          String(stories?.limit),
          String(stories?.offset),
          String(search),
          String(filterDate),
        ],
      }),
    [stories, search, filterDate]
  );

  const table = useReactTable({
    data: stories?.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  if (isError)
    return (
      <TableContainer>
        <Text color="static.red" fontSize="smallText" fontWeight="regular">
          Something went wrong
        </Text>
      </TableContainer>
    );

  const handleStory = (row: any) => {
    setStory(row.original);
  };

  return (
    <>
      {isEmpty(stories.items) && !isLoading && isSuccess ? (
        <Stack align="center" direction="vertical" justify="center">
          <EmptyIcon />
          <Text
            color="static.grays.500"
            fontSize="smallText"
            fontWeight="semibold"
          >
            No sections have been added for stories
          </Text>
          <Button
            onClick={setOpenModal}
            variant="filled"
            style={{ marginTop: '20px' }}
          >
            Add Stories
          </Button>
        </Stack>
      ) : (
        <>
          <TableContainer
            as={motion.div}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OverflowWrapper>
              <Table>
                <THead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <THeadCell key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </THeadCell>
                      ))}
                    </tr>
                  ))}
                </THead>
                <TBody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} onClick={() => handleStory(row)}>
                      {row.getVisibleCells().map((cell) => (
                        <TBodyCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, {
                            ...cell.getContext(),
                            data: story,
                            refetch: refetch,
                          })}
                        </TBodyCell>
                      ))}
                    </tr>
                  ))}
                </TBody>
              </Table>
            </OverflowWrapper>
          </TableContainer>
          <AdminPagination {...paginationData} />
        </>
      )}

      <StoriesModal
        isOpen={isOpen}
        onClose={setOpenModal}
        isLoading={isLoading}
        refetch={refetch}
      />
      <StoriesOrderModal
        isOpen={isOpenOrderModal}
        setOpen={setOpenOrderModal}
        refetch={refetch}
        data={stories}
      />
    </>
  );
};

export default StoriesTable;
