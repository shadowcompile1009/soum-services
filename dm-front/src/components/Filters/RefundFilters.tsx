import { SearchFilter } from '@src/components/Shared/SearchFilter';

import { Stack } from '../Layouts';
import { OrderTypeFilter, RefundStatusFilter } from './Filters';

export const RefundFilters = () => {
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
      <RefundStatusFilter />
    </Stack>
  );
};
