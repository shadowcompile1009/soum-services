import React, { useMemo, useRef } from 'react';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import isEmpty from 'lodash.isempty';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

import { Pagination, usePagination } from '@/components/Pagination';
import { Text } from '@/components/Text';
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
import { QUERY_KEYS } from '@/constants/queryKeys';
import { EOrderModules } from '@/models/Order';

import { replacementOrdersColumn } from '../helpers/columns';
import { getReplacementOrdersColumns } from '../helpers/getReplacementOrdersColumns';

export function ReplacementOrdersTable() {
  const router = useRouter();
  const { query } = router;
  const { search = '', replacementStatus = '' } = query;
  const {
    isLoading,
    isSuccess,
    orders: replacementOrders,
    total,
    isError,
    limit: apiLimit,
    offset,
  } = useOrdersTable({ submodule: EOrderModules.REPLACEMENT });

  const pagination = usePagination({
    limit: String(apiLimit),
    offset,
    total: total!,
  });
  const replacementRefs = useRef<Record<string, string>>({});

  const columns = useMemo(
    () =>
      getReplacementOrdersColumns({
        columns: replacementOrdersColumn,
        queryKey: [
          QUERY_KEYS.replacementOrders,
          String(apiLimit),
          String(offset),
          String(search),
          String(replacementStatus),
        ],
        replacementRefs,
      }),
    [replacementOrders, apiLimit, offset, search, replacementStatus]
  );

  const table = useReactTable({
    data: replacementOrders!,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  if (isEmpty(replacementOrders) && !isLoading && isSuccess)
    return (
      <TableContainer>
        <Text color="static.gray" fontSize="smallText" fontWeight="regular">
          No Dispute Orders
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
        {isEmpty(replacementOrders) && !isLoading && isSuccess ? (
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
