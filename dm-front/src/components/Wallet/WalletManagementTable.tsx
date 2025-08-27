import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import isEmpty from 'lodash.isempty';

import { Wallet } from '@/models/Wallet';
import {
  TableContainer,
  Table,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
  OverflowWrapper,
} from '@/components/Shared/TableComponents';
import { Text } from '@/components/Text';
import { Pagination, usePagination } from '@/components/Pagination';
import { TableLoader } from '@/components/TableLoader';
import { WalletListAction } from '@/components/Settings/WalletListAction';

import { useWalletManagementTable } from './hooks/useWalletManagementTable';
import { WalletStatus, EWalletStatus } from './WalletStatus';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor('walletId', {
    cell: (info) => info.getValue(),
    header: 'Wallet ID',
  }),
  columnHelper.accessor('phoneNumber', {
    cell: (info) => info.getValue(),
    header: 'User Phone',
  }),
  columnHelper.accessor('userName', {
    cell: (info) => info.getValue(),
    header: 'User Name',
  }),
  columnHelper.accessor('balance', {
    cell: (info) => `${info.getValue()} SR`,
    header: 'Wallet Balance',
  }),
  columnHelper.accessor('status', {
    cell: (info) => <WalletStatus status={info.getValue() as EWalletStatus} />,
    header: 'Wallet Status',
  }),
  columnHelper.display({
    id: 'actions',
    cell: (info) => (
      <WalletListAction
        walletId={info.row.original.id}
        modalName={'walletDetails'}
      />
    ),
    header: 'Actions',
  }),
];

export function WalletManagementTable() {
  const { isLoading, data, isError, isSuccess } = useWalletManagementTable();

  const { total, limit: apiLimit, offset, items } = data || {};

  const mappedWallets = useMemo(() => Wallet.mapWalletList(items), [items]);

  const table = useReactTable({
    data: mappedWallets!,
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

  if (isEmpty(data) && !isLoading && isSuccess)
    return (
      <TableContainer>
        <Text color="static.gray" fontSize="smallText" fontWeight="regular">
          No wallets
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
