import { QUERY_KEYS } from '@/constants/queryKeys';

import { BaseListingTable } from './BaseListingTable';

export function OnHoldListingTable() {
  return (
    <BaseListingTable
      listing_type="on_hold"
      queryKey={QUERY_KEYS.flaggedListingOnHold}
    />
  );
}
