import NextLink from 'next/link';
import { ActionProps } from './Actions';
import { EyeIcon } from '@/components/Shared/EyeIcon';

const DetailLink = (props: ActionProps) => {
  const { deviceModel } = props;

  const pathName = `/addons/${deviceModel.id}`;
  return (
    <NextLink href={{ pathname: pathName }} passHref>
      <EyeIcon />
    </NextLink>
  );
};

export default DetailLink;
