import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AccountSettings } from '@/components/Settings/AccountSettings';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Setting } from '@/models/Setting';
import { User } from '@/models/User';
import { Box } from '@/components/Box';

const breadcrumbRoutes = {
  settings: {
    title: BREADCRUMBS.SETTING,
  },
  account: {
    title: BREADCRUMBS.ACCOUNT,
  },
};

function AccountSettingsPage() {
  return (
    <>
      <Box style={{ marginBottom: 20 }}>
        <Breadcrumb routes={breadcrumbRoutes} />
      </Box>
      <AccountSettings />
    </>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const result = await User.checkIfNotLoggedIn(ctx, {
    destination: '/',
    permanent: false,
  });

  if (result?.redirect) {
    return {
      redirect: result?.redirect,
    };
  }

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([QUERY_KEYS.multiFactorStatus], () =>
    Setting.getMultiFactorAuthStatus()
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

AccountSettingsPage.getLayout = WithShellLayout;

export default AccountSettingsPage;
