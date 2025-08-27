import { useQuery } from '@tanstack/react-query';
import { toast } from '@src/components/Toast';

import { QUERY_KEYS } from '@src/constants/queryKeys';
import { Order } from '@src/models/Order';

export function useOrderDetailV3(orderId: string) {
  const queryData = useQuery(
    [QUERY_KEYS.orderDetailV3, orderId],
    () => Order.getOrderDetailV3(orderId),
    {
      onError() {
        toast.error(toast.getMessage('onGetOrderDetailError'));
      },
    }
  );

  return queryData;
}
