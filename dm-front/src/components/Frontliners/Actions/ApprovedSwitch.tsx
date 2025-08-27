import { Stack } from '@/components/Layouts';
import { Switch } from '@/components/Switch';
import { Loader } from '@/components/Loader';
import { FlaggedListing } from '@/models/FlaggedListings';

import { ActionProps } from './Actions';

import { useApproveMutation } from '../hooks';

export function ApprovedSwitch(props: ActionProps) {
  const { listing, queryKey } = props;

  const mutation = useApproveMutation(queryKey);

  function handleOnChange(listing: FlaggedListing) {
    mutation.mutate({
      listing,
      status: !listing.isApproved,
    });
  }

  return mutation.isLoading ? (
    <Stack justify="center">
      <Loader size="12px" border="static.blue" />
    </Stack>
  ) : (
    <Switch
      id={listing?.productId + '-switch'}
      defaultOn={listing.isApproved}
      onClick={() => handleOnChange(listing)}
    />
  );
}
