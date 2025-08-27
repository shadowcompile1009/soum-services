import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { FlaggedListing } from '@/models/FlaggedListings';

export function useLockUserMutation(queryString: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { query } = router;
  const { page = 1 } = query;
  const size = 50;
  const queryKey = [queryString, String(page), String(size)];

  return useMutation(FlaggedListing.lockUser, {
    onSuccess() {
      toast.success(toast.getMessage('onUpdateFlaggedListingSuccess'));
      queryClient.invalidateQueries(queryKey);
    },
    onError() {
      toast.error(toast.getMessage('onUpdateFlaggedListingError'));
    },
  });
}
