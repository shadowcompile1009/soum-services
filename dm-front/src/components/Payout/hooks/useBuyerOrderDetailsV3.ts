import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/Toast';

import { BuyerOrderDetails } from '@/models/OrderDetails';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useBuyerOrderDetailsV3(orderId: string) {
  const queryData = useQuery(
    [QUERY_KEYS.orderDetails, orderId, 'buyer'],
    () => BuyerOrderDetails.getBuyerOrderDetailsV3(orderId),
    {
      onError() {
        toast.error(toast.getMessage('onGetOrderDetailsError'));
      },
    }
  );

  return queryData;
}
