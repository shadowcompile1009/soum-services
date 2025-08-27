import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { EyeIcon } from '@/components/Shared/EyeIcon';
import { IconLink } from '@/components/Shared/IconLink';

interface WalletListActionProps {
  walletId: string;
  modalName: string;
}

export function WalletListAction(props: WalletListActionProps) {
  const { walletId, modalName } = props;
  const router = useRouter();
  const { query, pathname } = router;
  return (
    <NextLink
      shallow
      href={{
        pathname,
        query: {
          ...query,
          walletId,
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
