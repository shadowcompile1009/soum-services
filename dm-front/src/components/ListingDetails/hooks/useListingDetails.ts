import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { ProductListing } from '@/models/ProductListing';

export function useListingDetails() {
  const router = useRouter();
  const { query } = router;
  const { listingId } = query;
  const id = String(listingId);
  return useQuery([QUERY_KEYS.listingDetail, id], () =>
    ProductListing.getListingDetailsById(id)
  );
}
