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
import { ActivityLog } from '@src/models/ActivityLog';
import { Pagination, usePagination } from '@src/components/Pagination';
import { TableLoader } from '@src/components/TableLoader';
import { TableDateView } from '@src/components/Shared/TableComponents';
import { Stack } from '../Layouts';
import { OrderActivityIcon } from '../Sidebar/OrderActivityIcon';

interface SharedActivityLogTableProps {
  data: any;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

const columnHelper = createColumnHelper<ActivityLog>();

const columns = [
  columnHelper.accessor('updatedAt', {
    cell: (info) => <TableDateView date={info.getValue()} />,
    header: 'Updated At',
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
export function SharedActivityLogTable(props: SharedActivityLogTableProps) {
  const { isLoading, data, isError, isSuccess } = props;

  const { total, limit: apiLimit, offset } = data || {};

  const mappedLogs = useMemo(
    () => ActivityLog.mapActivityLog(data?.data),
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
        <Stack direction="horizontal" gap="2" marginBottom="2.1875rem">
          <OrderActivityIcon />
          <Text
            fontWeight="bigSubtitle"
            fontSize="bigSubtitle"
            color="static.black"
          >
            Order’s Activity Log
          </Text>
        </Stack>
        <TableLoader />
      </TableContainer>
    );

  if (isEmpty(data?.data) && !isLoading && isSuccess)
    return (
      <TableContainer>
        <Stack direction="horizontal" gap="2" marginBottom="2.1875rem">
          <OrderActivityIcon />
          <Text
            fontWeight="bigSubtitle"
            fontSize="bigSubtitle"
            color="static.black"
          >
            Order’s Activity Log
          </Text>
        </Stack>
        <Text color="static.gray" fontSize="smallText" fontWeight="regular">
          No Activity Logs
        </Text>
      </TableContainer>
    );

  if (isError)
    return (
      <TableContainer>
        <Stack direction="horizontal" gap="2" marginBottom="2.1875rem">
          <OrderActivityIcon />
          <Text
            fontWeight="bigSubtitle"
            fontSize="bigSubtitle"
            color="static.black"
          >
            Order’s Activity Log
          </Text>
        </Stack>
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
        <Stack direction="horizontal" gap="2" marginBottom="2.1875rem">
          <OrderActivityIcon />
          <Text
            fontWeight="bigSubtitle"
            fontSize="bigSubtitle"
            color="static.black"
          >
            Order’s Activity Log
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
