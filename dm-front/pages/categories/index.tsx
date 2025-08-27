import { apiClientV1, apiClientV2 } from '@/api';
import { Breadcrumb } from '@/components/Breadcrumb';
import CategoriesTable from '@/components/Category/CategoriesTable';
import { Stack } from '@/components/Layouts';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { CategoriesTypes, Category } from '@/models/Category';
import { User } from '@/models/User';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { NextPageContext } from 'next';
import { Fragment } from 'react';

const breadcrumbRoutes = {
  categories: {
    title: BREADCRUMBS.SUPER_CATEGORIES,
  },
};
const CategoriesPage = () => {
  const {} = useQuery([QUERY_KEYS.categories], async () => {
    return Promise.resolve([]);
  });

  return (
    <Fragment>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      <CategoriesTable categoryType={CategoriesTypes.SUPER_CATEGORY} />
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

  const {
    query: { page = '1' },
  } = ctx;

  const size = '20';

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([QUERY_KEYS.categories, page, size], () =>
    Category.getCategories('category', 'category', Number(page), Number(size))
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

CategoriesPage.getLayout = WithShellLayout;

export default CategoriesPage;
