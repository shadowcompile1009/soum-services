import { NextPageContext } from 'next';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { toast } from '@/components/Toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { NewOrdersTable } from '@/components/Order';
import { EOrderModules, Order } from '@/models/Order';
import { Stack } from '@/components/Layouts';
import { ExportCSV } from '@/components/ExportCSV';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { Csv } from '@/models/Csv';
import { SearchFilter } from '@/components/Shared/SearchFilter';

const breadcrumbRoutes = {
  orders: {
    title: BREADCRUMBS.ORDERS,
  },
  new: {
    title: BREADCRUMBS.NEW_ORDERS,
  },
};

function NewOrdersPage() {
  const { refetch, isFetching } = useQuery(
    [QUERY_KEYS.exportNewOrders],
    async () => Csv.getExportData(Order.exportNewOrders),
    {
      enabled: false,
      retry: 0,
      onError(error: any) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(toast.getMessage('onExportCsvError'));
        }
      },
    }
  );

  async function handleOnDownloadCSV() {
    const { data } = await refetch();
    if (data) {
      Csv.downloadFile({
        data,
        fileName: format(new Date(), 'yyyy/LL/dd - hh') + ' - New Orders',
        fileType: 'csv',
      });
    }
  }

  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
        <ExportCSV handleDownload={handleOnDownloadCSV} isLoading={isFetching}>
          Export new orders
        </ExportCSV>
      </Stack>
      <SearchFilter />
      <NewOrdersTable />
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

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.newOrders, limit, offset, search],
    () =>
      Order.getOrders({
        submodule: EOrderModules.NEW,
        limit: String(limit),
        offset: String(offset),
        search: String(search),
      })
  );

  await queryClient.prefetchQuery([QUERY_KEYS.orderStatuses], () =>
    Order.getOrderStatuses()
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

NewOrdersPage.getLayout = WithShellLayout;

export default NewOrdersPage;
