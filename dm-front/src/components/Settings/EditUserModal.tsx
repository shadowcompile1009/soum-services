import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Select from 'react-select';

import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { FormField, Input } from '@/components/Form';
import { toast } from '@/components/Toast';

import { CommonModal } from '@/components/Modal';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { IRole, User } from '@/models/User';
import { EditUserDTO } from '@/types/dto';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function EditUserModal(props: EditUserModalProps) {
  const queryClient = useQueryClient();
  const { isOpen, onClose } = props;

  const router = useRouter();
  const { query } = router;
  const { userId, username, email, phoneNumber, role } = query;

  // role selected from dropdown
  const [roleSelection, setRoleSelection] = useState<IRole>();

  const { isLoading, data } = useQuery(
    [QUERY_KEYS.rolesList],
    () => User.getRoles(),
    { staleTime: Infinity, cacheTime: Infinity }
  );
  const mappedRoles = useMemo(() => User.mapRoles(data), [data]);

  // prevent render issue by run only one time
  useEffect(() => {
    if (mappedRoles) {
      const defaultRole =
        mappedRoles.filter((roles) => role == roles?.displayName)[0] || null;
      setRoleSelection(defaultRole);
    }
  }, [mappedRoles, role]);

  const editUserMutation = useMutation(User.editUser, {
    onSuccess() {
      queryClient.invalidateQueries([QUERY_KEYS.users]);
      toast.success(toast.getMessage('onEditUserSuccessfully'));
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
        toast.error(toast.getMessage('onEditUserError'));
      }
    },
  });

  async function onChangeRole(role: IRole) {
    setRoleSelection(role);
  }

  async function submitEditInfo(formValues: EditUserDTO) {
    await editUserMutation.mutate(formValues);
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
              Edit User
            </Text>
          </Stack>
          {/* Heading - End */}
          {/* Add User Form - Start */}
          <Stack direction="vertical" gap="24">
            <form id="edit-user">
              <Stack direction="horizontal" gap="20">
                {/* Left  - Start */}
                <Stack direction="vertical" gap="10" flex="1">
                  <FormField label="User Name" htmlFor="user-name">
                    <Input
                      id="user-name"
                      autoComplete="off"
                      disabled={true}
                      value={username}
                    />
                  </FormField>
                  <FormField label="Phone number" htmlFor="user-phone-number">
                    <Input
                      id="user-phone-number"
                      autoComplete="off"
                      disabled={true}
                      value={phoneNumber}
                    />
                  </FormField>

                  <Box cssProps={{ marginTop: 'auto' }}>
                    <Button
                      form="edit-user"
                      type="button"
                      variant="filled"
                      onClick={() =>
                        submitEditInfo({
                          //@ts-ignore
                          id: userId,
                          roleId: roleSelection?.roleId,
                        })
                      }
                    >
                      Submit
                    </Button>
                  </Box>
                </Stack>
                {/* Left  - End */}
                {/* Right  - Start */}
                <Stack direction="vertical" gap="10" flex="1">
                  <FormField label="User Email" htmlFor="user-email">
                    <Input
                      id="user-email"
                      autoComplete="off"
                      disabled={true}
                      value={email}
                    />
                  </FormField>
                  <FormField label="User Role" htmlFor="role">
                    <Select
                      isDisabled={false}
                      value={roleSelection}
                      onChange={($event: any) => onChangeRole($event)}
                      id="role"
                      placeholder="--"
                      isLoading={isLoading}
                      options={mappedRoles}
                      getOptionLabel={(option) => option.displayName}
                      getOptionValue={(option) => option.roleId}
                      isSearchable={true}
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
