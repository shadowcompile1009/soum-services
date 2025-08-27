import { Stack } from '@/components/Layouts';

import { Breadcrumb } from '@/components/Breadcrumb';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';

import { VendorsPage } from '@/components/LogisticsVendors';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Text } from '@/components/Text';

const breadcrumbRoutes = {
  logistics: {
    title: BREADCRUMBS.LOGISTICS,
  },
  vendors: {
    title: BREADCRUMBS.LOGISTICS_VENDORS,
  },
};

function LogisticsVendorsPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
        <VendorsPage />
      </Stack>
      <Text color="static.black" fontSize="headingThree" fontWeight="semibold">
        Logistics Vendors
      </Text>
    </>
  );
}

LogisticsVendorsPage.getLayout = WithShellLayout;

export default LogisticsVendorsPage;
