import { Stack } from '@/components/Layouts';
import { Card } from '@/components/Card';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';

import { ImageRatingSetting } from './ImageRatingSetting';
import { UprankSetting } from './UprankSetting';
import { ProductActivationSetting } from './ProductActivationSetting';

export function Hr() {
  return (
    <Box as="hr" cssProps={{ borderColor: 'static.grays.500', margin: 0 }} />
  );
}

export function ListingSettingsHeading() {
  return (
    <Stack gap="5" align="center">
      <Text fontSize="baseText" color="static.blue" fontWeight="baseText">
        Listing settings
      </Text>
    </Stack>
  );
}

export function ListingSettings() {
  return (
    <Box cssProps={{ flex: 1 }}>
      <Card heading={<ListingSettingsHeading />}>
        <Stack direction="vertical" gap="5">
          <Stack justify="space-between" align="flex-start">
            <ImageRatingSetting />
            <UprankSetting />
          </Stack>
          <Hr />
          <ProductActivationSetting />
        </Stack>
      </Card>
    </Box>
  );
}
