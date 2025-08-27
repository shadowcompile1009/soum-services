import React from 'react';

import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';
import { AccordionItem } from '@/components/Accordion';
import { IResponseWalletSetting } from '@/models/Setting';
import { Switch } from '@/components/Switch';

import { SettingsConfig } from './SettingsConfig';

interface SettingsAccordionItemProps {
  heading: string;
  settings: IResponseWalletSetting[];
  onChange: (settingsId: string) => void;
}

export function SettingsAccordionItem(props: SettingsAccordionItemProps) {
  const { heading, settings, onChange } = props;

  function handleOnChange(evt: React.ChangeEvent<HTMLInputElement>) {
    onChange(evt.target.id);
  }
  return (
    <AccordionItem heading={heading}>
      <Stack direction="vertical" gap="20">
        {settings.map((setting) => (
          <Box key={setting.id}>
            <Stack direction="horizontal" justify="space-between">
              <Box>
                <Stack direction="vertical" gap="4">
                  <Text
                    fontWeight="semibold"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {setting.display}
                  </Text>
                  <Text
                    fontWeight="regular"
                    fontSize="smallText"
                    color="static.grays.10"
                  >
                    {setting.description}
                  </Text>
                </Stack>
              </Box>
              <Box>
                <Switch
                  onClick={handleOnChange}
                  id={setting.id}
                  defaultOn={setting.value}
                />
              </Box>
            </Stack>
            {setting.configurable && (
              <SettingsConfig settingsId={setting.id} config={setting.config} />
            )}
          </Box>
        ))}
      </Stack>
    </AccordionItem>
  );
}
