import { useQuery } from '@tanstack/react-query';

import { EFinanceOrderModuleValues, FinanceOrder } from '@/models/Order';
import { toast } from '@/components/Toast';

interface useFinanceOrdersDataProps {
  submodule: EFinanceOrderModuleValues;
  limit: string;
  offset: string;
  search?: string;
  statusId?: string;
  services?: string;
}

export function useFinanceOrderData(props: useFinanceOrdersDataProps) {
  const { submodule, limit, offset, search, statusId, services } = props;

  const { isLoading, isSuccess, isError, data } = useQuery(
    [submodule, limit, offset, search, statusId, services],
    async () => {
      const result = await FinanceOrder.getFinanceOrders({
        submodule,
        limit,
        offset,
        search,
        statusId,
        services,
      });

      return result;
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

  return {
    isLoading,
    isSuccess,
    isError,
    orders: data?.orders,
    total: data?.paginationData.total,
    limit: data?.paginationData.limit,
    offset: offset,
  };
}
