import { QUERY_KEYS } from '@/constants/queryKeys';

import { BaseListingTable } from './BaseListingTable';

export function PositiveListingTable() {
  return (
    <BaseListingTable
      listing_type="positive_flag"
      queryKey={QUERY_KEYS.flaggedListingPositive}
    />
  );
}
