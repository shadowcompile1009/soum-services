import { useMemo } from 'react';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import isEmpty from 'lodash.isempty';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

import { Pagination, usePagination } from '@src/components/Pagination';
import { Text } from '@src/components/Text';
import { TableLoader } from '@src/components/TableLoader';

import {
  TableContainer,
  Table,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
  OverflowWrapper,
} from '@src/components/Shared/TableComponents';
import { EOrderV3Modules } from '@src/models/Order';
import { getAllOrderColumns } from '@src/components/Order/helpers/getAllOrdersColumns';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { allOrderColumns } from './helpers/AllOrdersColumns';
import { useOrdersTableV3 } from '../Shared/hooks';

export function AllOrdersTable() {
  const router = useRouter();
  const { query } = router;
  const { search = '' } = query;
  const {
    isLoading,
    isSuccess,
    orders: allOrders,
    total,
    isError,
    limit: apiLimit,
    offset,
  } = useOrdersTableV3({ submodule: EOrderV3Modules.ALL });

  const pagination = usePagination({
    limit: String(apiLimit),
    offset,
    total: total ?? 1,
  });

  const columns = useMemo(
    () =>
      getAllOrderColumns({
        columns: allOrderColumns,
        queryKey: [
          QUERY_KEYS.allOrders,
          String(apiLimit),
          String(offset),
          String(search),
        ],
      }),
    // need new orders deps, otherwise react-table doesnt know, if we have new data
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allOrders]
  );

  const table = useReactTable({
    data: allOrders ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  if (isEmpty(allOrders) && !isLoading && isSuccess)
    return (
      <TableContainer>
        <Text color="static.gray" fontSize="smallText" fontWeight="regular">
          No result found
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
        {isEmpty(allOrders) && !isLoading && isSuccess ? (
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
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
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
