import { useRouter } from 'next/router';
import { usePaymentLogsData } from '@/components/Order/hooks/usePaymentLogsData';

export function usePaymentLogsTable() {
  const router = useRouter();
  const {
    limit = '10',
    offset = '0',
    mobileNumber = '',
    paymentErrorId = '',
    soumNumber = '',
  } = router.query;

  return usePaymentLogsData({
    limit: String(limit),
    offset: String(offset),
    mobileNumber: String(mobileNumber),
    paymentErrorId: String(paymentErrorId),
    soumNumber: String(soumNumber),
  });
}
