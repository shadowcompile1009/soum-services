import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { FormField, Input } from '@/components/Form';
import { Button } from '@/components/Button';
import { SignInDTO } from '@/types/dto';
import { User } from '@/models/User';
import { toast } from '@/components/Toast';
import { Loader } from '@/components/Loader';

import { LoginOrVerifyTwoFa } from './LoginOrVerifyTwoFa';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export function LoginForm() {
  const [isMFAEnabled, setIsMFAEnabled] = useState({
    value: false,
    userId: '',
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInDTO>({ resolver: yupResolver(schema) });

  const loginMutation = useMutation(User.login);

  async function onSubmit(formValues: SignInDTO) {
    await loginMutation.mutate(formValues, {
      onSuccess({ data }) {
        setIsMFAEnabled({
          value: data.isMFAEnabled,
          userId: data.userId,
        });
      },
      onError() {
        toast.error(toast.getMessage('onLoginError'));
      },
    });
  }

  return (
    <Box cssProps={{ width: '100%' }}>
      {!isMFAEnabled.userId ? (
        <Stack direction="vertical" gap="24">
          <Text
            fontWeight="semibold"
            fontSize="headingTwo"
            color="static.black"
            textAlign="center"
          >
            Sign In
          </Text>
          <form onSubmit={handleSubmit(onSubmit)} id="login-form">
            <Stack direction="vertical" gap="16">
              <FormField
                label="Username"
                htmlFor="username"
                error={errors.username?.message}
              >
                <Input
                  id="username"
                  placeholder="Username"
                  autoComplete="off"
                  required
                  {...register('username')}
                />
              </FormField>
              <FormField
                label="Password"
                htmlFor="password"
                error={errors.password?.message}
              >
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  autoComplete="off"
                  required
                  {...register('password')}
                />
              </FormField>
            </Stack>
          </form>
          <Box cssProps={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              form="login-form"
              type="submit"
              variant="filled"
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading && <Loader border="static.blue" />}
              Sign In
            </Button>
          </Box>
        </Stack>
      ) : (
        <LoginOrVerifyTwoFa
          isMFAEnabled={isMFAEnabled.value}
          userId={isMFAEnabled.userId}
        />
      )}
    </Box>
  );
}
