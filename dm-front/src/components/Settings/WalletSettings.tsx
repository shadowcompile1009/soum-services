import { useMemo } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

import { SettingsAccordionItem } from '@/components/Settings/SettingsAccordionItem';
import { QUERY_KEYS } from '@/constants/queryKeys';
import {
  Setting,
  IResponseWalletSetting,
  WalletSettingType,
} from '@/models/Setting';
import { Loader } from '@/components/Loader';
import { toast } from '@/components/Toast';

interface SettingsProps {
  settings: Record<WalletSettingType, IResponseWalletSetting[]>;
}

const SettingsGrid = styled('div')(() => {
  return css({
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginRight: -10,
    marginLeft: -10,
  });
});

const SettingsItem = styled('div')(() => {
  return css({
    flexBasis: '33.33%',
    padding: 10,
    '@media (max-width: 960px)': {
      flexBasis: '100%',
    },
  });
});

function Settings(props: SettingsProps) {
  const { settings } = props;
  const types = Object.keys(settings) as WalletSettingType[];
  const queryClient = useQueryClient();

  const { mutate: walletSettingsMutation } = useMutation(
    Setting.toggleWalletSettings,
    {
      onSuccess() {
        queryClient.invalidateQueries([QUERY_KEYS.walletSettings]);
        toast.success(toast.getMessage('onToggleWalletSettingSuccess'));
      },
      onError() {
        queryClient.invalidateQueries([QUERY_KEYS.walletSettings]);
        toast.error(toast.getMessage('onToggleWalletSettingError'));
      },
    }
  );

  function handleSettingsToggle(settingsId: string) {
    walletSettingsMutation(settingsId);
  }

  return (
    <SettingsGrid>
      {types.map((type) => (
        <SettingsItem key={type}>
          <SettingsAccordionItem
            onChange={handleSettingsToggle}
            heading={type}
            settings={settings[type]}
          />
        </SettingsItem>
      ))}
    </SettingsGrid>
  );
}

export function WalletSettings() {
  const { isLoading, data } = useQuery([QUERY_KEYS.walletSettings], () =>
    Setting.getWalletSettings()
  );

  const mappedSettings = useMemo(() => Setting.mapWalletSettings(data), [data]);

  return isLoading ? (
    <Loader border="static.blue" />
  ) : (
    <Settings settings={mappedSettings} />
  );
}
