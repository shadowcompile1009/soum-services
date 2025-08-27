import React from 'react';
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
import { useFinanceOrdersTable } from '@/components/Shared/hooks';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { financeOrderColumn } from './helpers/columns';
import { EFinanceOrderModules } from '@/models/Order';
import { getFinanceOrderColumns } from './helpers/getCarRealStateOrdersColumns';
import { useQuery } from '@tanstack/react-query';
import { StatusGroup } from '@/models/StatusGroup';

export function CarRealStateTable() {
  const router = useRouter();
  const { query } = router;
  const { search = '' } = query;
  const {
    isLoading,
    isSuccess,
    orders: carRealStateOrders,
    total,
    isError,
    limit: apiLimit,
    offset,
  } = useFinanceOrdersTable({ submodule: EFinanceOrderModules.Finance });
  const { data: reservationStatuses } = useQuery([QUERY_KEYS.reservationOrderStatuses], () =>
    StatusGroup.getStatusGroup({ group: 'reservation' })
  );
  const { data: financingStatuses } = useQuery([QUERY_KEYS.financingOrderStatuses], () =>
    StatusGroup.getStatusGroup({ group: 'financing' })
  );
  const pagination = usePagination({
    limit: String(apiLimit),
    offset,
    total: total!,
  });
  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([]);

  const columns =
    getFinanceOrderColumns({
      columns: financeOrderColumn,
      queryKey: [
        QUERY_KEYS.listingCarRealState,
        String(apiLimit),
        String(offset),
        String(search),
      ],
      financingOptions: financingStatuses,
      reservationOptions: reservationStatuses,
      selectedStatus,
      setSelectedStatus,
    });

  const table = useReactTable({
    data: carRealStateOrders!,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  if (isEmpty(carRealStateOrders) && !isLoading && isSuccess)
    return (
      <TableContainer>
        <Text color="static.gray" fontSize="smallText" fontWeight="regular">
          No Cars or Real State Orders
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
        {isEmpty(carRealStateOrders) && !isLoading && isSuccess ? (
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
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TBodyCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TBodyCell>
                      );
                    })}
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
