import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiClientV2, apiGatewayClient, apiClientV1 } from '@/api/client';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Box } from '@/components/Box';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Setting } from '@/models/Setting';
import { WalletSettings } from '@/components/Settings/WalletSettings';

const breadcrumbRoutes = {
  settings: {
    title: BREADCRUMBS.SETTING,
  },
  wallet: {
    title: BREADCRUMBS.WALLET,
  },
};

function WalletSettingsPage() {
  return (
    <>
      <Box style={{ marginBottom: 20 }}>
        <Breadcrumb routes={breadcrumbRoutes} />
      </Box>
      <WalletSettings />
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
  apiGatewayClient.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([QUERY_KEYS.walletSettings], () =>
    Setting.getWalletSettings()
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

WalletSettingsPage.getLayout = WithShellLayout;

export default WalletSettingsPage;
