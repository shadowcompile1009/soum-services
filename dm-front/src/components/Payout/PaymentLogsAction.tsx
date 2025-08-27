import React, { useState } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { EyeIcon } from '@/components/Shared/EyeIcon';
import { PaymentLogs } from '@/models/PaymentLogs';
import { PaymentLogsModal } from './PaymentLogsModal';

const PaymentLogsActionLink = styled.div(() =>
  css({
    color: 'static.grays.10',
    cursor: 'pointer',
    '&:hover': {
      color: 'static.blue',
    },
  })
);

interface PaymentLogsActionProps {
  modalName?: string;
  rowData: PaymentLogs;
}

export function PaymentLogsAction(props: PaymentLogsActionProps) {
  const { rowData } = props;

  const [currentRowData, setCurrentRowData] = useState<PaymentLogs | undefined>(
    undefined
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setCurrentRowData(rowData);
    setIsModalOpen(true);
  };
  return (
    <>
      <PaymentLogsActionLink onClick={handleClick}>
        <EyeIcon />
      </PaymentLogsActionLink>
      {isModalOpen && (
        <PaymentLogsModal
          rowData={currentRowData}
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />
      )}
    </>
  );
}
