import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { toast } from '@/components/Toast';
import { PaymentLogs } from '@/models/PaymentLogs';

interface usePaymentLogsDataProps {
  limit: string;
  offset: string;
  mobileNumber: string;
  paymentErrorId: string;
  soumNumber: string;
}

export function usePaymentLogsData(props: usePaymentLogsDataProps) {
  const {
    limit,
    offset,
    mobileNumber,
    paymentErrorId = '',
    soumNumber = '',
  } = props;

  let queryKey = [
    QUERY_KEYS.paymentLogs,
    limit,
    offset,
    mobileNumber,
    paymentErrorId,
    soumNumber,
  ];

  const { isFetching, isLoading, isSuccess, isError, data } = useQuery(
    queryKey,
    () =>
      PaymentLogs.getPaymentHistory({
        limit,
        offset,
        mobileNumber,
        paymentErrorId,
        soumNumber,
      }),
    {
      onError(error: any) {
        if (error?.response?.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
          return;
        }
        toast.error(toast.getMessage('onListPaymentLogsError'));
      },
    }
  );

  return {
    isFetching,
    isLoading,
    isSuccess,
    isError,
    paymentLogs: data?.data,
    total: data?.total,
    limit: data?.limit,
    offset: offset,
  };
}
