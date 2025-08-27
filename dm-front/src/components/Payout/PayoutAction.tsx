import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { EyeIcon } from '@/components/Shared/EyeIcon';

const PayoutActionLink = styled.a(() =>
  css({
    color: 'static.grays.10',
    cursor: 'pointer',
    '&:hover': {
      color: 'static.blue',
    },
  })
);

interface PayoutActionProps {
  orderId: string;
  modalName: string;
  sellerId?: string;
}

export function PayoutAction(props: PayoutActionProps) {
  const { orderId, modalName, sellerId } = props;
  const router = useRouter();
  const { query, pathname } = router;
  return (
    <NextLink
      shallow
      href={{
        pathname,
        query: {
          ...query,
          orderId,
          sellerId,
          modalName,
        },
      }}
      passHref
    >
      <PayoutActionLink>
        <EyeIcon />
      </PayoutActionLink>
    </NextLink>
  );
}
