import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { Stack } from '@src/components/Layouts';
import { UserApp } from '@src/models/UserApp';
import { WithShellLayout } from '@src/components/Layouts/WithShellLayout';
import { apiClientV1, apiClientV2 } from '@src/api/client';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { UsersAppTable } from '@src/components/Settings/UsersApp/UsersAppTable';
import { Text } from '@src/components/Text';
import { UsersAppSearch } from '@src/components/Settings/UsersApp/UsersAppSearch';

function UserAppSettingsPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Text color="static.black" fontSize="bigText" fontWeight="bold">
          App Users
        </Text>
      </Stack>
      <UsersAppSearch />
      <UsersAppTable />
    </>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const result = await UserApp.checkIfNotLoggedIn(ctx, {
    destination: '/',
    permanent: false,
  });

  if (result?.redirect) {
    return {
      redirect: result?.redirect,
    };
  }

  const {
    query: { page = 1, limit = '10', offset = '0', search = '' },
  } = ctx;

  const token = UserApp.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.users, limit, offset, search],
    () =>
      UserApp.getUsers({
        page: String(page),
        limit: String(limit),
        searchValue: String(search),
      })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

UserAppSettingsPage.getLayout = WithShellLayout;

export default UserAppSettingsPage;
