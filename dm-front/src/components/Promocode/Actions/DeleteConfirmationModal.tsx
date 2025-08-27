import { Text } from '@/components/Text';

import { Box } from '@/components/Box';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  resolve: () => void;
  reject: (err: any) => void;
}

export function DeleteConfirmationModal(props: DeleteConfirmationModalProps) {
  const { isOpen, reject, resolve } = props;

  function handleOnConfirm() {
    resolve();
  }

  return (
    <ConfirmationDialog
      width={656}
      isOpen={isOpen}
      onConfirm={() => handleOnConfirm()}
      onCancel={reject}
      confirmText="Delete"
      cancelText="Ignore"
      confirmButtonVariant={'red_filled'}
      cancelButtonVariant={'bordered'}
    >
      <Box
        cssProps={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <Text fontSize="bigText" fontWeight="semibold" color="static.black">
          Delete promo code?
        </Text>
        <Text fontSize="baseText" fontWeight="regular" color="static.grays.600">
          Are you sure you want to delete the promo code? This will delete from
          admin and app
        </Text>
      </Box>
    </ConfirmationDialog>
  );
}
