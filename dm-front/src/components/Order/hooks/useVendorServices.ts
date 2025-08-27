import { useQuery } from '@tanstack/react-query';

import { VendorService } from '@/models/LogisticVendor';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useVendorServices() {
  return useQuery(
    [QUERY_KEYS.logisticServices],
    () => VendorService.getAllVendorServices(),
    {
      staleTime: Infinity,
    }
  );
}
