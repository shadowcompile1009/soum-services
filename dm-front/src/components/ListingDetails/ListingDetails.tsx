import { Stack } from '@/components/Layouts';

import { ProductDetails } from './ProductDetails';
import { SellerQuestions } from './SellerQuestions';
import { ListingSettings } from './ListingSettings';

export function ListingDetails() {
  return (
    <Stack direction="vertical" gap="5">
      <ProductDetails />
      <Stack direction="horizontal" gap="5">
        <SellerQuestions />
        <ListingSettings />
      </Stack>
    </Stack>
  );
}
