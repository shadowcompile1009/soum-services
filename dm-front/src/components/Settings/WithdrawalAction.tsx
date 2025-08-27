import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { EyeIcon } from '@/components/Shared/EyeIcon';
import { IconLink } from '@/components/Shared/IconLink';

interface WithdrawalActionProps {
  walletID: string;
  modalName: string;
}

export function WithdrawalAction(props: WithdrawalActionProps) {
  const { walletID, modalName } = props;
  const router = useRouter();
  const { query, pathname } = router;
  return (
    <NextLink
      shallow
      href={{
        pathname,
        query: {
          ...query,
          walletID,
          modalName,
        },
      }}
      passHref
    >
      <IconLink>
        <EyeIcon />
      </IconLink>
    </NextLink>
  );
}
