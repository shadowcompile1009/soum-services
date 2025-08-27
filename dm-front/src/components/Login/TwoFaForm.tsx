import ReactInputVerificationCode from 'react-input-verification-code';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';

import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { VerifyTotpDTO } from '@/types/dto';
import { Loader } from '@/components/Loader';

const schema = yup.object().shape({
  mfaCode: yup.string().required('TOTP is required'),
});

interface TwoFaFormProps {
  userId?: string;
  handleOnSubmit: (formValues: VerifyTotpDTO) => void;
  isLoading: boolean;
}

export function TwoFaForm(props: TwoFaFormProps) {
  const { userId, handleOnSubmit: onSubmit, isLoading } = props;
  const { control, handleSubmit } = useForm<VerifyTotpDTO>({
    resolver: yupResolver(schema),
    defaultValues: {
      userId,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="verify-totp-form">
      <Stack direction="vertical" gap="18">
        <Text
          fontWeight="semibold"
          fontSize="headingTwo"
          color="static.black"
          textAlign="center"
        >
          Two-Factor Authentication
        </Text>
        <Text
          fontWeight="baseSubtitle"
          fontSize="baseSubtitle"
          color="static.gray"
          textAlign="center"
        >
          Open the Google Authenticator app on your phone and enter the
          generated code.
        </Text>
        <Box
          className="totp-input"
          cssProps={{
            marginRight: '-100%',
            marginLeft: '-100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Controller
            control={control}
            name="mfaCode"
            render={({ field: { onChange, value } }) => (
              <ReactInputVerificationCode
                length={6}
                autoFocus
                value={value}
                onChange={onChange}
              />
            )}
          />
        </Box>
        <Box cssProps={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            disabled={isLoading}
            form="verify-totp-form"
            type="submit"
            variant="filled"
          >
            {isLoading && <Loader border="static.blue" />}
            Confirm
          </Button>
        </Box>
      </Stack>
    </form>
  );
}
