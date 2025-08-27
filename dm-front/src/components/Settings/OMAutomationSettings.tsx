import { ChangeEvent, useState } from 'react';
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

type OMAutomationName =
  | 'confirm_unavailable'
  | 'refund'
  | 'await_shipping_pickup'
  | 'backlog_unshipped_orders'
  | 'backlog_unpicked_up_orders'
  | 'backlog_intransit_orders'
  | 'refund_item_unavailable'
  | 'refund_confirmed_timeout'
  | 'setting_payout_status_change_automation'
  | 'setting_item_delivered_automation';

export function OMAutomationSettings() {
  const [omToggleStatus, setOMToggleStatus] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery(
    [QUERY_KEYS.omAutomationSettings],
    () => Setting.getOMAutomationSettings(),
    {
      onSuccess() {},
      onError(error: any) {
        if (error?.response?.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
        }
      },
    }
  );

  const omAutomationSettingsMutation = useMutation(
    Setting.updateOMAutomationSettings,
    {
      onSuccess() {
        queryClient.invalidateQueries([QUERY_KEYS.omAutomationSettings]);
        toast.success(toast.getMessage('onUpdateOMAutomationSettingSuccess'));
        setTimeout(() => {
          setOMToggleStatus(false);
          // till validate invalidateQueries query and set new values
        }, 2000);
      },
      onError() {
        queryClient.invalidateQueries([QUERY_KEYS.omAutomationSettings]);
        toast.error(toast.getMessage('onUpdateOMAutomationSettingError'));
        setTimeout(() => {
          setOMToggleStatus(false);
          // till validate invalidateQueries query and set new values
        }, 2000);
      },
    }
  );

  function handleOnChange(evt: ChangeEvent<HTMLInputElement>) {
    setOMToggleStatus(true);
    const formData = {
      confirm_unavailable: data?.confirm_unavailable?.value as boolean,
      refund: data?.refund?.value as boolean,
      await_shipping_pickup: data?.await_shipping_pickup?.value as boolean,
      backlog_unshipped_orders: data?.backlog_unshipped_orders
        ?.value as boolean,
      backlog_unpicked_up_orders: data?.backlog_unpicked_up_orders
        ?.value as boolean,
      backlog_intransit_orders: data?.backlog_intransit_orders
        ?.value as boolean,
      refund_item_unavailable: data?.refund_item_unavailable?.value as boolean,
      refund_confirmed_timeout: data?.refund_confirmed_timeout
        ?.value as boolean,
      setting_payout_status_change_automation: data
        ?.setting_payout_status_change_automation?.value as boolean,
      setting_item_delivered_automation: data
        ?.setting_item_delivered_automation?.value as boolean,
      confirm_available: data?.confirm_available?.value as boolean,
      [evt.target.id as OMAutomationName]: evt.target.checked,
    };

    omAutomationSettingsMutation.mutate(formData);
  }

  return isLoading ? (
    <Loader border="static.blue" />
  ) : (
    <Box cssProps={{ maxWidth: 280 }}>
      <AccordionItem heading="OM 2.0 Automation Settings">
        <Stack direction="vertical" gap="20">
          {/* confirm_unavailable - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Confirmed Unavailable
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automatically move orders which are confirmed unavailable to
                  refund to buyer and set the NCT reason
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={omToggleStatus}
                id="confirm_unavailable"
                defaultOn={data?.confirm_unavailable?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* confirm_unavailable - End */}
          {/* refund - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Refund at Confirmed Timeout
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automatically change orders to refund to buyer when 26 hours
                  have passed without confirmation
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={omToggleStatus}
                id="refund"
                defaultOn={data?.refund?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* refund - End */}
          {/* await_shipping_pickup - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Await Shipping & Await Pickup
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automatically move orders to awaiting to ship or to pickup
                  after confirmation
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={omToggleStatus}
                id="await_shipping_pickup"
                defaultOn={data?.await_shipping_pickup?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* await_shipping_pickup- End */}
          {/* backlog_unshipped_orders - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Backlog Unshipped Orders
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automatically move orders to backlog when they are not shipped
                  in time
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={omToggleStatus}
                id="backlog_unshipped_orders"
                defaultOn={data?.backlog_unshipped_orders?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* backlog_unshipped_orders - End */}
          {/* backlog_unpicked_up_orders - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Backlog Unpicked Up Orders
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automatically move orders to backlog when they are not picked
                  up in time
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={omToggleStatus}
                id="backlog_unpicked_up_orders"
                defaultOn={data?.backlog_unpicked_up_orders?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* backlog_unpicked_up_orders - End */}
          {/* backlog_intransit_orders - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Backlog In Transit Orders
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Backlog orders which are not deliverd in time automation
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={omToggleStatus}
                id="backlog_intransit_orders"
                defaultOn={data?.backlog_intransit_orders?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* backlog_intransit_orders - End */}
          {/* refund_item_unavailable - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Automatic Refund for Item Unavailable
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automatic refund when item is unavailable
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={omToggleStatus}
                id="refund_item_unavailable"
                defaultOn={data?.refund_item_unavailable?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* refund_item_unavailable - End */}
          {/* refund_confirmed_timeout - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Automatic Refund for Confirmed Timeout
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automatic refund when item is confirmed timeout
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={omToggleStatus}
                id="refund_confirmed_timeout"
                defaultOn={data?.refund_confirmed_timeout?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* refund_confirmed_timeout - End */}
          {/* setting_payout_status_change_automation - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Payout Status Change Automation
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  This automation automatically changes the order status to
                  Transferred after a payout has been submitted (does not apply
                  on Quick Payout sales)
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={omToggleStatus}
                id="setting_payout_status_change_automation"
                defaultOn={data?.setting_payout_status_change_automation?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* setting_payout_status_change_automation - End */}
          {/* setting_item_delivered_automation - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Automatic Payout to Seller
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  This automation automatically changes the order status to
                  Payout to seller after a product has been delivered
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={omToggleStatus}
                id="setting_item_delivered_automation"
                defaultOn={data?.setting_item_delivered_automation?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* setting_item_delivered_automation - End */}
        </Stack>
      </AccordionItem>
    </Box>
  );
}
