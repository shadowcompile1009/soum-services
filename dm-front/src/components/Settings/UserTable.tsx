import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Stack } from '@/components/Layouts';
import { motion } from 'framer-motion';
import isEmpty from 'lodash.isempty';

import {
  TableContainer,
  Table,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
  OverflowWrapper,
} from '@/components/Shared/TableComponents';

import { DeleteUserAction } from '@/components/Settings/DeleteUserAction';
import { EditUserAction } from '@/components/Settings/EditUserAction';
import { User } from '@/models/User';
import { Loader } from '@/components/Loader';
import { Pagination, usePagination } from '@/components/Pagination';
import { TableLoader } from '@/components/TableLoader';
import { Text } from '@/components/Text';

import { useUserTable } from './hooks/useUserTable';

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: 'ID',
  }),
  columnHelper.accessor('role', {
    cell: (info) => info.getValue(),
    header: 'User Role',
  }),
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
    header: 'User Name',
  }),
  columnHelper.accessor('email', {
    cell: (info) => info.getValue(),
    header: 'Email',
  }),
  columnHelper.accessor('phoneNumber', {
    cell: (info) => info.getValue(),
    header: 'Phone Number',
  }),
  columnHelper.display({
    id: 'actions',
    cell: (info) => (
      <Stack
        direction="horizontal"
        justify="space-evenly"
        style={{ marginBottom: 20 }}
      >
        <DeleteUserAction
          userId={info.row.original.id}
          username={info.row.original.name}
        />

        <EditUserAction
          userId={info.row?.original?.id}
          role={info?.row?.original.role}
          username={info.row?.original?.name}
          phoneNumber={info.row?.original?.phoneNumber}
          email={info.row?.original?.email}
          modalName={'editUser'}
        />
      </Stack>
    ),
    header: 'Actions',
  }),
];

export function UserTable() {
  const { isLoading, data, isError, isSuccess } = useUserTable();

  const { total, limit: apiLimit, offset } = data || {};
  const mappedUsers = useMemo(() => User.mapUsers(data?.data), [data]);

  const table = useReactTable({
    data: mappedUsers,
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
          No users
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
