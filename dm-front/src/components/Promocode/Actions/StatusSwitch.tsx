import { Stack } from '@/components/Layouts';
import { Switch } from '@/components/Switch';
import { Loader } from '@/components/Loader';
import { Promocode } from '@/models/Promocode';

import { useStatusMutation } from '../hooks/useStatusMutation';
interface StatusSwitchProps {
  promocode: Promocode;
  queryKey?: string;
}

export function StatusSwitch({ promocode, queryKey = '' }: StatusSwitchProps) {
  const { mutate, isLoading, data } = useStatusMutation(queryKey);

  const status = data?.data?.status ? data.data.status : promocode.status;

  function handleOnChange() {
    mutate({
      promocode,
      status: status === 'Active' ? 'Inactive' : 'Active',
    });
  }
  if (!promocode) return null;

  return isLoading ? (
    <Stack justify="center">
      <Loader size="12px" border="static.blue" />
    </Stack>
  ) : (
    <Switch
      id={promocode?.id + '-switch'}
      on={status === 'Active'}
      onClick={handleOnChange}
    />
  );
}
