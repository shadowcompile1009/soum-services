import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/Toast';

import { Wallet } from '@/models/Wallet';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useWithdrawalDetails(walletID: string) {
  return useQuery(
    [QUERY_KEYS.requestDetails, walletID],
    () => Wallet.getWithdrawalRequestDetails(walletID),
    {
      onError() {
        toast.error(toast.getMessage('onGetWithdrawalDetailsError'));
      },
    }
  );
}
