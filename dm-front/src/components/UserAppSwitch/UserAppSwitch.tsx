import { Switch } from '@src/components/Switch';
import { useEditUserAppStatus } from '@src/components/Settings/UsersApp/useEditUserAppStatus';

import { Box } from '../Box';

export function UserAppSwitch({
  userId,
  status,
}: {
  userId: string;
  status: string;
}) {
  const { mutate, isLoading } = useEditUserAppStatus();

  const handleChangeStatus = () => {
    const updatedStatus = status === 'Active' ? 'Inactive' : 'Active';
    mutate({ userId, updatedStatus });
  };

  return (
    <Box
      cssProps={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Switch
        id="userAppStatusChangeToggle"
        defaultOn={status === 'Active'}
        onClick={handleChangeStatus}
        disabled={isLoading}
      />
    </Box>
  );
}
