import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { FlaggedListing } from '@/models/FlaggedListings';

export function useApproveMutation(queryString: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { query } = router;
  const { page = 1 } = query;
  const size = 50;
  const queryKey = [queryString, String(page), String(size)];

  return useMutation(FlaggedListing.updateApproveStatus, {
    onMutate: async (updatedListing) => {
      const previousData = queryClient.getQueryData(queryKey) as {
        listings: FlaggedListing[];
        total: number;
      };

      let updatedData = { ...previousData };

      updatedData['listings'] = previousData.listings.map((listing) => {
        if (listing.productId === updatedListing.listing.productId) {
          return {
            ...listing,
            isApproved: updatedListing.status,
          };
        }
        return listing;
      });

      queryClient.setQueryData(queryKey, () => updatedData);

      return { previousData };
    },
    onSuccess() {
      toast.success(toast.getMessage('onUpdateFlaggedListingSuccess'));
    },
    onError() {
      toast.error(toast.getMessage('onUpdateFlaggedListingError'));
    },
    onSettled() {
      queryClient.invalidateQueries(queryKey);
    },
  });
}
