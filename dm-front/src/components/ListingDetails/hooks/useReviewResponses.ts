import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { ProductQuestion } from '@/models/ProductQuestion';

export function useReviewResponses() {
  const router = useRouter();
  const { query } = router;
  const { listingId } = query;
  const id = String(listingId);
  return useQuery([QUERY_KEYS.reviewResponses, id], () =>
    ProductQuestion.getReviewResponsesByListingId(id)
  );
}
