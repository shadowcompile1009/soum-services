import NextLink from 'next/link';
import { ActionProps } from './Actions';
import { Text } from '@/components/Text';
import { useRouter } from 'next/router';

const AddonLink = (props: ActionProps) => {
  const router = useRouter();
  const { brandId, categoryId } = router.query;

  const { deviceModel } = props;

  const pathName = `/categories/brands/${categoryId}/models/${brandId}/addons/${deviceModel.id}`;

  return (
    <NextLink href={{ pathname: pathName }} passHref>
      <Text
        fontSize="smallText"
        fontWeight="smallText"
        color="static.blues.400"
        as="span"
        style={{
          cursor: 'pointer',
          padding: '5px',
          border: '1px solid #177AE2',
          borderRadius: '5px',
        }}
      >
        Add-ons
      </Text>
    </NextLink>
  );
};

export default AddonLink;
