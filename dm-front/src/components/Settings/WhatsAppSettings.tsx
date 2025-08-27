import { ChangeEvent, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Select, { SingleValue } from 'react-select';
import { styles } from '@/components/Shared/commonSelectStyles';

import { toast } from '@/components/Toast';
import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Setting, templateOptions } from '@/models/Setting';
import { Loader } from '@/components/Loader';
import { AccordionItem } from '@/components/Accordion';
import { Switch } from '@/components/Switch';

type TemplateName =
  | 'seller_processing'
  | 'buyer_processing'
  | 'seller_publishing'
  | 'seller_extension_whatsapp_message';

export function WhatsAppSettings() {
  const [templateName, setTemplateName] = useState<any>();

  const [toggleStatus, setToggleStatus] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(
    [QUERY_KEYS.whatsAppSettings],
    () => Setting.getWhatsAppSettings(),
    {
      onSuccess(data) {
        setTemplateName({
          displayName: data?.seller_processing?.templateName,
          value: data?.seller_processing?.templateName,
        });
      },
      onError(error: any) {
        if (error?.response?.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
        }
      },
    }
  );

  const settingsMutation = useMutation(Setting.updateWhatsAppSettings, {
    onSuccess() {
      queryClient.invalidateQueries([QUERY_KEYS.whatsAppSettings]);
      toast.success(toast.getMessage('onUpdateWhatsappSettingSuccess'));
      setTimeout(() => {
        setToggleStatus(false);
        // till validate invalidateQueries query and set new values
      }, 2000);
    },
    onError() {
      queryClient.invalidateQueries([QUERY_KEYS.whatsAppSettings]);
      toast.error(toast.getMessage('onUpdateWhatsappSettingError'));
      setTimeout(() => {
        setToggleStatus(false);
        // till validate invalidateQueries query and set new values
      }, 2000);
    },
  });

  function handleOnChange(evt: ChangeEvent<HTMLInputElement>) {
    setToggleStatus(true);
    const formData = {
      buyer_processing: data?.buyer_processing?.value as boolean,
      seller_processing: data?.seller_processing?.value as boolean,
      seller_publishing: data?.seller_publishing?.value as boolean,
      dispute_message: data?.dispute_message?.value as boolean,
      seller_detection_nudge: data?.seller_detection_nudge?.value as boolean,
      deletion_nudge_unresponsiveness_deactivation: data
        ?.deletion_nudge_unresponsiveness_deactivation?.value as boolean,
      seller_extension_whatsapp_message: data?.seller_extension_whatsapp_message
        ?.value as boolean,
      [evt.target.id as TemplateName]: evt.target.checked,
      templateName: templateName?.value as string,
    };

    settingsMutation.mutate(formData);
  }

  function onChangeTemplate(newValue: SingleValue<any>) {
    setTemplateName(newValue);
  }

  return isLoading ? (
    <Loader border="static.blue" />
  ) : (
    <Box cssProps={{ maxWidth: 280 }}>
      <AccordionItem heading="WhatsApp Automation Settings">
        <Stack direction="vertical" gap="20">
          {/* Buyer Processing - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Buyer Processing
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automation for buyer transactional new order messages
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={toggleStatus}
                id="buyer_processing"
                defaultOn={data?.buyer_processing?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* Buyer Processing - End */}
          {/* Seller Processing - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Seller Processing
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automation for seller transactional new order messages
                </Text>
                <Box>
                  <Select
                    isDisabled={false}
                    // check useState if value not return from backside
                    value={templateName}
                    // @ts-ignore
                    styles={styles}
                    onChange={onChangeTemplate}
                    placeholder="---"
                    isLoading={false}
                    options={templateOptions}
                    getOptionLabel={(option) => option.displayName}
                    getOptionValue={(option) => option.value}
                    isSearchable={true}
                    id="whatsapp-template-select"
                    instanceId="whatsapp-template-select"
                  />
                </Box>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={toggleStatus}
                id="seller_processing"
                defaultOn={data?.seller_processing?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* Seller Processing - End */}
          {/* Seller Publishing - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Seller Publishing
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automation for seller listing publishing messages
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={toggleStatus}
                id="seller_publishing"
                defaultOn={data?.seller_publishing?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* Seller Publishing - End */}
          {/* Dispute Message - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Dispute Message
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automation for buyer dispute messages
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={toggleStatus}
                id="dispute_message"
                defaultOn={data?.dispute_message?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* Dispute Message - End */}
          {/* seller_extension_whatsapp Message - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Seller Extension Message
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automate notifying sellers with delayed shipping
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={toggleStatus}
                id="seller_extension_whatsapp_message"
                defaultOn={data?.seller_extension_whatsapp_message?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* seller_extension_whatsapp Message - End */}
          {/* seller_detection_nudge Message - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Seller Deletion Nudge
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automate Seller Deletion Nudge message
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={toggleStatus}
                id="seller_detection_nudge"
                defaultOn={data?.seller_detection_nudge?.value}
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* seller_detection_nudge Message - End */}
          {/* deletion_nudge_unresponsiveness_deactivation Message - Start */}
          <Stack direction="horizontal" justify="space-between">
            <Box>
              <Stack direction="vertical" gap="4">
                <Text
                  fontWeight="semibold"
                  fontSize="baseText"
                  color="static.grays.500"
                >
                  Deletion Nudge Unresponsiveness Deactivation
                </Text>
                <Text
                  fontWeight="regular"
                  fontSize="smallText"
                  color="static.grays.10"
                >
                  Automate Deletion Nudge Unresponsiveness Deactivation
                </Text>
              </Stack>
            </Box>
            <Box>
              <Switch
                disabled={toggleStatus}
                id="deletion_nudge_unresponsiveness_deactivation"
                defaultOn={
                  data?.deletion_nudge_unresponsiveness_deactivation?.value
                }
                onClick={handleOnChange}
              />
            </Box>
          </Stack>
          {/* deletion_nudge_unresponsiveness_deactivation Message - End */}
        </Stack>
      </AccordionItem>
    </Box>
  );
}
