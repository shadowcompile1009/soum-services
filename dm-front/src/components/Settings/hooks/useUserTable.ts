import { User } from '@/models/User';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { toast } from '@/components/Toast';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useUserTable() {
  const router = useRouter();
  const { limit = '10', offset = '0' } = router.query;
  return useQuery(
    [QUERY_KEYS.users, limit, offset],
    () => User.getUsers({ limit: String(limit), offset: String(offset) }),
    {
      onError(error: any) {
        if (error?.response?.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
        }
      },
    }
  );
}
