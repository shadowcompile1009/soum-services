import { UserApp } from '@src/models/UserApp';
import { useQuery } from '@tanstack/react-query';

import { toast } from '@src/components/Toast';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { UserAppResponse } from './types';

export function useUserAppDetails(userId: string, userIdFromQuery: string) {
  return useQuery<UserAppResponse>(
    [QUERY_KEYS.usersApp, userId],
    () => UserApp.getUserDetails(userId),
    {
      onError(error: any) {
        if (error?.response?.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
        }
      },
      retry: false,
      enabled: userIdFromQuery === userId,
    }
  );
}
