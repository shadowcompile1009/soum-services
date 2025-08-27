import { useQuery } from '@tanstack/react-query';

import { VendorService } from '@/models/LogisticVendor';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useVendorServices(vendorId: string) {
  return useQuery(
    [QUERY_KEYS.vendorServices, vendorId],
    () => VendorService.getVendorServices(vendorId),
    {
      staleTime: Infinity,
    }
  );
}
