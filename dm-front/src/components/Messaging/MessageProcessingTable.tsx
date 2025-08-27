import { useMemo } from 'react';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';

import {
  TableContainer,
  Table,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
  OverflowWrapper,
  TableDateView,
} from '@/components/Shared/TableComponents';
import { Message } from '@/models/Message';
import { useOrderStatuses } from '@/components/Order/hooks/useOrderStatuses';
import { Loader } from '@/components/Loader';
import { Pagination, usePagination } from '@/components/Pagination';

import { MessageStatus } from './MessageStatus';

const columnHelper = createColumnHelper<Message>();

const columns = [
  columnHelper.accessor('orderNumber', {
    cell: (info) => info.getValue(),
    header: 'Order ID',
  }),
  columnHelper.accessor('date', {
    cell: (info) => <TableDateView date={info.getValue()} />,
    header: 'Date',
  }),
  columnHelper.accessor('orderStatus', {
    cell: (info) => info.getValue()?.displayName,
    header: 'Order Status',
  }),
  columnHelper.group({
    header: 'Buyer Processing',
    columns: [
      columnHelper.accessor('buyerMessages.status', {
        cell: (info) => <MessageStatus status={info.getValue()} />,
        header: 'Message Status',
      }),
      columnHelper.accessor('buyerMessages.date', {
        cell: (info) => <TableDateView date={info.getValue()} />,
        header: 'Message Date',
      }),
    ],
  }),
  columnHelper.group({
    header: 'Seller Processing',
    columns: [
      columnHelper.accessor('sellerMessages.status', {
        cell: (info) => <MessageStatus status={info.getValue()} />,
        header: 'Message Status',
      }),
      columnHelper.accessor('sellerMessages.date', {
        cell: (info) => <TableDateView date={info.getValue()} />,
        header: 'Message Date',
      }),
    ],
  }),
];

import { useProcessingTable } from '@/components/Messaging/hooks/useProcessingTable';

export function MessageProcessingTable() {
  const { isLoading, data = {} } = useProcessingTable();
  const orderStatuses = useOrderStatuses();

  const messageData = useMemo(() => {
    return Message.mapMessages(data.data!, orderStatuses);
  }, [data.data, orderStatuses]);

  const table = useReactTable({
    data: messageData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { limit: apiLimit, offset, total } = data;
  const pagination = usePagination({ limit: String(apiLimit), offset, total });

  return (
    <>
      <TableContainer
        as={motion.div}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <Loader />
        ) : (
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
