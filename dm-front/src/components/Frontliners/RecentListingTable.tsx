import { QUERY_KEYS } from '@/constants/queryKeys';

import { BaseListingTable } from './BaseListingTable';

export function RecentListingTable() {
  return (
    <BaseListingTable
      listing_type="listing_date"
      queryKey={QUERY_KEYS.flaggedListingRecent}
    />
  );
}
