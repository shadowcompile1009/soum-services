import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/Toast';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { Order } from '@/models/Order';

export function useOrderDetail(orderId: string) {
  const queryData = useQuery(
    [QUERY_KEYS.orderDetail, orderId],
    () => Order.getOrderDetail(orderId),
    {
      onError() {
        toast.error(toast.getMessage('onGetOrderDetailError'));
      },
    }
  );

  return queryData;
}
