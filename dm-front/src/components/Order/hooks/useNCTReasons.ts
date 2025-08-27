import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/Toast';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { Order } from '@/models/Order';

export function useNCTReasons() {
  const queryData = useQuery(
    [QUERY_KEYS.NCTReasons],
    () => Order.getNCTReasons(),
    {
      staleTime: Infinity,
      onError() {
        toast.error(toast.getMessage('onGetNCTReasonsError'));
      },
    }
  );

  return queryData;
}
export function useNCTReasonByOrderId(orderId: string) {
  const queryData = useQuery(
    [QUERY_KEYS.NCTReasons, orderId],
    () => Order.getNCTReasonByOrderId(orderId),
    {
      onError() {
        toast.error(toast.getMessage('onGetNCTReasonsError'));
      },
    }
  );

  return queryData;
}
