import NextLink from 'next/link';
import { ActionProps } from './Actions';
import { IconContainer } from '@/components/Shared/IconContainer';
import { DeleteIcon } from '@/components/Shared/DeleteIcon';

const DeleteAction = (props: ActionProps) => {
  const { deviceModel } = props;

  const pathName = `/addons/${deviceModel.id}`;
  return (
    <NextLink href={{ pathname: pathName }} passHref>
      <IconContainer color="static.red">
        <DeleteIcon />
      </IconContainer>
    </NextLink>
  );
};

export default DeleteAction;
