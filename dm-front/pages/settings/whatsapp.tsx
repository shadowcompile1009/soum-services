import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { Breadcrumb } from '@/components/Breadcrumb';
import { WhatsAppSettings } from '@/components/Settings';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { User } from '@/models/User';
import { Setting } from '@/models/Setting';
import { Box } from '@/components/Box';

const breadcrumbRoutes = {
  settings: {
    title: BREADCRUMBS.SETTING,
  },
  whatsapp: {
    title: BREADCRUMBS.WHATSAPP,
  },
};

function WhatsappSettingsPage() {
  return (
    <>
      <Box style={{ marginBottom: 20 }}>
        <Breadcrumb routes={breadcrumbRoutes} />
      </Box>
      <WhatsAppSettings />
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

  await queryClient.prefetchQuery([QUERY_KEYS.whatsAppSettings], () =>
    Setting.getWhatsAppSettings()
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

WhatsappSettingsPage.getLayout = WithShellLayout;

export default WhatsappSettingsPage;
