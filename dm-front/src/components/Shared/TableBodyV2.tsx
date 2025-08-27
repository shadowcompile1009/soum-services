import { ReactNode } from 'react';

import { flexRender } from '@tanstack/react-table';
import { motion } from 'framer-motion';

import {
  TableContainer,
  Table,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
  OverflowWrapper,
} from '@src/components/Shared/TableComponents';
import { Text } from '@src/components/Text';

import { Stack } from '../Layouts/Stack';

interface TableBodyV2Props {
  table: any;
  title: string;
  icon: ReactNode;
}

export function TableBodyV2(props: TableBodyV2Props) {
  const { table, title, icon } = props;

  return (
    <>
      <TableContainer
        as={motion.div}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack direction="horizontal" gap="2" marginBottom="1.375rem">
          {icon}
          <Text
            fontWeight="bigSubtitle"
            fontSize="bigSubtitle"
            color="static.black"
          >
            {title}
          </Text>
        </Stack>
        <OverflowWrapper>
          <Table>
            <THead>
              {table.getHeaderGroups().map((headerGroup: any) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header: any) => (
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
              {table.getRowModel().rows.map((row: any) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell: any) => (
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
    </>
  );
}
