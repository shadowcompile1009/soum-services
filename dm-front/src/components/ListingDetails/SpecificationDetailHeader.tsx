import Image from 'next/image';
import { Box } from '../Box';
import { Stack } from '../Layouts';
import { OrderIcon } from '../Sidebar/OrderIcon';
import { Text } from '../Text';
import { Switch } from '../Switch';
import { Specification } from '../Frontliners/SpecificationReport';

interface Props {
  item: Specification;
  toggleClickHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SpecificationDetailHeader = ({ item, toggleClickHandler }: Props) => {
  return (
    <Stack direction="horizontal" gap="2" justify="space-between">
      <Box>
        <Stack direction="horizontal" gap="10" align="center">
          <Text
            fontWeight="regular"
            fontSize="baseText"
            color="static.grays.500"
          >
            {item.icon ? (
              <Image src={item.icon} width={24} height={24} alt="" />
            ) : (
              <OrderIcon />
            )}
          </Text>
          <Box>
            <Text
              fontWeight="regular"
              fontSize="baseText"
              color="static.grays.500"
            >
              {item.nameEn}
            </Text>
            <Text
              fontWeight="regular"
              fontSize="baseText"
              color="static.grays.500"
            >
              {item.nameAr}
            </Text>
          </Box>
        </Stack>
      </Box>
      <Box cssProps={{ alignContent: 'center' }}>
        <Switch
          data-specification-type={item.nameEn}
          id={item.nameEn}
          defaultOn={item.status}
          onClick={toggleClickHandler}
        />
      </Box>
    </Stack>
  );
};

export default SpecificationDetailHeader;
