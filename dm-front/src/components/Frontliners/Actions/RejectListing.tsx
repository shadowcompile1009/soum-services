import { useState } from 'react';

import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { Stack } from '@/components/Layouts';
import { Loader } from '@/components/Loader';
import { useAwaitableComponent } from '@/components/Shared/hooks';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { toast } from '@/components/Toast';

import { ActionProps } from './Actions';
import { DeleteRejectReasonSelect, InvalidReason } from './ReasonSelect';

import { useRejectListingMutation } from '../hooks';
import { Button } from '@/components/Button';

export function RejectListing(props: ActionProps) {
  const { listing, queryKey } = props;

  const [selectedReason, setSelectedReason] = useState<InvalidReason>();

  const mutation = useRejectListingMutation(queryKey);

  const [status, execute, resolve, reject, resetStatus] =
    useAwaitableComponent();

  async function handleRejectListing() {
    await execute()
      .then((reason) => {
        if (!reason) {
          toast.error(toast.getMessage('onEmptyDeleteRejectReason'));
          return;
        }

        mutation.mutate({ listing, reason: (reason as InvalidReason).value });
      })
      .catch(() => resetStatus());
  }

  function handleReasonSelect(reason: InvalidReason) {
    setSelectedReason(reason);
  }

  const isConfirmDialogVisible = status === 'awaiting';

  return (
    <>
      {mutation.isLoading ? (
        <Stack justify="center">
          <Loader size="12px" border="static.blue" />
        </Stack>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleRejectListing}
          cssProps={{
            border: '1px solid',
            borderColor: 'static.red',
            color: 'static.red',
            paddingX: 2,
            paddingY: 1,
          }}
        >
          Reject
        </Button>
      )}
      <ConfirmationDialog
        top={180}
        isOpen={isConfirmDialogVisible}
        onConfirm={() => resolve(selectedReason)}
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
            Reject listing
          </Text>
        </Box>
        <Text fontSize="baseText" fontWeight="regular" color="static.black">
          Are you sure you want to reject this listing?
        </Text>
        {/* @ts-ignore */}
        <DeleteRejectReasonSelect onChange={handleReasonSelect} />
      </ConfirmationDialog>
    </>
  );
}
