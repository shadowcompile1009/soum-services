import React, { useMemo } from 'react';

import { useRouter } from 'next/router';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import isEmpty from 'lodash.isempty';
import { format } from 'date-fns';

import {
  TableContainer,
  Table,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
  OverflowWrapper,
} from '@src/components/Shared/TableComponents';

import { UserApp } from '@src/models/UserApp';
import { Loader } from '@src/components/Loader';
import { TableLoader } from '@src/components/TableLoader';
import { Text } from '@src/components/Text';

import { UserAppSwitch } from '../../UserAppSwitch/UserAppSwitch';
import { EditUserAppAction } from './EditUserAppAction';
import { UsersAppPagination } from './UsersAppPagination';
import { useUsersApp } from './hooks/useUsersApp';

const columnHelper = createColumnHelper<UserApp>();

const columns = [
  columnHelper.accessor('index', {
    cell: (info) => {
      if (!info.getValue()) return null;

      return (
        <Text
          color="static.grays.600"
          fontSize="smallText"
          fontWeight="regular"
        >
          {info.getValue()}
        </Text>
      );
    },
    header: 'No.',
  }),
  columnHelper.accessor('name', {
    cell: (info) => {
      if (!info.getValue()) return null;

      return (
        <Text
          color="static.grays.600"
          fontSize="smallText"
          fontWeight="regular"
        >
          {info.getValue()}
        </Text>
      );
    },
    header: 'Name',
  }),
  columnHelper.accessor('status', {
    cell: (info) => {
      if (!info.getValue()) return null;

      return (
        <Text
          color="static.grays.600"
          fontSize="smallText"
          fontWeight="headingZero"
        >
          {info.getValue()}
        </Text>
      );
    },
    header: 'Status',
  }),
  columnHelper.accessor('phoneNumber', {
    cell: (info) => {
      if (!info.getValue()) return null;

      return (
        <Text
          color="static.grays.600"
          fontSize="smallText"
          fontWeight="regular"
        >
          {info.getValue()}
        </Text>
      );
    },
    header: 'Phone No.',
  }),
  columnHelper.accessor('lastLoginDate', {
    cell: (info) => {
      if (!info.getValue()) return null;

      const date = new Date(info.getValue());

      return (
        <Text
          color="static.grays.600"
          fontSize="smallText"
          fontWeight="regular"
        >
          {format(date, 'MMM d, yyyy, h:mm:ss a')}
        </Text>
      );
    },
    header: 'Last Login',
  }),
  columnHelper.accessor('updatedDate', {
    cell: (info) => {
      if (!info.getValue()) return null;

      const date = new Date(info.getValue());

      return (
        <Text
          color="static.grays.600"
          fontSize="smallText"
          fontWeight="regular"
        >
          {format(date, 'MMM d, yyyy, h:mm:ss a')}
        </Text>
      );
    },
    header: 'Updated At',
  }),
  columnHelper.accessor('status', {
    cell: (info) => {
      if (!info.row.original.id || !info.getValue()) return null;

      return (
        <UserAppSwitch userId={info.row.original.id} status={info.getValue()} />
      );
    },
    header: 'Active / Inactive',
  }),
  columnHelper.display({
    cell: (info) => <EditUserAppAction userId={info.row.original.id} />,
    header: 'Action',
  }),
];

export function UsersAppTable() {
  const router = useRouter();
  const { page = '1', limit = '20' } = router.query;
  const currentPage = parseInt(page as string, 10);
  const itemsPerPage = parseInt(limit as string, 10);

  const { isLoading, data, isError, error, isSuccess } = useUsersApp();

  const { totalResult: total } = data?.result || {};

  const mappedUsers = useMemo(
    () => UserApp.mapUsers(data?.result?.data, data?.page),
    [data]
  );

  const table = useReactTable({
    data: mappedUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil(total / itemsPerPage);

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  if ((isEmpty(data?.result?.data) || isError) && !isLoading && isSuccess)
    return (
      <TableContainer>
        <Text
          color="static.grays.600"
          fontSize="smallText"
          fontWeight="regular"
        >
          No users
        </Text>
      </TableContainer>
    );

  if (isError)
    return (
      <TableContainer>
        <Text color="static.red" fontSize="smallText" fontWeight="regular">
          {error?.response?.data?.message}
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
                    {headerGroup.headers.map((header, index) => {
                      if (header.isPlaceholder) {
                        return (
                          <THeadCell
                            key={header.id + ' ' + index}
                            colSpan={header.colSpan}
                          />
                        );
                      }

                      return (
                        <THeadCell
                          key={header.id + ' ' + index}
                          colSpan={header.colSpan}
                        >
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
                    {row.getVisibleCells().map((cell, index) => (
                      <TBodyCell key={cell.id + ' ' + index}>
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
      <UsersAppPagination
        limit={String(itemsPerPage)}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        currentItemsCount={mappedUsers.length}
      />
    </>
  );
}
