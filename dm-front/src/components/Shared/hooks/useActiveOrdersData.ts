import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import isEmpty from 'lodash.isempty';
import { useRouter } from 'next/router';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { toast } from '@/components/Toast';
import { Order } from '@/models/Order';

export function useActiveOrdersData() {
  const router = useRouter();
  const {
    limit = '10',
    offset = '0',
    search = '',
    statuses = '',
  } = router.query;

  const [data, setData] = useState<Order[] | undefined>();

  const {
    isLoading,
    isSuccess,
    isError,
    data: ordersData,
  } = useQuery(
    [QUERY_KEYS.activeOrders, limit, offset, search, statuses],
    () =>
      Order.getActiveOrders({
        limit: String(limit),
        offset: String(offset),
        search: String(search),
        statuses: String(statuses),
      }),
    {
      onError(error: any) {
        if (error?.response?.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
          return;
        }
        toast.error(toast.getMessage('onListOrdersError'));
      },
    }
  );

  const { data: orderStatuses } = useQuery([QUERY_KEYS.orderStatuses], () =>
    Order.getOrderStatuses()
  );

  useEffect(() => {
    if (
      !isLoading &&
      isSuccess &&
      !isError &&
      !isEmpty(ordersData?.data) &&
      !isEmpty(orderStatuses)
    ) {
      setData(
        Order.mapOrders({ orders: ordersData?.data, statuses: orderStatuses })
      );
    }

    if (isSuccess && isEmpty(ordersData?.data)) {
      setData([]);
    }
  }, [isLoading, isSuccess, isError, ordersData?.data, orderStatuses]);

  return {
    isLoading,
    isSuccess,
    isError,
    orders: data,
    total: ordersData?.total,
    limit: ordersData?.limit,
    offset: offset,
  };
}
