import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { ProductListing } from '@/models/ProductListing';

export function useUpdateProductCondition() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { query } = router;
  const { listingId } = query;
  const queryKey = [QUERY_KEYS.listingDetail, String(listingId)];

  return useMutation(ProductListing.updateProductCondition, {
    onSuccess() {
      toast.success(toast.getMessage('onUpdateProductConditionSuccess'));
      queryClient.invalidateQueries(queryKey);
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message);
    },
    mutationKey: [QUERY_KEYS.updateProductCondition, String(listingId)],
  });
}
