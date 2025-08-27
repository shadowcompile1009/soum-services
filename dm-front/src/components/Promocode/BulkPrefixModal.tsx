import React, { useState } from 'react';
import { CommonModal } from '../Modal';
import { Stack } from '../Layouts';
import { Promocode } from '@/models/Promocode';
import { Text } from '../Text';
import { CloseIcon } from '../Shared/CloseIcon';
import { PromoCodeTable } from './PromoCodeTable';
import { CustomPagination } from '../Pagination/CustomPagination';
import { usePromocodeListTable } from './hooks/usePromocodeListTable';
import { useCustomPagination } from '../Pagination/hooks/useAdminPagination';

interface BulkPrefixModalProps {
  isOpen: boolean;
  onClose: () => void;
  promocode: Promocode | null;
}

const BulkPrefixModal = ({
  isOpen,
  onClose,
  promocode,
}: BulkPrefixModalProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = usePromocodeListTable({
    id: promocode?.id,
    page: currentPage,
  });
  const { total, limit: size } = data || {};

  const handleClose = () => {
    setCurrentPage(1);
    onClose();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginationData = useCustomPagination({
    totalResult: total ?? 0,
    pageSize: Number(size),
    currentPage: Number(currentPage),
  });

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleClose}
      width={'90%'}
      height={'60%'}
    >
      <Stack direction="vertical">
        <Stack direction="horizontal" justify="space-between">
          <Text color="static.black" fontSize="regular" fontWeight="semibold">
            Preview
          </Text>
          <button
            onClick={handleClose}
            style={{
              border: 'none',
              margin: '0',
              padding: '0',
              outline: 'none',
            }}
          >
            <CloseIcon />
          </button>
        </Stack>
        <hr style={{ marginBlockEnd: 22, color: 'static.gray' }} />

        <PromoCodeTable id={promocode?.id} currentPage={currentPage} />

        <div style={{ marginBlockStart: 22 }}>
          <CustomPagination
            {...paginationData}
            onPageChange={handlePageChange}
          />
        </div>
      </Stack>
    </CommonModal>
  );
};

export default BulkPrefixModal;
