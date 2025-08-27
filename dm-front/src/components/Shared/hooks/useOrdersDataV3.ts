import { useQuery } from '@tanstack/react-query';
import { parse } from 'date-fns';

import { EOrderV3ModuleValues } from '@src/models/Order';
import { toast } from '@src/components/Toast';
import { OrderV3 } from '@src/models/Order';

interface useOrdersDataV3Props {
  submodule: EOrderV3ModuleValues;
  limit: string;
  offset: string;
  search?: string;
  statusId?: string;
  services?: string;
  start?: string;
  end?: string;
  operatingModel?: string;
  OrderTypeFilter?: string;
  sellerCategory?: string;
  sellerType?: string;
  orderType?: string;
  orderStatus?: string;
  disputeStatus?: string;
}

export function useOrdersDataV3(props: useOrdersDataV3Props) {
  const {
    submodule,
    limit,
    offset,
    search,
    statusId,
    services,
    start,
    end,
    operatingModel,
    orderType,
    sellerCategory,
    sellerType,
    orderStatus,
    disputeStatus,
  } = props;

  const { isLoading, isSuccess, isError, data } = useQuery(
    [
      submodule,
      limit,
      offset,
      search,
      statusId,
      services,
      start,
      end,
      operatingModel,
      orderType,
      sellerCategory,
      sellerType,
      orderStatus,
      disputeStatus,
    ],
    () => {
      const orderV3Params = {
        submodule,
        limit,
        offset,
        ...(search && { search }),
        ...(statusId && { statusId }),
        ...(start && {
          start: parse(
            String(start),
            'dd-MM-yyyy',
            new Date()
          ).toLocaleDateString('en-CA'),
        }),
        ...(end && {
          end: parse(String(end), 'dd-MM-yyyy', new Date()).toLocaleDateString(
            'en-CA'
          ),
        }),
        ...(operatingModel && { operatingModel }),
        ...(orderType && { orderType }),
        ...(sellerCategory && { sellerCategory }),
        ...(sellerType && { sellerType }),
        ...(orderStatus && { orderStatus }),
        ...(disputeStatus && { disputeStatus }),
      };

      return OrderV3.getOrdersV3({
        submodule: orderV3Params.submodule,
        limit: orderV3Params.limit,
        offset: orderV3Params.offset,
        search: orderV3Params.search,
        statusId: orderV3Params.statusId,
        startDate: orderV3Params.start,
        endDate: orderV3Params.end,
        operatingModel: orderV3Params.operatingModel,
        orderType: orderV3Params.orderType,
        sellerCategory: orderV3Params.sellerCategory,
        sellerType: orderV3Params.sellerType,
        orderStatus: orderV3Params.orderStatus,
        disputeStatus: orderV3Params.disputeStatus,
      });
    },

    {
      onError(error: any) {
        if (error?.response?.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
          return;
        }
        toast.error(toast.getMessage('onListOrdersError'));
      },
    }
  );

  return {
    isLoading,
    isSuccess,
    isError,
    orders: data?.orders,
    total: data?.paginationData.total,
    limit: limit,
    offset: offset,
  };
}
