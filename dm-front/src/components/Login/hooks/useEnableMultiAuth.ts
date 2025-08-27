import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { toast } from '@/components/Toast';
import { User } from '@/models/User';
import { VerifyTotpDTO } from '@/types/dto';

export function useEnableMultiAuth() {
  const router = useRouter();
  const { mutate, isLoading } = useMutation(User.verifyEnableMultiAuth);

  const handleSubmit = useCallback(
    async (formValues: VerifyTotpDTO) => {
      mutate(formValues, {
        onSuccess() {
          toast.success(toast.getMessage('onEnableMultiAuthSuccess'));
          router.reload();
        },
        onError() {
          toast.error(toast.getMessage('onTotpVerifyError'));
        },
      });
    },
    [mutate, router]
  );

  return {
    onSubmit: handleSubmit,
    isLoading,
  };
}
