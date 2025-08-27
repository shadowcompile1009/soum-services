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

interface OrderInvoiceTableBodyProps {
  table: any;
}

export function OrderInvoiceTableBody(props: OrderInvoiceTableBodyProps) {
  const { table } = props;

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
