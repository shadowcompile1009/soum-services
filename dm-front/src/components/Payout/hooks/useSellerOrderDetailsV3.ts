import { useQuery } from '@tanstack/react-query';
import { toast } from '@src/components/Toast';

import { SellerOrderDetails } from '@src/models/OrderDetails';
import { QUERY_KEYS } from '@src/constants/queryKeys';

export function useSellerOrderDetailsV3(orderId: string) {
  const queryData = useQuery(
    [QUERY_KEYS.orderDetailV3, orderId, 'seller'],
    () => SellerOrderDetails.getSellerOrderDetailsV3(orderId),
    {
      onError() {
        toast.error(toast.getMessage('onGetOrderDetailsError'));
      },
    }
  );

  return queryData;
}
