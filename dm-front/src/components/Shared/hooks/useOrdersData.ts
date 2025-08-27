import { useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import isEmpty from 'lodash.isempty';

import { SUBMODULE_QUERY_KEYS_MAP, EOrderModules } from '@/models/Order';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { toast } from '@/components/Toast';
import { Order } from '@/models/Order';

interface useOrdersDataProps {
  submodule: EOrderModules;
  limit: string;
  offset: string;
  search?: string;
  capturestatus?: string;
  replacementStatus?: string;
}

export function useOrdersData(props: useOrdersDataProps) {
  const {
    submodule,
    limit,
    offset,
    search,
    capturestatus = '',
    replacementStatus = '',
  } = props;
  const [data, setData] = useState<Order[] | undefined>();

  let queryKey = [
    SUBMODULE_QUERY_KEYS_MAP[submodule],
    limit,
    offset,
    search,
    capturestatus,
    replacementStatus,
  ];

  const {
    isFetching,
    isLoading,
    isSuccess,
    isError,
    data: ordersData,
  } = useQuery(
    queryKey,
    () =>
      Order.getCaptureOrders({
        submodule,
        limit,
        offset,
        search,
        capturestatus,
        replacementStatus,
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

  const { data: statuses } = useQuery([QUERY_KEYS.orderStatuses], () =>
    Order.getOrderStatuses()
  );

  useEffect(() => {
    if (
      !isLoading &&
      isSuccess &&
      !isError &&
      !isEmpty(ordersData?.data) &&
      !isEmpty(statuses)
    ) {
      setData(Order.mapOrders({ orders: ordersData?.data, statuses }));
    }

    if (isSuccess && isEmpty(ordersData?.data)) {
      setData([]);
    }
  }, [
    isLoading,
    isSuccess,
    isError,
    ordersData?.data,
    statuses,
    capturestatus,
  ]);

  return {
    isFetching,
    isLoading,
    isSuccess,
    isError,
    orders: data,
    total: ordersData?.total,
    limit: ordersData?.limit,
    offset: offset,
  };
}
