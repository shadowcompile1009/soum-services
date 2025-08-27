import React from 'react';
import NextLink from 'next/link';
import { ActionProps } from './Actions';
import { EyeIcon } from '@/components/Shared/EyeIcon';
import { IconLink } from '@/components/Shared/IconLink';
import { CategoriesTypes } from '@/models/Category';

const DetailLink = (props: ActionProps) => {
  const { category, categoryType } = props;

  let pathName = `categories/${category.id}`;
  if (categoryType === CategoriesTypes.CATEGORY) {
    pathName = `brands/${category.id}`;
  }

  return (
    <NextLink href={{ pathname: pathName }} passHref>
      <IconLink>
        <EyeIcon />
      </IconLink>
    </NextLink>
  );
};

export default DetailLink;
