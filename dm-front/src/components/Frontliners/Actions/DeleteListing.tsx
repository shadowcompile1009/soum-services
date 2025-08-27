import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { Stack } from '@/components/Layouts';
import { Loader } from '@/components/Loader';
import { useAwaitableComponent } from '@/components/Shared/hooks';
import { toast } from '@/components/Toast';
import { IconContainer } from '@/components/Shared/IconContainer';
import { RecycleBinIcon } from '@/components/Shared/RecycleBinIcon';

import { ActionProps } from './Actions';
import { InvalidReason } from './ReasonSelect';

import { DeleteConfirmationModal } from './DeleteConfirmationModal';

import { useDeleteListingMutation } from '../hooks';

export function DeleteListing(props: ActionProps) {
  const { listing, queryKey } = props;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { query } = router;
  const { page = 1 } = query;
  const size = 50;

  const queryString = [queryKey, String(page), String(size)];

  const mutation = useDeleteListingMutation();

  const [status, execute, resolve, reject, resetStatus] =
    useAwaitableComponent();

  async function handleDeleteListing() {
    await execute()
      .then((reason) => {
        if (!reason) {
          toast.error(toast.getMessage('onEmptyDeleteRejectReason'));
          return;
        }

        mutation.mutate(
          { listing, reason: (reason as InvalidReason).value },
          {
            onSuccess() {
              queryClient.invalidateQueries(queryString);
            },
          }
        );
      })
      .catch(() => resetStatus());
  }

  const isConfirmDialogVisible = status === 'awaiting';

  return (
    <>
      {mutation.isLoading ? (
        <Stack justify="center">
          <Loader size="12px" border="static.blue" />
        </Stack>
      ) : (
        <IconContainer
          color="static.red"
          role="button"
          onClick={handleDeleteListing}
        >
          <RecycleBinIcon />
        </IconContainer>
      )}
      <DeleteConfirmationModal
        isOpen={isConfirmDialogVisible}
        resolve={resolve}
        reject={reject}
      />
    </>
  );
}
