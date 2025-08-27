import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { Wallet } from '@/models/Wallet';

import { QUERY_KEYS } from '@/constants/queryKeys';

export function useWalletManagementTable() {
  const router = useRouter();
  const { limit = '10', offset = '0', search = '' } = router.query;
  return useQuery([QUERY_KEYS.walletList, limit, offset, search], () =>
    Wallet.getWalletManagementList({
      limit: String(limit),
      offset: String(offset),
      search: String(search),
    })
  );
}
