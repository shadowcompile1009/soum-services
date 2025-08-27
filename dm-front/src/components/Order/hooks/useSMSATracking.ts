import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/Toast';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { Order } from '@/models/Order';

export function useSMSATrackingByOrderId(orderId: string) {
  const queryData = useQuery(
    [QUERY_KEYS.ReverseSmsaTracking, orderId],
    () => Order.getReverseSmsaTrackingById(orderId),
    {
      onError() {
        toast.error(toast.getMessage('onGenerateSmsaTrackingError'));
      },
    }
  );

  return queryData;
}
