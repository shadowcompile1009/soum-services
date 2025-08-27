import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import isEmpty from 'lodash.isempty';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

import { Text } from '@/components/Text';
import { Pagination, usePagination } from '@/components/Pagination';
import { TableLoader } from '@/components/TableLoader';

import {
  TableContainer,
  Table,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
  OverflowWrapper,
} from '@/components/Shared/TableComponents';
import { useOrdersTable } from '@/components/Shared/hooks/useOrdersTable';
import { EOrderModules } from '@/models/Order';
import { getOrderColumns } from '@/components/Order/helpers/getOrdersColumns';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { closedOrdersColumn } from './helpers/columns';

export function ClosedOrdersTable() {
  const router = useRouter();
  const { query } = router;
  const { search = '' } = query;
  const {
    isLoading,
    isSuccess,
    isError,
    orders: closedOrders,
    total,
    limit: apiLimit,
    offset,
  } = useOrdersTable({ submodule: EOrderModules.CLOSED });

  const pagination = usePagination({ limit: String(apiLimit), offset, total });

  const columns = useMemo(
    () =>
      getOrderColumns({
        columns: closedOrdersColumn,
        queryKey: [
          QUERY_KEYS.closedOrders,
          String(apiLimit),
          String(offset),
          String(search),
        ],
      }),
    // need closed orders deps, otherwise react-table doesnt know, if we have new data
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closedOrders]
  );

  const table = useReactTable({
    data: closedOrders!,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  if (isEmpty(closedOrders) && !isLoading && isSuccess)
    return (
      <TableContainer>
        <Text color="static.gray" fontSize="smallText" fontWeight="regular">
          No closed orders
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
        {isEmpty(closedOrders) && !isLoading && isSuccess ? (
          <Text color="static.gray" fontSize="smallText" fontWeight="regular">
            No orders
          </Text>
        ) : (
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
      <Pagination
        limit={pagination.limit}
        offset={pagination.offset}
        totalItems={pagination.total}
        currentItemsCount={pagination.currentItemsCount}
        currentPage={pagination.currentPage}
        items={pagination.items}
      />
    </>
  );
}
