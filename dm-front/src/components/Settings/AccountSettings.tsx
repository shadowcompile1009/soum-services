import { useQuery } from '@tanstack/react-query';

import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';
import { AccordionItem } from '@/components/Accordion';
import { Switch } from '@/components/Switch';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Setting } from '@/models/Setting';
import { Loader } from '@/components/Loader';

export function AccountSettings() {
  const { isLoading, data } = useQuery([QUERY_KEYS.multiFactorStatus], () =>
    Setting.getMultiFactorAuthStatus()
  );

  return isLoading ? (
    <Loader border="static.blue" />
  ) : (
    <Box cssProps={{ maxWidth: 280 }}>
      <AccordionItem heading="Two-Factor Authentication (2FA)">
        <Stack direction="vertical" gap="20">
          {/* Two-Factor Authentication (2FA) */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Enable two-factor authentication
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Allows enabling or disabling two-factor authentication
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch id="mfa_status" defaultOn={data?.mfaStatus} disabled />
            </Box>
          </Stack>
        </Stack>
      </AccordionItem>
    </Box>
  );
}
