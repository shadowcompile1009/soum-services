import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { IconLink } from '@/components/Shared/IconLink';
import { EyeIcon } from '@/components/Shared/EyeIcon';

import { ActionProps } from './Actions';

export function ListingDetailsLink(props: ActionProps) {
  const router = useRouter();
  const currentTab = router.asPath.split('/').pop();
  const { listing } = props;
  const pathname = `/listing/${listing.productId}`;

  return (
    <NextLink
      href={{
        pathname: pathname,
        query: {
          tab: currentTab,
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
