import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';

import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { FormField, Input } from '@/components/Form';
import { toast } from '@/components/Toast';

import { CommonModal } from '@/components/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { AddNewUserDTO } from '@/types/dto';
import { User } from '@/models/User';
import { RoleSelect } from './RoleSelect';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('User name is required')
    .min(6, 'User name should be atleast 6 characters long')
    .matches(/^(\d|\w)+$/, 'No special characters or spaces are allowed'),
  email: yup
    .string()
    .email('Must be a valid email')
    .typeError('Please enter a valid email')
    .required('User email is required')
    .matches(/^[A-Za-z0-9._%+-]+@soum\.sa$/, 'Only @soum.sa emails allowed'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/,
      'Invalid KSA number'
    ),
  password: yup
    .string()
    .required('Password is required')
    .max(20, 'Password cannot me more than 20 characters long')
    .min(8, 'Password should be atleast 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])/,
      'Must contain one uppercase and one lowercase'
    )
    .matches(/^(?=.*[!@#\$%\^&\*])/, 'Must contain one special case character')
    .matches(/^(?=.*[0-9])/, 'Must contain one number'),
  role: yup.object(),
});

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function UserModal(props: UserModalProps) {
  const queryClient = useQueryClient();
  const { isOpen, onClose } = props;

  const addUserMutation = useMutation(User.addUser, {
    onSuccess() {
      queryClient.invalidateQueries([QUERY_KEYS.users]);
      toast.success(toast.getMessage('onUserAddedSuccessfully'));
      onClose();
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
        toast.error(toast.getMessage('onUserAddedError'));
      }
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddNewUserDTO>({
    resolver: yupResolver(schema),
  });

  async function onSubmit(formValues: AddNewUserDTO) {
    await addUserMutation.mutate(formValues);
  }

  return (
    <CommonModal onClose={onClose} isOpen={isOpen}>
      <Box
        cssProps={{
          height: 380,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* <Loader size="48px" border="static.blue" marginRight="0" /> */}
        <Stack direction="vertical" gap="15" flex="1">
          {/* Heading - Start */}
          <Stack direction="vertical" align="center">
            <Text
              color="static.black"
              fontSize="bigText"
              fontWeight="semibold"
              as="span"
            >
              Add a New User
            </Text>
          </Stack>
          {/* Heading - End */}
          {/* Add User Form - Start */}
          <Stack direction="vertical" gap="24">
            <form id="add-user" onSubmit={handleSubmit(onSubmit)}>
              <Stack direction="horizontal" gap="20">
                {/* Left  - Start */}
                <Stack direction="vertical" gap="10" flex="1">
                  <FormField
                    label="User Name"
                    htmlFor="user-name"
                    error={errors.name?.message}
                  >
                    <Input
                      id="user-name"
                      autoComplete="off"
                      {...register('name')}
                    />
                  </FormField>
                  <FormField
                    label="Email"
                    htmlFor="user-email"
                    error={errors.email?.message}
                  >
                    <Input
                      id="user-email"
                      autoComplete="off"
                      {...register('email')}
                    />
                  </FormField>
                  <Box cssProps={{ width: '100%' }}>
                    <Controller
                      control={control}
                      name="role"
                      render={({ field: { onChange, value } }) => (
                        <RoleSelect
                          onChange={onChange}
                          value={value}
                          error={errors.role?.message}
                        />
                      )}
                    />
                  </Box>
                  <Box cssProps={{ marginTop: 'auto' }}>
                    <Button form="add-user" type="submit" variant="filled">
                      Submit User
                    </Button>
                  </Box>
                </Stack>
                {/* Left  - End */}
                {/* Right  - Start */}
                <Stack direction="vertical" gap="10" flex="1">
                  <FormField
                    label="Phone number"
                    htmlFor="user-phone-number"
                    error={errors.phoneNumber?.message}
                  >
                    <Input
                      id="user-phone-number"
                      autoComplete="off"
                      {...register('phoneNumber')}
                    />
                  </FormField>
                  <FormField
                    label="Password"
                    htmlFor="user-password"
                    error={errors.password?.message}
                  >
                    <Input
                      id="user-password"
                      autoComplete="off"
                      type="password"
                      {...register('password')}
                    />
                  </FormField>
                </Stack>
                {/* Right  - End */}
              </Stack>
            </form>
          </Stack>
          {/* Add User Form - End */}
        </Stack>
      </Box>
    </CommonModal>
  );
}
