import { useQuery } from '@tanstack/react-query';
import { toast } from '@src/components/Toast';

import { QUERY_KEYS } from '@src/constants/queryKeys';
import { Order } from '@src/models/Order';

import { statusesSubmodules } from '../EditOrderDetails/Select/SelectOrderStatus';

export function useOrderStatusesByCurrentStatus(
  id: string,
  submodule: statusesSubmodules
) {
  const queryData = useQuery(
    [QUERY_KEYS.editOrderDetailStatuses, id],

    () => Order.getOrderStatusesByCurrentStatus(id, submodule),
    {
      enabled: !!id,
      onError() {
        toast.error(toast.getMessage('onGetEditOrderDetailStatusesError'));
      },
    }
  );

  return queryData;
}
