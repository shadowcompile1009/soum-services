import { apiClientV1, apiClientV2 } from '@/api';
import { Breadcrumb } from '@/components/Breadcrumb';
import CategoriesTable from '@/components/Category/CategoriesTable';
import { Stack } from '@/components/Layouts';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { CategoriesTypes } from '@/models/Category';
import { User } from '@/models/User';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

const breadcrumbRoutes = {
  categories: {
    title: BREADCRUMBS.CATEGORIES,
  },
};
const CategoryDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Fragment>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      <CategoriesTable
        categoryType={CategoriesTypes.CATEGORY}
        categoryId={String(id)}
      />
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

  await queryClient.prefetchQuery([QUERY_KEYS.categories], () =>
    Promise.resolve([])
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

CategoryDetail.getLayout = WithShellLayout;

export default CategoryDetail;
