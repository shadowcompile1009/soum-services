import { Stack } from '@/components/Layouts';
import { Checkbox } from '@/components/Form';
import { Loader } from '@/components/Loader';
import { FlaggedListing } from '@/models/FlaggedListings';

import { ActionProps } from './Actions';

import { useVerifyStatusMutation } from '../hooks';

export function VerifiedCheckBox(props: ActionProps) {
  const { listing, queryKey } = props;

  const mutation = useVerifyStatusMutation(queryKey);

  function handleOnChange(listing: FlaggedListing) {
    mutation.mutate({
      listing,
      status: !listing.isVerifiedByAdmin,
    });
  }

  return mutation.isLoading ? (
    <Stack justify="center">
      <Loader size="12px" border="static.blue" />
    </Stack>
  ) : (
    <Checkbox
      id={listing?.productId + '-checkbox'}
      checked={listing.isVerifiedByAdmin}
      onChange={() => handleOnChange(listing)}
    />
  );
}
