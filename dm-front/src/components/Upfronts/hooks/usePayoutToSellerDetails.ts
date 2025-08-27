import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/Toast';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { Upfronts } from '@/models/Upfronts';

export function usePayoutToSellerDetails(orderId: string) {
  const queryData = useQuery(
    [QUERY_KEYS.payoutToSellerDetails, orderId],
    () => Upfronts.payoutToSellerDetails(orderId),
    {
      onError() {
        toast.error(toast.getMessage('onPayoutToSellerDetailsError'));
      },
    }
  );

  return queryData;
}
