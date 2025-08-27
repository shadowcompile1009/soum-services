import { TwoFaForm } from './TwoFaForm';
import { EnableTwoFa } from './EnableTwoFa';
import { useLoginMultiAuth } from './hooks/useLoginMultiAuth';

interface LoginOrVerifyTwoFaProps {
  userId: string;
  isMFAEnabled: boolean;
}

export function LoginOrVerifyTwoFa(props: LoginOrVerifyTwoFaProps) {
  const { onSubmit: handleVerifyTotp, isLoading } = useLoginMultiAuth();
  const { userId, isMFAEnabled } = props;
  return isMFAEnabled ? (
    <TwoFaForm
      isLoading={isLoading}
      userId={userId}
      handleOnSubmit={handleVerifyTotp}
    />
  ) : (
    <EnableTwoFa userId={userId} />
  );
}
