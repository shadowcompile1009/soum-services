import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { FlaggedListingValues } from '@/models/FlaggedListings';
import { FlaggedListing } from '@/models/FlaggedListings';

type queryKeysType =
  | 'flaggedListingDiscount'
  | 'flaggedListingRecent'
  | 'flaggedListingPositive'
  | 'flaggedListingUnchecked'
  | 'flaggedListingUnfiltered'
  | 'flaggedListingConsignment'
  | 'flaggedListingOnHold';

const queryListTypeMap: Record<FlaggedListingValues, queryKeysType> = {
  ['listing_date']: QUERY_KEYS.flaggedListingRecent as 'flaggedListingRecent',
  ['discount']: QUERY_KEYS.flaggedListingDiscount as 'flaggedListingDiscount',
  ['positive_flag']:
    QUERY_KEYS.flaggedListingPositive as 'flaggedListingPositive',
  ['uncheck']: QUERY_KEYS.flaggedListingUnchecked as 'flaggedListingUnchecked',
  ['unfiltered']:
    QUERY_KEYS.flaggedListingUnfiltered as 'flaggedListingUnfiltered',
  ['consignment']:
    QUERY_KEYS.flaggedListingConsignment as 'flaggedListingConsignment',
  ['on_hold']: QUERY_KEYS.flaggedListingOnHold as 'flaggedListingOnHold',
};

export function useFlaggedListings(listingType: FlaggedListingValues) {
  const router = useRouter();
  const { query } = router;
  const { page = 1 } = query;
  const size = 50;
  return useQuery(
    [queryListTypeMap[listingType], String(page), String(size)],
    () =>
      FlaggedListing.getFlaggedListingByType(
        listingType,
        Number(page),
        Number(size)
      )
  );
}
