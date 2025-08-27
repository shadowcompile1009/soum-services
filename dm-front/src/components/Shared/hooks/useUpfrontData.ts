import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/Toast';
import {
  ConsignmentStatus,
  SUBMODULE_UPFRONT_QUERY_KEYS_MAP,
  Upfronts,
} from '@/models/Upfronts';
import { QUERY_KEYS } from '@/constants/queryKeys';

interface useOrdersDataProps {
  submodule: ConsignmentStatus;
  limit: string;
  offset: string;
  search?: string;
}

export function useUpfrontData(props: useOrdersDataProps) {
  const { submodule, limit, offset, search } = props;

  const queryKey = [
    SUBMODULE_UPFRONT_QUERY_KEYS_MAP[
      submodule as keyof typeof SUBMODULE_UPFRONT_QUERY_KEYS_MAP
    ],
    submodule === ConsignmentStatus.CLOSED
      ? [QUERY_KEYS.closeFulfilledUpfront, QUERY_KEYS.closeUnfulfilledUpfront]
      : null,
    limit,
    offset,
    search,
  ];

  const {
    isFetching,
    isLoading,
    isSuccess,
    isError,
    data: upfronts,
    refetch: refetchUpfronts,
  } = useQuery(
    queryKey,
    async () => {
      // If submodule is Closed, fetch both closed-fulfilled and closed-unfulfilled data
      if (submodule === ConsignmentStatus.CLOSED) {
        const closedFulfilledData = await Upfronts.getUpfrontsList({
          submodule: ConsignmentStatus.CLOSED_FULFILLED,
          limit,
          offset,
          search,
        });

        const closedUnfulfilledData = await Upfronts.getUpfrontsList({
          submodule: ConsignmentStatus.CLOSED_UNFULFILLED,
          limit,
          offset,
          search,
        });

        const combinedData = {
          items: [
            ...(closedFulfilledData?.items || []),
            ...(closedUnfulfilledData?.items || []),
          ],
          total:
            (closedFulfilledData?.total || 0) +
            (closedUnfulfilledData?.total || 0),
          limit: parseInt(limit),
        };

        return combinedData;
      }

      // For non-closed statuses, fetch data normally
      const data = await Upfronts.getUpfrontsList({
        submodule,
        limit,
        offset,
        search,
      });

      // If submodule is Payout to Seller, handle existing combined data logic
      if (submodule === ConsignmentStatus.PAYOUT_TO_SELLER) {
        const processeingData = await Upfronts.getUpfrontsList({
          submodule: ConsignmentStatus.PAYOUT_PROCESSING,
          limit,
          offset,
          search,
        });

        const transferredData = await Upfronts.getUpfrontsList({
          submodule: ConsignmentStatus.TRANSFERRED,
          limit,
          offset,
          search,
        });

        const combinedData = {
          items: [
            ...(data?.items || []),
            ...(processeingData?.items || []),
            ...(transferredData?.items || []),
          ],
          total:
            (data?.total || 0) +
            (processeingData?.total || 0) +
            (transferredData?.total || 0),
          limit: parseInt(limit),
        };

        return combinedData;
      }

      return data;
    },
    {
      onError(error: any) {
        console.error('Query error:', error);
        if (error?.response?.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
          return;
        }
        toast.error(toast.getMessage('onListUpfontError'));
      },
    }
  );

  const mappedUpfronts = upfronts?.items
    ? Upfronts.mapUpfronts(upfronts.items)
    : [];

  return {
    isFetching,
    isLoading,
    isSuccess,
    isError,
    upfrontList: mappedUpfronts,
    total: upfronts?.total ?? 0,
    limit: upfronts?.limit ?? 0,
    offset: offset,
    refetchUpfronts,
  };
}
