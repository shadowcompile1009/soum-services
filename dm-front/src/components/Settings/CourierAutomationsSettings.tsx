import { ChangeEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Setting } from '@/models/Setting';
import { Loader } from '@/components/Loader';
import { AccordionItem } from '@/components/Accordion';
import { Switch } from '@/components/Switch';

type TemplateName = 'automationToggle' | 'pickupToggle';

export function CourierAutomationsSettings() {
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(
    [QUERY_KEYS.courierAutomations],
    () => Setting.getCourierAutomationsSettings(),
    {
      onError(error: any) {
        if (error?.response?.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
        }
      },
    }
  );

  const { isLoading: pickupIsLoading, data: pickupData } = useQuery(
    [QUERY_KEYS.pickupService],
    () => Setting.getPickupServiceSettings(),
    {
      onError(error: any) {
        if (error?.response?.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
        }
      },
    }
  );

  const settingsMutation = useMutation(
    Setting.updateCourierAutomationsSettings,
    {
      onSuccess() {
        queryClient.invalidateQueries([QUERY_KEYS.courierAutomations]);
        toast.success(
          toast.getMessage('onUpdateCourierAutomationSettingSuccess')
        );
      },
      onError() {
        queryClient.invalidateQueries([QUERY_KEYS.courierAutomations]);
        toast.error(toast.getMessage('onUpdateCourierAutomationSettingError'));
      },
    }
  );

  const pickupSettingsMutation = useMutation(
    Setting.updatePickupServiceSettings,
    {
      onSuccess() {
        queryClient.invalidateQueries([QUERY_KEYS.pickupService]);
        toast.success(toast.getMessage('onUpdatePickupSettingSuccess'));
      },
      onError() {
        queryClient.invalidateQueries([QUERY_KEYS.pickupService]);
        toast.error(toast.getMessage('onUpdatePickupSettingError'));
      },
    }
  );

  function handlePickupOnChange(evt: ChangeEvent<HTMLInputElement>) {
    const formData = {
      pickupToggle: pickupData?.pickupToggle?.value as boolean,
      [evt.target.id as TemplateName]: evt.target.checked,
    };

    pickupSettingsMutation.mutate(formData);
  }

  function handleOnChange(evt: ChangeEvent<HTMLInputElement>) {
    const formData = {
      automationToggle: data?.automationToggle?.value as boolean,
      pickupToggle: data?.pickupToggle?.value as boolean,
      [evt.target.id as TemplateName]: evt.target.checked,
    };

    settingsMutation.mutate(formData);
  }

  return isLoading || pickupIsLoading ? (
    <Loader border="static.blue" />
  ) : (
    <Box cssProps={{ maxWidth: 280 }}>
      <AccordionItem heading="SMSA Intransit and Delivered Automation">
        <Stack direction="vertical" gap="20">
          {/* automationToggle - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Automation Toggle
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automation of updating orders to intransit and delivered
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                id="automationToggle"
                defaultOn={data?.automationToggle?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* automationToggle - End */}
          {/* logistic service in-app - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  In-App Pick Toggle
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Display the logistic service in-app option
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                id="pickupToggle"
                defaultOn={pickupData?.pickupToggle?.value}
                onClick={handlePickupOnChange}
              />
            </Box>
          </Stack>
          {/* logistic service in-app - End */}
        </Stack>
      </AccordionItem>
    </Box>
  );
}
