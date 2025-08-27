import { Stack } from '../Layouts';
import { SearchFilter } from '../Shared/SearchFilter';
import {
  DateFilter,
  OperatingModelFilter,
  OrderTypeFilter,
  SellerTypeFilter,
  SellerCategoryFilter,
  OrderStatusFilter,
} from './Filters';

export const AllOrderFilters = () => {
  return (
    <Stack
      direction="horizontal"
      gap="7"
      marginBottom="1.5rem"
      flexWrap="wrap"
      rowGap="7"
    >
      <SearchFilter placeholder="Order Id" />
      <DateFilter />
      <OrderTypeFilter />
      <OperatingModelFilter />
      <SellerTypeFilter />
      <SellerCategoryFilter />
      <OrderStatusFilter />
    </Stack>
  );
};
