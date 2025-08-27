import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { Breadcrumb } from '@/components/Breadcrumb';
import { Stack } from '@/components/Layouts';
import { UserModal, UserTable, EditUserModal } from '@/components/Settings';
import { Button } from '@/components/Button';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { QUERY_KEYS } from '@/constants/queryKeys';

const breadcrumbRoutes = {
  settings: {
    title: BREADCRUMBS.SETTING,
  },
  users: {
    title: BREADCRUMBS.USERS,
  },
};

function UserSettingsPage() {
  const router = useRouter();
  const { query, pathname } = router;
  const { modalName } = query;

  function handleModalClose() {
    const newQuery = {
      ...query,
    };
    delete newQuery?.userId;
    delete newQuery?.username;
    delete newQuery?.email;
    delete newQuery?.phoneNumber;
    delete newQuery?.modalName;
    router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  }

  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />

        <NextLink
          shallow
          href={{
            pathname,
            query: {
              ...query,
              modalName: 'addUser',
            },
          }}
          passHref
        >
          <Button type="button" variant="filled">
            Add User
          </Button>
        </NextLink>
      </Stack>

      <UserTable />

      {modalName === 'addUser' && (
        <UserModal
          onClose={handleModalClose}
          isOpen={modalName === 'addUser'}
        />
      )}

      {modalName === 'editUser' && (
        <EditUserModal
          onClose={handleModalClose}
          isOpen={modalName === 'editUser'}
        />
      )}
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
    query: { limit = '10', offset = '0' },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([QUERY_KEYS.users, limit, offset]),
    () =>
      User.getUsers({
        limit: String(limit),
        offset: String(offset),
      });

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

UserSettingsPage.getLayout = WithShellLayout;

export default UserSettingsPage;
