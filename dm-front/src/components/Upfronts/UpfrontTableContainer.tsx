import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useUpfrontTable } from '@/components/Shared/hooks';
import { usePagination } from '@/components/Pagination';
import { ConsignmentStatus } from '@/models/Upfronts';
import { getUpfrontColumns } from './helpers/getUpfrontColumns';
import { newUpfrontColumn } from './helpers/columns';
import { UpfrontTable } from './UpfrontTable';

interface UpfrontTableContainerProps {
  subModule: ConsignmentStatus;
  keyQuary: string;
  isPayoutToSellerPage?: boolean;
}

export function UpfrontTableContainer({
  subModule,
  keyQuary,
  isPayoutToSellerPage,
}: UpfrontTableContainerProps) {
  const router = useRouter();
  const { query } = router;
  const { search = '' } = query;

  const {
    isLoading,
    isSuccess,
    upfrontList,
    total,
    isError,
    limit: apiLimit,
    offset,
    refetchUpfronts,
  } = useUpfrontTable({ submodule: subModule });

  const pagination = usePagination({
    limit: String(apiLimit),
    offset: String(offset),
    total,
  });

  const columns = useMemo(
    () =>
      getUpfrontColumns({
        columns: newUpfrontColumn,
        queryKey: [
          keyQuary,
          String(apiLimit),
          String(offset),
          String(search),
          subModule,
        ],
        refetchUpfronts,
        isPayoutToSellerPage,
      }),
    [keyQuary, apiLimit, offset, search, subModule, isPayoutToSellerPage]
  );

  return (
    <UpfrontTable
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
      upfrontList={upfrontList}
      columns={columns}
      pagination={{
        limit: Number(pagination.limit),
        offset: Number(pagination.offset),
        total: pagination.total,
        currentItemsCount: pagination.currentItemsCount,
        currentPage: pagination.currentPage,
        items: pagination.items,
      }}
    />
  );
}
