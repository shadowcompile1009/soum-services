import { Stack } from '@/components/Layouts';

import { Breadcrumb } from '@/components/Breadcrumb';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';

import { CityTiersPage } from '@/components/LogisticsTiers';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Text } from '@/components/Text';

const breadcrumbRoutes = {
  logistics: {
    title: BREADCRUMBS.LOGISTICS,
  },
  citiesTiers: {
    title: BREADCRUMBS.LOGISTICS_TIERS,
  },
};

function LogisticsTiersPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
        <CityTiersPage />
      </Stack>
      <Text color="static.black" fontSize="headingThree" fontWeight="semibold">
        Logistics Tiers
      </Text>
    </>
  );
}

LogisticsTiersPage.getLayout = WithShellLayout;

export default LogisticsTiersPage;
