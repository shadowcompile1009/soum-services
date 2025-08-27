import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { Wallet } from '@/models/Wallet';

import { QUERY_KEYS } from '@/constants/queryKeys';

export function useWalletTable() {
  const router = useRouter();
  const {
    limit = '10',
    offset = '0',
    search = '',
    statuses = '',
  } = router.query;
  return useQuery(
    [QUERY_KEYS.withdrawalRequests, limit, offset, search, statuses],
    () =>
      Wallet.getWalletList({
        limit: String(limit),
        offset: String(offset),
        search: String(search),
        statuses: String(statuses),
      })
  );
}
