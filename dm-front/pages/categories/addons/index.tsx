import { Fragment } from 'react';

import { QueryClient, dehydrate } from '@tanstack/react-query';
import { NextPageContext } from 'next';

import { apiClientV1, apiClientV2 } from '@/api';
import AddonHeader from '@/components/Addon/AddonHeader';
import { MainAddonsTable } from '@/components/Addon/MainAddonsTable';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card } from '@/components/Card';
import { Stack } from '@/components/Layouts';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { User } from '@/models/User';
import { useMainAddons } from '@/components/Addon/hooks/useMainAddons';

const breadcrumbRoutes = {
  categories: {
    title: BREADCRUMBS.CATEGORIES,
  },
  addons: {
    title: BREADCRUMBS.ADDONS,
  },
};

const MainAddOnsPage = () => {
  const { data, isLoading, isSuccess, isError, refetch } = useMainAddons();

  return (
    <Fragment>
      <Breadcrumb routes={breadcrumbRoutes} />
      <Card heading={<AddonHeader refetch={refetch} />}>
        <Stack
          direction="horizontal"
          justify="space-between"
          style={{ marginBottom: 20 }}
        ></Stack>
        <MainAddonsTable
          mainAddons={data}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          refetch={refetch}
        />
      </Card>
    </Fragment>
  );
};

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

  await queryClient.prefetchQuery([QUERY_KEYS.addOns], () =>
    Promise.resolve([])
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

MainAddOnsPage.getLayout = WithShellLayout;

export default MainAddOnsPage;
