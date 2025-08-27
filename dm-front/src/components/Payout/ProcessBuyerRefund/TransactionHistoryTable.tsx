import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import isEmpty from 'lodash.isempty';
import { createColumnHelper } from '@tanstack/react-table';

import {
  TableContainer,
  Table,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
  OverflowWrapper,
} from '@src/components/Shared/TableComponents';
import { Text } from '@src/components/Text';
import { Pagination, usePagination } from '@src/components/Pagination';
import { TableLoader } from '@src/components/TableLoader';
import { TableDateView } from '@src/components/Shared/TableComponents';
import { Stack } from '@src/components/Layouts';
import { OrderActivityIcon } from '@src/components/Sidebar/OrderActivityIcon';
import { useTransactionHistory } from '@src/components/Settings/hooks/useTransactionHistory';
import { TransactionHistory } from '@src/models/TransactionHistory';

const columnHelper = createColumnHelper<TransactionHistory>();

const columns = [
  columnHelper.accessor('time', {
    cell: (info) => <TableDateView date={info.getValue()} />,
    header: 'Time',
  }),
  columnHelper.accessor('userName', {
    cell: (info) => info.getValue(),
    header: 'User Name',
  }),
  columnHelper.accessor('eventType', {
    cell: (info) => info.getValue(),
    header: 'Event Type',
  }),
  columnHelper.accessor('action', {
    cell: (info) => info.getValue(),
    header: 'Action Taken',
  }),
];
export function TransactionHistoryTable() {
  const { isLoading, data, isError, isSuccess } = useTransactionHistory();

  const { total, limit: apiLimit, offset } = data || {};

  const mappedLogs = useMemo(
    () => TransactionHistory.mapTransactionHistory(data?.data),
    [data]
  );

  const table = useReactTable({
    data: mappedLogs!,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const pagination = usePagination({
    limit: String(apiLimit),
    offset: String(offset),
    total,
  });

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  if (isEmpty(data?.data) && !isLoading && isSuccess)
    return (
      <TableContainer>
        <Text color="static.gray" fontSize="smallText" fontWeight="regular">
          No Transaction History
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
        <Stack direction="horizontal" gap="2" marginBottom="1.375rem">
          <OrderActivityIcon />
          <Text
            fontWeight="bigSubtitle"
            fontSize="bigSubtitle"
            color="static.black"
          >
            Transaction History
          </Text>
        </Stack>
        <OverflowWrapper>
          <Table>
            <THead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    if (header.isPlaceholder) {
                      return (
                        <THeadCell key={header.id} colSpan={header.colSpan} />
                      );
                    }

                    return (
                      <THeadCell key={header.id} colSpan={header.colSpan}>
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
              {table?.getRowModel()?.rows.map((row) => (
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
