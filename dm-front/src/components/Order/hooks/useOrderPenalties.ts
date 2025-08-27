import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/Toast';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { Order } from '@/models/Order';

export function useOrderPenalties() {
  const queryData = useQuery(
    [QUERY_KEYS.orderPenalties],
    () => Order.getPenalties(),
    {
      staleTime: Infinity,
      onError() {
        toast.error(toast.getMessage('onGetPenaltiesError'));
      },
    }
  );

  return queryData;
}
