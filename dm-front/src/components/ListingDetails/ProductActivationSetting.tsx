import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';

import { Loader } from '@/components/Loader';
import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { Switch } from '@/components/Switch';

import { useActivationMutation, useActivationDetails } from './hooks/';

export function ProductActivationSetting() {
  const { data } = useActivationDetails();
  const router = useRouter();
  const { query } = router;
  const { listingId } = query;

  const activationToggleMutation = useActivationMutation();

  function handleOnClick(evt: ChangeEvent<HTMLInputElement>) {
    const checkedValue = evt.target.checked;
    activationToggleMutation.mutate({
      isActivated: checkedValue,
      listingId: String(listingId),
    });
  }

  return (
    <Stack gap="5" align="center">
      {activationToggleMutation?.isLoading && (
        <Loader size="12px" border="static.blue" />
      )}
      <Text fontWeight="baseText" fontSize="baseText" color="static.blues.400">
        {data?.isActivated ? 'Activated' : 'Deactivated'}
      </Text>
      <Switch
        id="activationToggle"
        defaultOn={data?.isActivated}
        onClick={handleOnClick}
        disabled={activationToggleMutation?.isLoading}
      />
    </Stack>
  );
}
