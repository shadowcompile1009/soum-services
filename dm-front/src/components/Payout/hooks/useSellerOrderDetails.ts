import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/Toast';

import { SellerOrderDetails } from '@/models/OrderDetails';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useSellerOrderDetails(orderId: string) {
  const queryData = useQuery(
    [QUERY_KEYS.orderDetails, orderId, 'seller'],
    () => SellerOrderDetails.getSellerOrderDetails(orderId),
    {
      onError() {
        toast.error(toast.getMessage('onGetOrderDetailsError'));
      },
    }
  );

  return queryData;
}
