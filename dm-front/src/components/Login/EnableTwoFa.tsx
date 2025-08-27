import { useQuery } from '@tanstack/react-query';

import { Setting } from '@/models/Setting';
import { TwoFaForm } from '@/components/Login';
import { QRCode } from '@/components/QRCode';
import { useEnableMultiAuth } from '@/components/Login';
import { Stack } from '@/components/Layouts';
import { Loader } from '@/components/Loader';
import { toast } from '@/components/Toast';
import { QUERY_KEYS } from '@/constants/queryKeys';

interface EnableTwoFaProps {
  userId: string;
}

export function EnableTwoFa(props: EnableTwoFaProps) {
  const { userId } = props;

  const { data, isLoading } = useQuery(
    [QUERY_KEYS.qrCode],
    () => Setting.enableMultiFactor(userId),
    {
      onError() {
        toast.error(toast.getMessage('onEnableMultiFactorError'));
      },
    }
  );

  const { onSubmit: handleVerifyTotp, isLoading: mutationIsLoading } =
    useEnableMultiAuth();

  return isLoading && !data ? (
    <Stack justify="center">
      <Loader size="36px" border="static.blue" />
    </Stack>
  ) : (
    <Stack direction="vertical" gap="8" align="center">
      <QRCode qrcode={data?.qrCode as string} />
      <TwoFaForm
        userId={userId}
        isLoading={mutationIsLoading}
        handleOnSubmit={handleVerifyTotp}
      />
    </Stack>
  );
}
