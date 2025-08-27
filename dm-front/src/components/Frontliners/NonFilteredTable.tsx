import { QUERY_KEYS } from '@/constants/queryKeys';

import { BaseListingTable } from './BaseListingTable';

export function NonFilteredTable() {
  return (
    <BaseListingTable
      listing_type="unfiltered"
      queryKey={QUERY_KEYS.flaggedListingUnfiltered}
    />
  );
}
