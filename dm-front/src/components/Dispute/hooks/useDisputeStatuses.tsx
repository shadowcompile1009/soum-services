import { useQuery } from '@tanstack/react-query';
import { toast } from '@src/components/Toast';

import { QUERY_KEYS } from '@src/constants/queryKeys';
import { Order } from '@src/models/Order';

export function useDisputeStatuses(id: string) {
  const queryData = useQuery(
    [QUERY_KEYS.disputeStatuses, id],
    () => Order.getDisputeStatuses(id),
    {
      onError: (error: any) => {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error('An error occurred while sending the request');
        }
      },
    }
  );

  return queryData;
}
