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
import { QUERY_KEYS } from '@/constants/queryKeys';
import { PaymentLogsColumn } from '../Order/helpers/columns';
import { getPaymentLogsColumns } from '@/components/Payout/helpers/getPaymentLogsColumns';
import { usePaymentLogsTable } from '@/components/Order/hooks/usePaymentLogsTable';

export function PaymentLogsTable() {
  const router = useRouter();
  const { query } = router;
  const { mobileNumber = '', paymentErrorId = '', soumNumber = '' } = query;
  const {
    isLoading,
    isSuccess,
    isError,
    paymentLogs,
    total,
    limit: apiLimit,
    offset,
  } = usePaymentLogsTable();
  const pagination = usePagination({ limit: String(apiLimit), offset, total });

  const columns = useMemo(
    () =>
      getPaymentLogsColumns({
        columns: PaymentLogsColumn,
        queryKey: [
          QUERY_KEYS.paymentLogs,
          String(apiLimit),
          String(offset),
          String(mobileNumber),
          String(paymentErrorId),
          String(soumNumber),
        ],
      }),
    [paymentLogs]
  );

  const table = useReactTable({
    data: paymentLogs!,
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

  return (
    <>
      <TableContainer
        as={motion.div}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isEmpty(paymentLogs) && !isLoading && isSuccess ? (
          <Text color="static.gray" fontSize="smallText" fontWeight="regular">
            No payment logs found
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
