import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { User } from '@/models/User';
import { Box } from '@/components/Box';
import { toast } from '@/components/Toast';
import { Text } from '@/components/Text';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { useAwaitableComponent } from '@/components/Shared/hooks/useAwaitableComponent';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { DeleteIcon } from '@/components/Shared/DeleteIcon';

const DeleteUserActionLink = styled.span(() =>
  css({
    color: 'static.grays.10',
    cursor: 'pointer',
    '&:hover': {
      color: 'static.blue',
    },
  })
);

interface DeleteUserActionProps {
  userId: string;
  username: string;
}

export function DeleteUserAction(props: DeleteUserActionProps) {
  const { userId, username } = props;
  const [status, execute, resolve, reject, resetStatus] =
    useAwaitableComponent();

  const queryClient = useQueryClient();

  const isConfirmDialogVisible = status === 'awaiting';

  const deleteMutation = useMutation(
    ({ userId }: { userId: string }): Promise<void> => {
      return User.deleteUser(userId);
    },
    {
      onSuccess() {
        toast.success(toast.getMessage('onDeleteUser', username));
        queryClient.invalidateQueries([QUERY_KEYS.users]);
      },
      onError(error: any) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(toast.getMessage('onDeleteUserError', username));
        }
      },
    }
  );

  async function handleOnDelete(e: React.SyntheticEvent) {
    e.preventDefault();
    try {
      await execute().then(() => {
        deleteMutation.mutate({ userId });
      });
    } catch (err) {
      resetStatus();
    }
  }

  return (
    <>
      <DeleteUserActionLink onClick={handleOnDelete}>
        <DeleteIcon />
      </DeleteUserActionLink>

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
            Are you sure you want to delete the user {username}?
          </Text>
        </Box>
      </ConfirmationDialog>
    </>
  );
}
