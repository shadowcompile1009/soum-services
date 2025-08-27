import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import isEmpty from 'lodash.isempty';

import { IOrderStatus, Order, EOrderModules } from '@/models/Order';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useOrderStatuses(submodule?: EOrderModules) {
  const [data, setData] = useState<IOrderStatus[]>([]);

  const {
    isLoading,
    isSuccess,
    data: statuses,
  } = useQuery(
    [QUERY_KEYS.orderStatuses, submodule],
    () => Order.getOrderStatuses(submodule),
    {
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (!isLoading && isSuccess && !isEmpty(statuses)) {
      return setData(Order.mapOrderStatuses({ statuses }));
    }
  }, [isLoading, isSuccess, statuses]);

  return data;
}
