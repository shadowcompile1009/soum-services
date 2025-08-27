import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { Stack } from '@/components/Layouts';
import { Loader } from '@/components/Loader';
import { useAwaitableComponent } from '@/components/Shared/hooks';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { IconContainer } from '@/components/Shared/IconContainer';

import { ActionProps } from './Actions';

import { useLockUserMutation } from '../hooks';

function Lock() {
  return (
    <svg
      width="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.4242 5.56204C15.8072 3.78004 14.1142 2.50004 12.1222 2.50004C9.60925 2.49004 7.56325 4.51804 7.55225 7.03104V7.05104V9.19804"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.933 21.0005H8.292C6.198 21.0005 4.5 19.3025 4.5 17.2075V12.9195C4.5 10.8245 6.198 9.12646 8.292 9.12646H15.933C18.027 9.12646 19.725 10.8245 19.725 12.9195V17.2075C19.725 19.3025 18.027 21.0005 15.933 21.0005Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12.1128 13.9526V16.1746"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export function LockUser(props: ActionProps) {
  const { listing, queryKey } = props;

  const mutation = useLockUserMutation(queryKey);

  const [status, execute, resolve, reject, resetStatus] =
    useAwaitableComponent();

  async function handleLockUser() {
    await execute()
      .then(() => mutation.mutate(listing.userId))
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
          color="static.grays.500"
          role="button"
          onClick={handleLockUser}
        >
          <Lock />
        </IconContainer>
      )}
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
          <Text fontSize="bigText" fontWeight="regular" color="static.black">
            Block User
          </Text>
        </Box>
        <Text fontSize="baseText" fontWeight="regular" color="static.black">
          Are you sure you want to block this user? This will block and delete
          all this user&apos;s existing active listings.
        </Text>
      </ConfirmationDialog>
    </>
  );
}
