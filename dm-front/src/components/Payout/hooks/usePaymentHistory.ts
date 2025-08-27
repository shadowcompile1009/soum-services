import { useQuery } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Payment } from '@/models/Payment';

export function usePaymentHistory(orderId: string) {
  const queryData = useQuery(
    [QUERY_KEYS.paymentHistory, orderId],
    () => Payment.getPaymentHistory(orderId),
    {
      onError() {
        toast.error(toast.getMessage('onGetPaymentHistoryError'));
      },
    }
  );

  return queryData;
}
