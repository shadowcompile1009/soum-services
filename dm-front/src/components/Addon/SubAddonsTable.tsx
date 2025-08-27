import { Text } from '@/components/Text';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { IAddon } from '@/models/Addon';
import { motion } from 'framer-motion';
import isEmpty from 'lodash.isempty';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import {
  OverflowWrapper,
  Table,
  TableContainer,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
} from '../Shared/TableComponents';
import { TableLoader } from '../TableLoader';
import { addOnsColumns } from './helpers/columns';
import { getSubAddonColumns } from './helpers/getAddonColumns';

interface AddonsTableProps {
  brandId?: string;
  data: any;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  refetch: () => void;
}

export const SubAddonsTable = (props: AddonsTableProps) => {
  const { data, isLoading, isSuccess, isError, refetch } = props;
  const { query } = useRouter();
  const { page = 1, size: limit = 10 } = query;
  const [addon, setAddon] = useState<IAddon>();

  const columns = useMemo(
    () =>
      getSubAddonColumns({
        columns: addOnsColumns,
        currentPage: Number(page),
        pageSize: Number(limit),
        queryKey: '',
      }),
    [page, limit]
  );

  const table = useReactTable({
    data: data?.deviceModels ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );
  }

  if (isEmpty(data?.deviceModels) && !isLoading && isSuccess) {
    return (
      <TableContainer>
        <Text color="static.gray" fontSize="smallText" fontWeight="regular">
          No Addons
        </Text>
      </TableContainer>
    );
  }

  if (isError) {
    return (
      <TableContainer>
        <Text color="static.gray" fontSize="smallText" fontWeight="regular">
          Something went wrong
        </Text>
      </TableContainer>
    );
  }

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
        {isEmpty(data?.deviceModels) && !isLoading && isSuccess ? (
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
    </>
  );
};
