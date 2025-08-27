import { Stack } from '@/components/Layouts';
import { Breadcrumb } from '@/components/Breadcrumb';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';

import { RulesPage } from '@/components/LogisticsRules';
import { Text } from '@/components/Text';
import { BREADCRUMBS } from '@/constants/breadcrumbs';

const breadcrumbRoutes = {
  logistics: {
    title: BREADCRUMBS.LOGISTICS,
  },
  rules: {
    title: BREADCRUMBS.RULES_ENGINE,
  },
};

function LogisticsRulesPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
        <RulesPage />
      </Stack>
      <Text color="static.black" fontSize="headingThree" fontWeight="semibold">
        Rules Engine
      </Text>
    </>
  );
}

LogisticsRulesPage.getLayout = WithShellLayout;

export default LogisticsRulesPage;
