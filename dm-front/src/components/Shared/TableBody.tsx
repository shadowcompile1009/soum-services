import { flexRender } from '@tanstack/react-table';
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

interface TableBodyProps {
  table: any;
  title: string;
}

export function TableBody(props: TableBodyProps) {
  const { table, title } = props;

  return (
    <>
      <Text color="static.black" fontSize="bigText" fontWeight="regular">
        <Text
          as="span"
          fontSize="baseText"
          fontWeight="semibold"
          color="static.blues.400"
        >
          {title}
        </Text>
      </Text>
      <TableContainer>
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
