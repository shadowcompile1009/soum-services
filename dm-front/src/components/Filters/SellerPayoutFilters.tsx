import { SearchFilter } from '@src/components/Shared/SearchFilter';

import { DateFilter, OrderTypeFilter, PayoutStatusFilter } from './Filters';
import { SellerPayoutTypeFilter } from './Filters';

import { Stack } from '../Layouts';

export const SellerPayoutFilters = () => {
  return (
    <Stack direction="horizontal" gap="7" flexWrap="wrap" rowGap="7">
      <SearchFilter placeholder="Order Id" />
      <DateFilter />
      <OrderTypeFilter />
      <PayoutStatusFilter />
      <SellerPayoutTypeFilter />
    </Stack>
  );
};
