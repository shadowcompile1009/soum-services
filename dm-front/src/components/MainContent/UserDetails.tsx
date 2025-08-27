import Image from 'next/image';
import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';
import { parseCookies } from 'nookies';

export default function UserDetails() {
  const cookies = parseCookies();
  const name = cookies['x-user-name'];
  const roleName = cookies['x-user-roleName'];
  return (
    <Stack direction="horizontal" gap="10" align="center">
      <Box cssProps={{ height: 36, width: 36 }}>
        <Image
          src="/assets/images/dark_soum.jpg"
          width="100%"
          height="100%"
          objectFit="cover"
          alt="Soum logo in Black"
        />
      </Box>
      <Box>
        <Text fontSize="baseText" fontWeight="regular" color="static.blues.500">
          {name}
        </Text>
        <Text fontSize="smallSubtitle" fontWeight="regular" color="static.gray">
          {roleName}
        </Text>
      </Box>
    </Stack>
  );
}
