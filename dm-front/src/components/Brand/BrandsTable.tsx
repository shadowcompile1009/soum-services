import { Text } from '@/components/Text';
import { CategoriesValues } from '@/models/Category';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import isEmpty from 'lodash.isempty';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { AdminPagination, useAdminPagination } from '../Pagination';
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
import { brandColumns } from './helpers/columns';
import getBrandColumns from './helpers/getBrandColumns';
import { useBrands } from './hooks/useBrands';

interface BrandsTableProps {
  categoryType: CategoriesValues;
  categoryId?: string;
}

const BrandsTable = (props: BrandsTableProps) => {
  const { categoryType, categoryId } = props;
  const { query } = useRouter();
  const { page = 1, size: pageSize = 20 } = query;
  const { data, isLoading, isSuccess, isError } = useBrands(categoryId);

  const paginationData = useAdminPagination({
    totalResult: data?.total ?? 0,
    pageSize: Number(pageSize),
    currentPage: Number(page),
  });

  const columns = useMemo(
    () =>
      getBrandColumns({
        columns: brandColumns,
        currentPage: Number(page),
        pageSize: Number(pageSize),
        categoryType,
        categoryId: String(categoryId),
        queryKey: '',
      }),
    [page, pageSize]
  );

  const table = useReactTable({
    data: data?.brands ?? [],
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

  if (isEmpty(data?.brands) && !isLoading && isSuccess) {
    return (
      <TableContainer>
        <Text color="static.gray" fontSize="smallText" fontWeight="regular">
          No categories
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

  return (
    <>
      <TableContainer
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isEmpty(data?.brands) && !isLoading && isSuccess ? (
          <Text color="static.gray" fontSize="smallText" fontWeight="regular">
            No brands
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
      <AdminPagination {...paginationData} />
    </>
  );
};

export default BrandsTable;
