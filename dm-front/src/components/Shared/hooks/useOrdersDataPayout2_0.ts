import { useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import isEmpty from 'lodash.isempty';

import { SUBMODULE_QUERY_KEYS_MAP, EOrderModules } from '@src/models/Order';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { toast } from '@src/components/Toast';
import { Order } from '@src/models/Order';

interface useOrdersDataPayout2_0Props {
  submodule: EOrderModules;
  limit: string;
  offset: string;
  search?: string;
  capturestatus?: string;
  replacementStatus?: string;
  orderType?: string;
  payoutStatus?: string;
  refundStatus?: string;
}

export function useOrdersDataPayout2_0(props: useOrdersDataPayout2_0Props) {
  const {
    submodule,
    limit,
    offset,
    search,
    capturestatus = '',
    replacementStatus = '',
    orderType = '',
    payoutStatus = '',
    refundStatus = '',
  } = props;
  const [data, setData] = useState<Order[] | undefined>();

  let queryKey = [
    SUBMODULE_QUERY_KEYS_MAP[submodule],
    limit,
    offset,
    search,
    capturestatus,
    replacementStatus,
    orderType,
    payoutStatus,
    refundStatus,
  ];

  const {
    isFetching,
    isLoading,
    isSuccess,
    isError,
    data: ordersData,
  } = useQuery(
    queryKey,
    () => {
      const orderV3Params = {
        submodule,
        limit,
        offset,
        ...(search && { search }),
        ...(capturestatus && { capturestatus }),
        ...(replacementStatus && { replacementStatus }),
        ...(orderType && { orderType }),
        ...(payoutStatus && { payoutStatus }),
        ...(refundStatus && { refundStatus }),
      };

      return Order.getPayoutOrders(orderV3Params);
    },
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

  const { data: statuses } = useQuery(
    [QUERY_KEYS.orderStatuses, props.submodule, props.search],
    () => Order.getOrderStatuses()
  );

  useEffect(() => {
    if (
      !isLoading &&
      isSuccess &&
      !isError &&
      !isEmpty(ordersData?.data) &&
      !isEmpty(statuses)
    ) {
      setData(Order.mapOrders({ orders: ordersData?.data?.orders, statuses }));
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
    total: ordersData?.data?.total,
    count: ordersData?.data?.count,
    limit: limit,
    offset: offset,
  };
}
