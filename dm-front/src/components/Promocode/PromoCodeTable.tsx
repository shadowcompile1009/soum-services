import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Button } from '@/components/Button';
import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import {
  TableContainer,
  Table,
  TBody,
  TBodyCell,
  THead,
  THeadCell,
  OverflowWrapper,
} from '@/components/Shared/TableComponents';

import { AddPromoCodeModal } from './AddPromoCodeModal';
import { usePromocodeListTable } from './hooks/usePromocodeListTable';
import { AdminPagination, useAdminPagination } from '../Pagination';
import { getPromocodeColumns } from './helpers/getPromocodeColumns';
import { Column, promocodeColumns } from './helpers/columns';
import { SearchFilter } from '../Shared/SearchFilter';
import { TableLoader } from '../TableLoader';
import { Promocode } from '@/models/Promocode';
import BulkPrefixModal from './BulkPrefixModal';

export function PromoCodeTable({
  id = '',
  currentPage: modalPage,
}: {
  id?: string | null;
  currentPage?: number;
}) {
  const { data, isLoading, isSuccess, isError } = usePromocodeListTable({
    id,
    page: modalPage,
  });
  const { total, limit: apiLimit, items } = data || {};
  const router = useRouter();
  const { page = '1' } = router.query;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedPromocode, setSelectedPromocode] = useState<Promocode | null>(
    null
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPromocode(null);
  };

  const handleAddNew = () => {
    setSelectedPromocode(null);
    setIsModalOpen(true);
  };

  const handleCloseBulkModal = () => {
    setIsBulkModalOpen(false);
    setSelectedPromocode(null);
  };

  const currentPage = modalPage || parseInt(String(page), 10);
  const pageSize = parseInt(String(apiLimit), 10) || 100;

  const paginationData = useAdminPagination({
    totalResult: total ?? 0,
    pageSize: pageSize,
    currentPage: currentPage,
  });

  const columns = useMemo(
    () =>
      getPromocodeColumns({
        columns: promocodeColumns as Column[],
        currentPage,
        pageSize,
        queryKey: QUERY_KEYS.promocodeList,
        isModalOpen,
        setIsModalOpen,
        setSelectedPromocode,
        setIsBulkModalOpen,
        isBulkModalOpen,
      }),
    [currentPage, pageSize]
  );

  const table = useReactTable({
    data: items || [],
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
          No promocodes
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
      {!id && (
        <>
          {' '}
          <Stack
            direction="horizontal"
            justify="space-between"
            style={{ marginBottom: 20 }}
          >
            <Text
              color="static.black"
              fontSize="headingThree"
              fontWeight="semibold"
            >
              Promo Code
            </Text>
            <Button variant="filled" onClick={handleAddNew}>
              Add Promo Code
            </Button>
          </Stack>
          <Box marginBottom={4}>
            <SearchFilter placeholder="Search by promo code" />
          </Box>{' '}
        </>
      )}

      <TableContainer
        as={motion.div}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <OverflowWrapper>
          <Table>
            <THead>
              {table?.getHeaderGroups()?.map((headerGroup) => (
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
              {table?.getRowModel()?.rows?.map((row) => (
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

      {!id && <AdminPagination {...paginationData} />}

      <AddPromoCodeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        promocode={selectedPromocode}
      />
      <BulkPrefixModal
        isOpen={isBulkModalOpen}
        onClose={handleCloseBulkModal}
        promocode={selectedPromocode}
      />
    </>
  );
}
