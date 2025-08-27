import { useQuery } from '@tanstack/react-query';

import { EOrderV2ModuleValues } from '@/models/Order';
import { toast } from '@/components/Toast';
import { OrderV2 } from '@/models/Order';

interface useOrdersDataV2Props {
  submodule: EOrderV2ModuleValues;
  limit: string;
  offset: string;
  search?: string;
  statusId?: string;
  services?: string;
}

export function useOrdersDataV2(props: useOrdersDataV2Props) {
  const { submodule, limit, offset, search, statusId, services } = props;

  const { isLoading, isSuccess, isError, data } = useQuery(
    [submodule, limit, offset, search, statusId, services],
    () => {
      return OrderV2.getOrdersV2({
        submodule,
        limit,
        offset,
        search,
        statusId,
        services,
      });
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
