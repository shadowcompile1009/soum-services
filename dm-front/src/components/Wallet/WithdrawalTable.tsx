import { useMemo } from 'react';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import isEmpty from 'lodash.isempty';
import { useRouter } from 'next/router';
import { MultiValue } from 'react-select';

import {
  Wallet,
  ERequestStatus,
  IWalletStatus,
  walletStatusValues,
} from '@/models/Wallet';
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

import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { SearchFilter } from '@/components/Shared/SearchFilter';
import { Pagination, usePagination } from '@/components/Pagination';
import { TableLoader } from '@/components/TableLoader';
import { WithdrawalAction } from '@/components/Settings/WithdrawalAction';
import { FilterStatusSelect } from '@/components/Shared/FilterStatusSelect';

import { useWalletTable } from './hooks/useWalletTable';
import { WalletStatus, EWalletStatus } from './WalletStatus';
import { TransactionStatus } from './TransactionStatus';

const columnHelper = createColumnHelper<Wallet>();

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: 'Wallet ID',
  }),
  columnHelper.accessor('requestDate', {
    cell: (info) => <TableDateView date={info.getValue()} />,
    header: 'Request Date',
  }),
  columnHelper.accessor('requestId', {
    cell: (info) => info.getValue(),
    header: 'Request ID',
  }),
  columnHelper.accessor('userName', {
    cell: (info) => info.getValue(),
    header: 'User Name',
  }),
  columnHelper.accessor('userPhone', {
    cell: (info) => info.getValue(),
    header: 'User Phone',
  }),
  columnHelper.accessor('status', {
    cell: (info) => <WalletStatus status={info.getValue() as EWalletStatus} />,
    header: 'Wallet Status',
  }),
  columnHelper.accessor('balance', {
    cell: (info) => `${info.getValue()} SR`,
    header: 'Wallet Balance',
  }),
  columnHelper.accessor('withdrawalAmount', {
    cell: (info) => `${info.getValue()} SR`,
    header: 'Withdraw Amount',
  }),
  columnHelper.accessor('requestStatus', {
    cell: (info) => (
      <TransactionStatus status={info.getValue() as ERequestStatus} />
    ),
    header: 'Request Status',
  }),
  columnHelper.display({
    id: 'actions',
    cell: (info) => (
      <WithdrawalAction
        walletID={info.row.original.requestId}
        modalName={'withdrawalRequest'}
      />
    ),
    header: 'Actions',
  }),
];

export function WithdrawalTable() {
  const { isLoading, data, isError, isSuccess } = useWalletTable();
  const { total, limit: apiLimit, offset, items } = data || {};

  const router = useRouter();
  const { query } = router;
  const { statuses = '' } = query;

  const walletStatuses: IWalletStatus[] = walletStatusValues;

  const mappedWallets = useMemo(() => Wallet.mapWallet(items), [items]);

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

  const initialFilterStatuses = useMemo(() => {
    const walletsId = String(statuses).split(',')!;

    return walletsId.map((walletId) =>
      walletStatuses.find((walletStatus) => walletId === walletStatus.id)
    );
  }, [walletStatuses, statuses]);

  function handleFilterStatus(values: MultiValue<IWalletStatus>) {
    const { query } = router;

    if (isEmpty(values)) {
      const newQuery = { ...query };
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

    const newQuery = { ...query };
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
        <Stack direction="horizontal" gap="5" align="start">
          <SearchFilter placeholder="Wallet ID or Phone Number" />

          <FilterStatusSelect
            options={walletStatuses}
            handleOnSelect={handleFilterStatus}
            initialValues={initialFilterStatuses as IWalletStatus[]}
            placeholder="Withdrawal Status"
          />
        </Stack>
        {isLoading ? (
          <TableContainer>
            <TableLoader />
          </TableContainer>
        ) : isEmpty(mappedWallets) && !isLoading && isSuccess ? (
          <Text color="static.gray" fontSize="smallText" fontWeight="regular">
            {' '}
            No wallets{' '}
          </Text>
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
