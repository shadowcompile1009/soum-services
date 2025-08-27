import { useEffect, useMemo, useState } from 'react';

import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import css from '@styled-system/css';

import { User } from '@src/models/User';
import { toast } from '@src/components/Toast';
import { QUERY_KEYS } from '@src/constants/queryKeys';

import { UserAppEditModal } from './UserAppEditModal/UserAppEditModal';
import { EditUserAppIcon } from './EditUserAppIcon';
import { useUserAppDetails } from './hooks/useUserAppDetails';
import { formDefaultValues } from './UserAppEditModal/constants';

import { FormState } from './UserAppEditModal/types';

const EditUserAppActionLink = styled.a(() =>
  css({
    color: 'static.grays.10',
    cursor: 'pointer',
    '&:hover': {
      color: 'static.blue',
    },
  })
);

export function EditUserAppAction({ userId }: { userId: string }) {
  const router = useRouter();
  const { query, pathname } = router;
  const { userId: userIdFromQuery } = query;

  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useUserAppDetails(
    userId,
    userIdFromQuery as string
  );

  const modalIsOpen = useMemo(() => {
    if (!isLoading && isOpen) {
      return true;
    }

    return false;
  }, [isLoading, isOpen]);

  const userDetails = data;

  const { control, watch, setValue, handleSubmit, reset } = useForm<FormState>({
    defaultValues: formDefaultValues(userDetails),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (userDetails && isInitialLoad) {
      reset(formDefaultValues(userDetails));
      setIsInitialLoad(false);
    }
  }, [userDetails]);

  const handleClose = () => {
    const newQuery = { ...query };
    delete newQuery?.userId;
    router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );

    reset(formDefaultValues(userDetails));
    setIsInitialLoad(true);
    setIsOpen(false);
  };

  const editAppUserMutation = useMutation(
    (formValues: FormState) => User.editAppUser(formValues, userId),
    {
      onSuccess() {
        queryClient.invalidateQueries([QUERY_KEYS.usersApp, userId]);
        toast.success(toast.getMessage('onEditUserAppSuccessfully'));

        handleClose();
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
    }
  );

  const onSubmit = async (data: FormState) => {
    await editAppUserMutation.mutate(data);
  };

  return (
    <>
      <NextLink
        shallow
        href={{
          pathname,
          query: {
            ...query,
            userId: userId,
          },
        }}
        passHref
      >
        <EditUserAppActionLink onClick={() => setIsOpen(true)}>
          <EditUserAppIcon />
        </EditUserAppActionLink>
      </NextLink>

      <UserAppEditModal
        isOpen={modalIsOpen}
        onClose={handleClose}
        onSubmit={onSubmit}
        userDetails={userDetails}
        control={control}
        watch={watch}
        setValue={setValue}
        handleSubmit={handleSubmit}
        isInitialLoad={isInitialLoad}
      />
    </>
  );
}
