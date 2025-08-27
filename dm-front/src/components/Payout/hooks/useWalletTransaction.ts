import { useQuery } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Wallet } from '@/models/Wallet';

export function useWalletTransaction(orderId: string) {
  const queryData = useQuery(
    [QUERY_KEYS.walletOrderTransactions, orderId],
    () => Wallet.getOrderTransaction(orderId),
    {
      onError() {
        toast.error(toast.getMessage('onGetWalletTransactionError'));
      },
    }
  );

  return queryData;
}
