import { UserApp } from '@src/models/UserApp';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { toast } from '@src/components/Toast';
import { QUERY_KEYS } from '@src/constants/queryKeys';

export function useUsersApp() {
  const router = useRouter();
  const { limit = '20', search = '', page = '1' } = router.query;

  return useQuery(
    [QUERY_KEYS.usersApp, limit, page, search],
    () => {
      return UserApp.getUsers({
        limit: String(limit),
        page: String(page),
        searchValue: String(search),
      });
    },
    {
      onError(error: any) {
        if (error?.response?.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
        }
      },
      retry: false,
    }
  );
}
