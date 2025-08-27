import React from 'react';
import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Box } from '@/components/Box';
import { Breadcrumb } from '@/components/Breadcrumb';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { PromoCodeTable } from '@/components/Promocode/PromoCodeTable';

import { User } from '@/models/User';
import { apiClientV1, apiClientV2 } from '@/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Promocode } from '@/models/Promocode';

const breadcrumbRoutes = {
  promocode: {
    title: BREADCRUMBS.PROMOCODE,
  },
  list: {
    title: BREADCRUMBS.PROMOCODE_LIST,
  },
};

const ListPage = () => {
  return (
    <>
      <Box marginBottom={20}>
        <Breadcrumb routes={breadcrumbRoutes} />
      </Box>

      <PromoCodeTable />
    </>
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

  const {
    query: { page = '1', search = '' },
  } = ctx;

  const limit = 100;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.promocodeList, page, limit, search],
    () =>
      Promocode.getPromocodeList(Number(limit), Number(page), String(search))
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

ListPage.getLayout = WithShellLayout;

export default ListPage;
