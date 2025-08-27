import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { TransactionHistory } from '@src/models/TransactionHistory';
import { QUERY_KEYS } from '@src/constants/queryKeys';

export function useTransactionHistory() {
  const router = useRouter();
  const { limit = '50', offset = '0', search = '' } = router.query;

  return useQuery([QUERY_KEYS.transactionHistory, limit, offset, search], () =>
    TransactionHistory.getTransactionHistoryList({
      limit: String(limit),
      offset: String(offset),
      search: String(search),
    })
  );
}
