import { ChangeEvent } from 'react';

import { Loader } from '@/components/Loader';
import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { Switch } from '@/components/Switch';

import { useListingDetails, useUprankMutation } from './hooks';

export function UprankSetting() {
  const { data } = useListingDetails();

  const uprankToggleMutation = useUprankMutation();

  function handleOnClick(evt: ChangeEvent<HTMLInputElement>) {
    const checkedValue = evt.target.checked;
    uprankToggleMutation.mutate({
      isUpranked: checkedValue,
      listingId: data?.productId!,
      imagesQualityScore: data?.imagesQualityScore ?? 0,
    });
  }

  return (
    <Stack gap="5" align="center">
      {uprankToggleMutation?.isLoading && (
        <Loader size="12px" border="static.blue" />
      )}
      <Text fontWeight="baseText" fontSize="baseText" color="static.blues.400">
        Upranked
      </Text>
      <Switch
        id="uprankToggle"
        defaultOn={data?.isUpranked}
        onClick={handleOnClick}
        disabled={uprankToggleMutation?.isLoading}
      />
    </Stack>
  );
}
