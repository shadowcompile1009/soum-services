import { OrderV3 } from '@src/models/Order';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { toast } from '@src/components/Toast';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { InvoiceDataResponse } from '../types';

export function useOrderInvoiceDetails() {
  const router = useRouter();
  const { id: orderId, page = '1', size = '30' } = router.query;

  return useQuery<InvoiceDataResponse>(
    [QUERY_KEYS.orderInvoiceDetails, orderId, page, size],
    () => {
      return OrderV3.getInvoiceDetails(
        orderId as string,
        page as string,
        size as string
      );
    },
    {
      onError(error: any) {
        if (error?.response?.status === 403) {
          toast.error('Something went wrong while fetching invoice details');
        }
      },
      retry: false,
    }
  );
}
