import React, { useMemo } from 'react';
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
import { useOrdersTable } from '@/components/Shared/hooks/useOrdersTable';
import {
  TableContainer,
  Table,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
  OverflowWrapper,
} from '@/components/Shared/TableComponents';
import { EOrderModules } from '@/models/Order';
import { QUERY_KEYS } from '@/constants/queryKeys';

import { refundColumns } from './helpers/columns';
import { getPayoutColumns } from './helpers/getPayoutColumns';

export function BuyerRefundTable() {
  const router = useRouter();
  const { query } = router;
  const { search = '' } = query;
  const {
    isLoading,
    isSuccess,
    orders: payouts,
    total,
    isError,
    limit: apiLimit,
    offset,
  } = useOrdersTable({ submodule: EOrderModules.REFUND });

  const pagination = usePagination({ limit: String(apiLimit), offset, total });

  const columns = useMemo(
    () =>
      getPayoutColumns({
        modalName: 'buyerRefund',
        columns: refundColumns,
        queryKey: [
          QUERY_KEYS.buyerRefunds,
          String(apiLimit),
          String(offset),
          String(search),
        ],
      }),
    // need new orders deps, otherwise react-table doesnt know, if we have new data
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payouts]
  );

  const table = useReactTable({
    data: payouts!,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  if (isEmpty(payouts) && !isLoading && isSuccess)
    return (
      <TableContainer>
        <Text color="static.gray" fontSize="smallText" fontWeight="regular">
          No buyer refund orders
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
        {isEmpty(payouts) && !isLoading && isSuccess ? (
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
