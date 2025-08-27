import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { apiClientV2, apiGatewayClient, apiClientV1 } from '@/api/client';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Stack } from '@/components/Layouts';
import { ActivityLogTable } from '@/components/Settings';
import { SearchFilter } from '@/components/Shared/SearchFilter';
import { ActivityLog } from '@/models/ActivityLog';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { User } from '@/models/User';

const breadcrumbRoutes = {
  settings: {
    title: BREADCRUMBS.SETTING,
  },
  activityLog: {
    title: BREADCRUMBS.ACTIVITY_LOG,
  },
};

function ActivityLogsPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      <SearchFilter />
      <ActivityLogTable />
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

  const {
    query: { limit = '10', offset = '0', search = '' },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);
  apiGatewayClient.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.activityLog, limit, offset, search],
    () =>
      ActivityLog.getActivityLogList({
        limit: String(limit),
        offset: String(offset),
        search: String(search),
      })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

ActivityLogsPage.getLayout = WithShellLayout;

export default ActivityLogsPage;
