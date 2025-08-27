import { QUERY_KEYS } from '@/constants/queryKeys';

import { BaseListingTable } from './BaseListingTable';

export function UncheckListingTable() {
  return (
    <BaseListingTable
      listing_type="uncheck"
      queryKey={QUERY_KEYS.flaggedListingUnchecked}
    />
  );
}
