import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { ProductListing } from '@/models/ProductListing';

export function useGetProductConditions(categoryId: string) {
  return useQuery(
    [QUERY_KEYS.getProductConditions, categoryId],
    () => ProductListing.getProductConditions(categoryId),
    {
      enabled: !!categoryId,
      staleTime: 1000 * 60 * 60 * 24, // 1 day
    }
  );
}
