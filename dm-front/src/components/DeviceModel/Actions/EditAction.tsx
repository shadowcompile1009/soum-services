import NextLink from 'next/link';

import { EditIcon } from '@/components/Settings/EditIcon';
import { IconContainer } from '@/components/Shared/IconContainer';

import { ActionProps } from './Actions';

const EditAction = (props: ActionProps) => {
  const { deviceModel } = props;

  const pathName = `/addons/${deviceModel.id}`;
  return (
    <NextLink href={{ pathname: pathName }} passHref>
      <IconContainer>
        <EditIcon />
      </IconContainer>
    </NextLink>
  );
};

export default EditAction;
