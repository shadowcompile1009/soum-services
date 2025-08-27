import { useQuery } from '@tanstack/react-query';

import { LogisticVendor } from '@/models/LogisticVendor';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useLogisticVendors() {
  return useQuery(
    [QUERY_KEYS.logisticVendors],
    () => LogisticVendor.getLogisticVendors(),
    {
      staleTime: Infinity,
    }
  );
}
