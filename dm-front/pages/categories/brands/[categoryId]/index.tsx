import { apiClientV1, apiClientV2 } from '@/api';
import BrandsTable from '@/components/Brand/BrandsTable';
import { Breadcrumb } from '@/components/Breadcrumb';
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
  brands: {
    title: BREADCRUMBS.BRANDS,
  },
};
const BrandsPage = () => {
  const router = useRouter();
  const { categoryId } = router.query;
  return (
    <Fragment>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      <BrandsTable
        categoryType={CategoriesTypes.BRAND}
        categoryId={String(categoryId)}
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

  await queryClient.prefetchQuery([QUERY_KEYS.brands], () =>
    Promise.resolve([])
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

BrandsPage.getLayout = WithShellLayout;

export default BrandsPage;
