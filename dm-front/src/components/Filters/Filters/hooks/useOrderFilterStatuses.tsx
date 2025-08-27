import { useQuery } from '@tanstack/react-query';

import { OrderV3 } from '@src/models/Order';
import { QUERY_KEYS } from '@src/constants/queryKeys';

const useOrderFilterStatuses = (submodule: string) => {
  const { data: statuses } = useQuery(
    [QUERY_KEYS.orderFilterStatuses, submodule],
    () => OrderV3.getOrderFilterStatusesV3(submodule),
    {
      staleTime: Infinity,
    }
  );

  return statuses;
};

export default useOrderFilterStatuses;
