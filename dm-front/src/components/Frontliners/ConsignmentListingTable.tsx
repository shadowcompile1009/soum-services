import { QUERY_KEYS } from '@/constants/queryKeys';

import { BaseListingTable } from './BaseListingTable';

export function ConsignmentListingTable() {
  return (
    <BaseListingTable
      listing_type="consignment"
      queryKey={QUERY_KEYS.flaggedListingConsignment}
    />
  );
}
