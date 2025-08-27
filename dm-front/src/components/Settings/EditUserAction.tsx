import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { EditIcon } from '../Shared/EditIcon';

const EditUserActionLink = styled.a(() =>
  css({
    color: 'static.grays.10',
    cursor: 'pointer',
    '&:hover': {
      color: 'static.blue',
    },
  })
);

interface EditUserActionProps {
  userId: string;
  username: string;
  phoneNumber: string;
  email: string;
  modalName: string;
  role: string;
}

export function EditUserAction(props: EditUserActionProps) {
  const { userId, username, modalName, phoneNumber, email, role } = props;

  const router = useRouter();
  const { query, pathname } = router;
  return (
    <NextLink
      shallow
      href={{
        pathname,
        query: {
          ...query,
          modalName,
          userId,
          username,
          phoneNumber,
          email,
          role,
        },
      }}
      passHref
    >
      <EditUserActionLink>
        <EditIcon />
      </EditUserActionLink>
    </NextLink>
  );
}
