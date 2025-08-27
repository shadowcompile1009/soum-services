import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { useMutation } from '@tanstack/react-query';

import { Wallet } from '@/models/Wallet';
import { Box } from '@/components/Box';
import { toast } from '@/components/Toast';
import { Text } from '@/components/Text';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { useAwaitableComponent } from '@/components/Shared/hooks/useAwaitableComponent';
import { DeleteIcon } from '@/components/Shared/DeleteIcon';

const DeleteTransactionActionLink = styled.span(() =>
  css({
    color: 'static.grays.10',
    cursor: 'pointer',
    '&:hover': {
      color: 'static.blue',
    },
  })
);

interface DeleteTransactionActionProps {
  walletId: string;
}

export function DeleteTransactionAction(props: DeleteTransactionActionProps) {
  const { walletId } = props;
  const [status, execute, resolve, reject, resetStatus] =
    useAwaitableComponent();

  const isConfirmDialogVisible = status === 'awaiting';

  const deleteMutation = useMutation(
    ({ walletId }: { walletId: string }): Promise<void> => {
      return Wallet.deleteWalletTransaction(walletId);
    },
    {
      onSuccess() {
        // success goes here
      },
      onError(error: any) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          //error goes here
        }
      },
    }
  );

  async function handleOnDelete(e: React.SyntheticEvent) {
    e.preventDefault();
    try {
      await execute().then(() => {
        deleteMutation.mutate({ walletId });
      });
    } catch (err) {
      resetStatus();
    }
  }

  return (
    <>
      <DeleteTransactionActionLink onClick={handleOnDelete}>
        <DeleteIcon />
      </DeleteTransactionActionLink>

      <ConfirmationDialog
        top={180}
        isOpen={isConfirmDialogVisible}
        onConfirm={resolve}
        onCancel={reject}
      >
        <Box
          cssProps={{
            borderBottom: '1px solid',
            borderColor: 'static.grays.50',
            paddingBottom: 5,
          }}
        >
          <Text fontSize="baseText" fontWeight="regular" color="static.black">
            {/* Are you sure you want to delete the user {username}? */}
          </Text>
        </Box>
      </ConfirmationDialog>
    </>
  );
}
