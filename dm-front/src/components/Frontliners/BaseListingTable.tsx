import { useRouter } from 'next/router';
import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import isEmpty from 'lodash.isempty';
import { motion } from 'framer-motion';

import { Text } from '@/components/Text';
import { TableLoader } from '@/components/TableLoader';
import { FlaggedListingValues } from '@/models/FlaggedListings';
import { useAdminPagination, AdminPagination } from '@/components/Pagination';
import {
  TableContainer,
  Table,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
  OverflowWrapper,
} from '@/components/Shared/TableComponents';

import { flaggedListingColumn } from './helpers/columns';
import { getFlaggedListingColumns } from './helpers/getFlaggedListingColumns';
import { useFlaggedListings } from './hooks';

interface BaseListingTableProps {
  listing_type: FlaggedListingValues;
  queryKey: string;
}

export function BaseListingTable(props: BaseListingTableProps) {
  const { listing_type, queryKey } = props;
  const router = useRouter();
  const { query } = router;
  const { page = 1 } = query;
  const { data, isLoading, isSuccess, isError } =
    useFlaggedListings(listing_type);
  const pageSize = 50;
  const paginationData = useAdminPagination({
    totalResult: data?.total ?? 0,
    pageSize,
    currentPage: Number(page),
  });

  const columns = useMemo(
    () =>
      getFlaggedListingColumns({
        columns: flaggedListingColumn,
        currentPage: Number(page),
        pageSize,
        queryKey,
      }),
    [page, queryKey]
  );

  const table = useReactTable({
    data: data?.listings ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  if (isEmpty(data?.listings) && !isLoading && isSuccess)
    return (
      <TableContainer>
        <Text color="static.gray" fontSize="smallText" fontWeight="regular">
          No new orders
        </Text>
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

  return (
    <>
      <TableContainer
        as={motion.div}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isEmpty(data?.listings) && !isLoading && isSuccess ? (
          <Text color="static.gray" fontSize="smallText" fontWeight="regular">
            No Flagged Listings
          </Text>
        ) : (
          <OverflowWrapper>
            <Table>
              <THead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <THeadCell key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </THeadCell>
                      );
                    })}
                  </tr>
                ))}
              </THead>
              <TBody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TBodyCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TBodyCell>
                    ))}
                  </tr>
                ))}
              </TBody>
            </Table>
          </OverflowWrapper>
        )}
      </TableContainer>
      <AdminPagination {...paginationData} />
    </>
  );
}
