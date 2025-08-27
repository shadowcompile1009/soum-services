import { apiClientV1, apiClientV2 } from '@/api';
import { Box } from '@/components/Box';
import { Breadcrumb } from '@/components/Breadcrumb';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import QuestionSettings from '@/components/Settings/QuestionSetting';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Setting } from '@/models/Setting';
import { User } from '@/models/User';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { NextPageContext } from 'next';

const breadcrumbRoutes = {
  settings: {
    title: BREADCRUMBS.SETTING,
  },
  questions: {
    title: BREADCRUMBS.QUESTIONS,
  },
};

function QuestionSettingsPage() {
  return (
    <>
      <Box style={{ marginBottom: 20 }}>
        <Breadcrumb routes={breadcrumbRoutes} />
        <QuestionSettings />
      </Box>
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

QuestionSettingsPage.getLayout = WithShellLayout;

export default QuestionSettingsPage;
