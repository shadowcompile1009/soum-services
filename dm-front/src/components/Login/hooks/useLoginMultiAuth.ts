import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { toast } from '@/components/Toast';
import { User } from '@/models/User';
import { VerifyTotpDTO } from '@/types/dto';

export function useLoginMultiAuth() {
  const router = useRouter();

  const { mutate, isLoading } = useMutation(User.verifyTotp);

  const handleSubmit = useCallback(
    async (formValues: VerifyTotpDTO) => {
      await mutate(formValues, {
        onSuccess() {
          router.push('/orders/new');
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
