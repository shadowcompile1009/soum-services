import { Card } from '@/components/Card';
import { Stack } from '@/components/Layouts';

import { Box } from '@/components/Box';

import { ProductDetailHeader } from './ProductDetailHeader';
import { ProductImageSlider } from './ProductImageSlider';
import { ProductDetailTable } from './ProductDetailTable';

export function ProductDetails() {
  return (
    <Card heading={<ProductDetailHeader />}>
      <Box cssProps={{ overflow: 'hidden' }}>
        <Stack gap="25" direction="horizontal">
          <ProductImageSlider />
          <ProductDetailTable />
        </Stack>
      </Box>
    </Card>
  );
}
