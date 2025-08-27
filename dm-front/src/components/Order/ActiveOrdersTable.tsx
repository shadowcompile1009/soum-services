import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import isEmpty from 'lodash.isempty';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { MultiValue } from 'react-select';

import { Stack } from '@/components/Layouts';
import { useOrderStatuses } from '@/components/Order/hooks/useOrderStatuses';
import { Text } from '@/components/Text';
import { Pagination, usePagination } from '@/components/Pagination';
import { TableLoader } from '@/components/TableLoader';
import { IOrderStatus, EOrderModules } from '@/models/Order';

import {
  TableContainer,
  Table,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
  OverflowWrapper,
} from '@/components/Shared/TableComponents';
import { useActiveOrdersData } from '@/components/Shared/hooks/useActiveOrdersData';
import { getOrderColumns } from '@/components/Order/helpers/getOrdersColumns';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { activeOrdersColumn } from './helpers/columns';
import { FilterStatusSelect } from '../Shared/FilterStatusSelect';
import { SearchFilter } from '@/components/Shared/SearchFilter';

export function ActiveOrdersTable() {
  const orderStatuses = useOrderStatuses(EOrderModules.ACTIVE);
  const router = useRouter();
  const { query } = router;
  const { search = '', statuses = '' } = query;

  const {
    isLoading,
    isSuccess,
    isError,
    orders: activeOrders,
    total,
    limit: apiLimit,
    offset,
  } = useActiveOrdersData();

  const pagination = usePagination({
    limit: String(apiLimit),
    offset: String(offset),
    total,
  });

  const columns = useMemo(
    () =>
      getOrderColumns({
        columns: activeOrdersColumn,
        queryKey: [
          QUERY_KEYS.activeOrders,
          String(apiLimit),
          String(offset),
          String(search),
        ],
      }),
    // need active orders deps, otherwise react-table doesnt know, if we have new data
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeOrders]
  );

  const table = useReactTable({
    data: activeOrders!,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const initialFilterStatuses = useMemo(() => {
    const statusesId = String(statuses).split(',')!;

    return statusesId.map((statusId) =>
      orderStatuses.find((orderStatus) => statusId === orderStatus.id)
    );
  }, [orderStatuses, statuses]);

  function handleFilterStatus(values: MultiValue<IOrderStatus>) {
    const { query } = router;

    if (isEmpty(values)) {
      const newQuery = {
        ...query,
      };
      delete newQuery?.statuses;
      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
      return;
    }

    const statuses = values.map((value) => value.id).join(',');

    const newQuery = {
      ...query,
    };
    newQuery.statuses = statuses;
    router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  }

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
        <Stack direction="horizontal" gap="5" align="start">
          <SearchFilter />
          <FilterStatusSelect
            options={orderStatuses}
            handleOnSelect={handleFilterStatus}
            initialValues={initialFilterStatuses as IOrderStatus[]}
            placeholder="Filter order by statuses"
          />
        </Stack>
        {isLoading ? (
          <TableContainer>
            <TableLoader />
          </TableContainer>
        ) : isEmpty(activeOrders) && !isLoading && isSuccess ? (
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
