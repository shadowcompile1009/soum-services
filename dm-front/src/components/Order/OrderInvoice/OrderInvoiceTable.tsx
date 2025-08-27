import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
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

import { Loader } from '@src/components/Loader';
import { TableLoader } from '@src/components/TableLoader';
import { Text } from '@src/components/Text';

import { useOrderInvoiceDetails } from './hooks/useOrderInvoiceDetails';
import { InvoiceDetails } from './types';
import { Action } from '@src/components/Shared/Action/Action';
import { ViewIcon } from '@src/components/Shared/Action/ViewIcon';
import { OrderInvoiceDownloadIcon } from '@src/components/Shared/OrderInvoiceDownloadIcon';

const columnHelper = createColumnHelper<InvoiceDetails>();

const capitalizeFirstLetter = (val: string) =>
  String(val).charAt(0).toUpperCase() + String(val).slice(1);

const columns = [
  columnHelper.accessor('referNo', {
    cell: (info) => {
      if (!info.getValue()) return null;

      return (
        <Text
          color="static.grays.600"
          fontSize="smallText"
          fontWeight="regular"
        >
          {info.getValue().split('/').pop()}
        </Text>
      );
    },
    header: 'Invoice Number',
  }),
  columnHelper.accessor('invoiceType', {
    cell: (info) => {
      if (!info.getValue()) return null;

      return (
        <Text
          color="static.grays.600"
          fontSize="smallText"
          fontWeight="regular"
        >
          {`${capitalizeFirstLetter(info.row.original.billType)} ${info
            .getValue()
            .split(' ')
            .map(capitalizeFirstLetter)
            .join(' ')}`}
        </Text>
      );
    },
    header: 'Invoice Type',
  }),
  columnHelper.accessor('createdAt', {
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
    header: 'Created At',
  }),
  columnHelper.accessor('eventName', {
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
    header: 'Event Trigger',
  }),
  ,
  columnHelper.display({
    cell: (info) => (
      <Action
        firstPathName={'/'}
        secondPathName={'/'}
        secondPathDownloadLink={info.row.original.url}
        firstIcon={<ViewIcon />}
        firstIconText="Preview"
        secondIcon={<OrderInvoiceDownloadIcon />}
        secondIconText="Download"
      />
    ),
    header: 'Action',
  }),
];

export function OrderInvoiceTable() {
  const {
    isLoading,
    data: invoiceDetailsData,
    isError,
    isSuccess,
  } = useOrderInvoiceDetails();

  const table = useReactTable({
    data: invoiceDetailsData?.data || [],
    columns: columns as ColumnDef<InvoiceDetails>[],
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  if ((isEmpty(invoiceDetailsData?.data) || isError) && !isLoading && isSuccess)
    return (
      <TableContainer>
        <Text
          color="static.grays.600"
          fontSize="smallText"
          fontWeight="regular"
        >
          No invoices
        </Text>
      </TableContainer>
    );

  if (isError)
    return (
      <TableContainer>
        <Text color="static.red" fontSize="smallText" fontWeight="regular">
          There was an error fetching the invoices
        </Text>
      </TableContainer>
    );

  return (
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
  );
}
