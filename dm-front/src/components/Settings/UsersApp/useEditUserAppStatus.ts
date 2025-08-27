import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UserApp } from '@src/models/UserApp';
import { toast } from '@src/components/Toast';
import { QUERY_KEYS } from '@src/constants/queryKeys';

export const useEditUserAppStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      updatedStatus,
    }: {
      userId: string;
      updatedStatus: string;
    }) => UserApp.changeStatus(userId, updatedStatus),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.usersApp]);
      toast.success(toast.getMessage('onEditUserStatusSuccessfully'));
    },
    onError(error: any) {
      if (error?.response?.data?.message) {
        const errorMessage = error?.response?.data?.message;
        try {
          const message = JSON.parse(errorMessage) || [];
          toast.error(message[0]?.msg);
        } catch (e) {
          toast.error(errorMessage);
        }
      } else {
        toast.error(toast.getMessage('onEditUserError'));
      }
    },
  });
};
