import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/Toast';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { Upfronts } from '@/models/Upfronts';
import { ConsignmentStatus } from '@/models/Upfronts';

export function usePayoutStatus(
  orderId: string,
  refetchUpfronts?: () => Promise<any>
) {
  const queryClient = useQueryClient();

  const queryData = useQuery(
    [QUERY_KEYS.payoutStatus, orderId],
    () => Upfronts.checkPayoutStatus(orderId),
    {
      onSuccess(data) {
        // Get the current table data
        const currentData = queryClient.getQueryData([
          QUERY_KEYS.payoutToSellerUpfront,
        ]) as any;

        if (currentData?.items) {
          // Find the upfront item and update its status
          const updatedItems = currentData.items.map((item: any) => {
            if (item.id === orderId) {
              return {
                ...item,
                status:
                  data.status === 'success'
                    ? ConsignmentStatus.TRANSFERRED
                    : item.status,
              };
            }
            return item;
          });

          // Update the query data with the new status
          queryClient.setQueryData([QUERY_KEYS.payoutToSellerUpfront], {
            ...currentData,
            items: updatedItems,
          });
        }

        // Still call refetchUpfronts if provided (as a backup)
        if (refetchUpfronts) {
          refetchUpfronts();
        }
      },
      onError() {
        toast.error(toast.getMessage('onPayoutStatusCheckError'));
      },
    }
  );

  return queryData;
}
