import { useMutation } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { FlaggedListing } from '@/models/FlaggedListings';

export function useDeleteListingMutation() {
  return useMutation(FlaggedListing.deleteListing, {
    onSuccess() {
      toast.success(toast.getMessage('onListingDeleteSuccess'));
    },
    onError() {
      toast.error(toast.getMessage('onListingDeleteError'));
    },
  });
}
