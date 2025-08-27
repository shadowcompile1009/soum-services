import { useMemo } from 'react';
import isEmpty from 'lodash.isempty';
import { motion } from 'framer-motion';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';
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

import { useListingDetails } from './hooks';
import { columns as column, getListingDetailColumns } from './helpers';

export function ProductDetailTable() {
  const { data, isLoading, isError, isSuccess } = useListingDetails();

  const columns = useMemo(
    () =>
      getListingDetailColumns({
        columns: column,
      }),
    []
  );

  const table = useReactTable({
    data: [data!],
    columns,
    getCoreRowModel: getCoreRowModel(),
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
          No product detail found
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
    <Box cssProps={{ overflow: 'auto', flex: '1', display: 'flex' }}>
      <Stack direction="vertical" gap="15" flex="1" justify="space-between">
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
        </TableContainer>
        <Text color="static.black" fontSize="baseText" fontWeight="baseText">
          * Description: {data.description}
        </Text>
      </Stack>
    </Box>
  );
}
