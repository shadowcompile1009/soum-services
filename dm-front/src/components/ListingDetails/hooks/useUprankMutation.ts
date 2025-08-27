import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { toast } from '@/components/Toast';
import { ProductListing } from '@/models/ProductListing';

export function useUprankMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { query } = router;
  const { listingId } = query;
  const queryKey = [QUERY_KEYS.listingDetail, String(listingId)];

  return useMutation(ProductListing.toggleUprank, {
    onSuccess() {
      toast.success(toast.getMessage('onUpdateUprankToggleSuccess'));
      queryClient.invalidateQueries(queryKey);
    },
    onError() {
      toast.error(toast.getMessage('onUpdateUprankToggleError'));
    },
  });
}
