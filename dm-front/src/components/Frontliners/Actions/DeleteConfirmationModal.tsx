import { useState } from 'react';

import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';

import { DeleteRejectReasonSelect, InvalidReason } from './ReasonSelect';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  resolve: (val: unknown) => void;
  reject: (err: any) => void;
}

export function DeleteConfirmationModal(props: DeleteConfirmationModalProps) {
  const { isOpen, reject, resolve } = props;

  const [selectedReason, setSelectedReason] = useState<InvalidReason>();

  function handleReasonSelect(reason: InvalidReason) {
    setSelectedReason(reason);
  }

  function handleOnConfirm(reason?: InvalidReason) {
    resolve(reason);
    setSelectedReason(undefined);
  }

  return (
    <ConfirmationDialog
      top={180}
      isOpen={isOpen}
      onConfirm={() => handleOnConfirm(selectedReason)}
      onCancel={reject}
    >
      <Box
        cssProps={{
          borderBottom: '1px solid',
          borderColor: 'static.grays.50',
          paddingBottom: 5,
        }}
      >
        <Text fontSize="bigText" fontWeight="regular" color="static.black">
          Delete listing
        </Text>
      </Box>
      <Text fontSize="baseText" fontWeight="regular" color="static.black">
        Are you sure you want to delete this listing?
      </Text>
      {/* @ts-ignore */}
      <DeleteRejectReasonSelect onChange={handleReasonSelect} />
    </ConfirmationDialog>
  );
}
