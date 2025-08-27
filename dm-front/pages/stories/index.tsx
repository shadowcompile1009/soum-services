import { Breadcrumb } from '@/components/Breadcrumb';
import { Stack } from '@/components/Layouts';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { StoriesTable } from '@/components/Stories';
import { Fragment, useState } from 'react';
import { Label } from '@/components/Form';
import { NextPageContext } from 'next';
import { User } from '@/models/User';
import { apiClientV1, apiClientV2 } from '@/api';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Story } from '@/models/Story';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { SearchFilter } from '@/components/Shared/SearchFilter';
import StoriesFilter from '@/components/Shared/StoriesFilter';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';

const breadcrumbRoutes = {
  stories: {
    title: BREADCRUMBS.STORIES,
  },
};

const StoriesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenOrderModal, setIsOpenOrderModal] = useState(false);

  const handleToggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleOrderModal = () => {
    setIsOpenOrderModal(!isOpenOrderModal);
  };

  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      <Stack direction="horizontal" justify="space-between" align="center">
        <Stack direction="vertical" gap="1" flex="1">
          <Text
            color="static.grays.500"
            fontSize="smallSubtitle"
            fontWeight="regular"
          >
            Stories
          </Text>
          <Text
            color="static.black"
            fontSize="bigSubtitle"
            fontWeight="semibold"
          >
            Reel Stories
          </Text>
        </Stack>
        <Stack direction="horizontal" justify="center" align="center" gap="10">
          <Button onClick={handleToggleOrderModal} variant="filled">
            Change Order
          </Button>
          <Button onClick={handleToggleModal} variant="filled">
            Add Stories
          </Button>
        </Stack>
      </Stack>
      <Stack direction="vertical" gap="5" style={{ marginTop: '20px' }}>
        <Label>Search</Label>
        <Stack direction="horizontal" gap="5">
          <SearchFilter placeholder="Enter stories name" limit={0} />
          <StoriesFilter />
        </Stack>
      </Stack>
      <StoriesTable
        isOpen={isOpen}
        isOpenOrderModal={isOpenOrderModal}
        setOpenModal={handleToggleModal}
        setOpenOrderModal={handleToggleOrderModal}
      />
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
    query: { limit = '10', page = '1', search = '', filterDate = '' },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.stories, limit, page, search, filterDate],
    () =>
      Story.getStories(
        Number(page),
        Number(limit),
        String(search),
        String(filterDate)
      )
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

StoriesPage.getLayout = WithShellLayout;

export default StoriesPage;
