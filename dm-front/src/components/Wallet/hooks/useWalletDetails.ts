import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/Toast';

import { Wallet } from '@/models/Wallet';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useWalletDetails(walletId: string) {
  const queryData = useQuery(
    [QUERY_KEYS.walletDetails, walletId],
    () => Wallet.getWalletDetails(walletId),
    {
      onError() {
        toast.error(toast.getMessage('onGetWalletDetailsError'));
      },
    }
  );

  return queryData;
}
