import { Stack } from '../Layouts';
import { DisputeStatusFilter } from './Filters';
import { SearchFilter } from '@src/components/Shared/SearchFilter';
import { OrderTypeFilter } from './Filters';

export const DisputeFilters = () => {
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
      <DisputeStatusFilter />
    </Stack>
  );
};
