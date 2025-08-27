import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import isEmpty from 'lodash.isempty';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';

import { Text } from '@/components/Text';
import { Pagination, usePagination } from '@/components/Pagination';
import { TableLoader } from '@/components/TableLoader';
import { Stack } from '@/components/Layouts';
import { Button } from '@/components/Button';
import { toast } from '@/components/Toast';

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
import { EOrderModules, IOrderStatus, Order } from '@/models/Order';
import { getOrderColumns } from '@/components/Order/helpers/getOrdersColumns';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { BnplOrderColumn } from './helpers/columns';
import { SearchFilter } from '../Shared/SearchFilter';
import { FilterStatusSelect } from '@/components/Shared/FilterStatusSelect';
import { MultiValue } from 'react-select';

export function BnplOrderTable() {
  const router = useRouter();
  const { query } = router;
  const { search = '', capturestatus = '' } = query;
  const {
    isLoading,
    isSuccess,
    isError,
    orders: bnplOrders,
    total,
    limit: apiLimit,
    offset,
  } = useOrdersTable({ submodule: EOrderModules.BNPL });

  const pagination = usePagination({ limit: String(apiLimit), offset, total });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const captureStatusValues: IOrderStatus[] = [
    { displayName: 'Captured', id: 'captured', name: 'captured' },
    { displayName: 'Not Captured', id: 'not-captured', name: 'not-captured' },
  ];

  const [captureAllTitle, setCaptureAllTitle] = useState('Capture All');
  const [captureAllDisabled, setCaptureAllDisabled] = useState(false);

  const columns = useMemo(
    () =>
      getOrderColumns({
        columns: BnplOrderColumn,
        queryKey: [
          QUERY_KEYS.bnplOrders,
          String(apiLimit),
          String(offset),
          String(search),
        ],
      }),
    // need bnpl orders deps, otherwise react-table doesnt know, if we have new data
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bnplOrders]
  );

  const initialFilterStatuses = useMemo(() => {
    const statusesId = String(capturestatus).split(',')!;

    return statusesId.map((statusId) =>
      captureStatusValues.find((orderStatus) => statusId === orderStatus.id)
    );
  }, [captureStatusValues, capturestatus]);

  const table = useReactTable({
    data: bnplOrders!,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const captureAllMutation = useMutation(
    (orders: Order[] | undefined) => {
      // array of strings for capture all
      let payload = [];
      if (orders) {
        for (const iterator of orders) {
          if (iterator.captureOrder.captureStatus === 'Not Captured') {
            payload.push(iterator.id);
          }
        }
      }
      return Order.captureAllTransaction(payload);
    },
    {
      onSuccess: () => {
        setCaptureAllTitle('Capture All');
        setCaptureAllDisabled(false);
        toast.success(toast.getMessage('onCreateCaptureTransactionSuccess'));
        window.location.reload();
      },
      onError: (error: any) => {
        setCaptureAllTitle('Capture All');
        setCaptureAllDisabled(false);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(toast.getMessage('onCreateCaptureTransactionError'));
        }
      },
    }
  );

  function captureAllOrders() {
    setCaptureAllTitle('Capturing');
    setCaptureAllDisabled(true);
    captureAllMutation.mutate(bnplOrders);
  }

  function handleFilterStatus(values: MultiValue<IOrderStatus>) {
    const { query } = router;

    if (isEmpty(values)) {
      const newQuery = { ...query };
      delete newQuery?.capturestatus;
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

    const capturestatus = values.map((value) => value.id).join(',');
    const newQuery = { ...query };
    newQuery.capturestatus = capturestatus;
    router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  }

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
        <Stack
          direction="horizontal"
          gap="5"
          justify="start"
          align="start"
          style={{ marginBottom: 20 }}
        >
          <SearchFilter />
          <FilterStatusSelect
            options={captureStatusValues}
            handleOnSelect={handleFilterStatus}
            initialValues={initialFilterStatuses as IOrderStatus[]}
            placeholder="Filter order by statuses"
          />
          <Button
            disabled={captureAllDisabled}
            variant="filled"
            style={{ marginLeft: 20, height: 44 }}
            onClick={captureAllOrders}
          >
            {captureAllTitle}
          </Button>
        </Stack>
        {isLoading ? (
          <TableContainer>
            <TableLoader />
          </TableContainer>
        ) : isEmpty(bnplOrders) && !isLoading && isSuccess ? (
          <Text fontSize="smallText" color="static.gray" fontWeight="regular">
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
