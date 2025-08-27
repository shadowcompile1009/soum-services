import { QUERY_KEYS } from '@/constants/queryKeys';

import { BaseListingTable } from './BaseListingTable';

export function DiscountListingTable() {
  return (
    <BaseListingTable
      listing_type="discount"
      queryKey={QUERY_KEYS.flaggedListingDiscount}
    />
  );
}
