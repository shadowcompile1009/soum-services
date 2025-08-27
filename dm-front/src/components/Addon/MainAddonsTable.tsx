import React, { useMemo, useState } from 'react';

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
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { IAddon } from '@/models/Addon';

import { getMainAddonColumns } from './helpers/getAddonColumns';
import { addOnsColumns } from './helpers/columns';

interface MainAddonsTableProps {
  mainAddons: any;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  refetch: () => void;
}

export function MainAddonsTable(props: MainAddonsTableProps) {
  const { mainAddons, isLoading, isSuccess, isError, refetch } = props;
  const router = useRouter();
  const { offset = 0, limit = 15 } = router.query;
  const [addon, setAddon] = useState<IAddon>();

  const pagination = usePagination({
    limit: String(limit),
    offset: String(offset),
    total: mainAddons?.total!,
  });

  const columns = useMemo(
    () =>
      getMainAddonColumns({
        columns: addOnsColumns,
        offset: Number(offset),
        limit: Number(limit),
        queryKey: [
          QUERY_KEYS.addOns,
          String(limit),
          String(offset),
          String(mainAddons?.total),
        ],
      }),
    [mainAddons]
  );

  const table = useReactTable({
    data: mainAddons?.deviceModels ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  if (isEmpty(mainAddons?.deviceModels) && !isLoading && isSuccess)
    return (
      <>
        <TableContainer>
          <Text color="static.gray" fontSize="smallText" fontWeight="regular">
            No Addons
          </Text>
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

  if (isError)
    return (
      <TableContainer>
        <Text color="static.red" fontSize="smallText" fontWeight="regular">
          Something went wrong
        </Text>
      </TableContainer>
    );

  const handleRowClick = (row: any) => {
    setAddon(row.original);
  };

  return (
    <>
      <TableContainer
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isEmpty(mainAddons?.deviceModels) && !isLoading && isSuccess ? (
          <Text color="static.gray" fontSize="smallText" fontWeight="regular">
            No device models
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
                  <tr key={row.id} onClick={() => handleRowClick(row)}>
                    {row.getVisibleCells().map((cell) => (
                      <TBodyCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, {
                          ...cell.getContext(),
                          data: addon,
                          refetch: refetch,
                        })}
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
