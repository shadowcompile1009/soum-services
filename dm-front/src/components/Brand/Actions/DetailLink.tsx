import React from 'react';
import NextLink from 'next/link';
import { ActionProps } from './Actions';
import { EyeIcon } from '@/components/Shared/EyeIcon';
import { IconLink } from '@/components/Shared/IconLink';

const DetailLink = (props: ActionProps) => {
  const { brand, categoryId } = props;

  const pathName = `${categoryId}/models/${brand.id}`;
  return (
    <NextLink href={{ pathname: pathName }} passHref>
      <IconLink>
        <EyeIcon />
      </IconLink>
    </NextLink>
  );
};

export default DetailLink;
