import { SearchFilter } from '@src/components/Shared/SearchFilter';

import { Stack } from '../Layouts';
import { PayoutStatusFilter, OrderTypeFilter } from './Filters';

export const PayoutFilters = () => {
  return (
    <Stack
      direction="horizontal"
      gap="7"
      marginBottom="1.5rem"
      flexWrap="wrap"
      rowGap="7"
    >
      <SearchFilter placeholder="Order Id" />
      <OrderTypeFilter />
      <PayoutStatusFilter />
    </Stack>
  );
};
