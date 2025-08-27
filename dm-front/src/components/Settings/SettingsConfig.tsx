import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/Toast';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';
import { FormField, Input } from '@/components/Form';
import { IConfig, Setting } from '@/models/Setting';

import { EditIcon } from '../Shared/EditIcon';

interface ISettingsConfigProps {
  config: IConfig[];
  settingsId: string;
}

export function SettingsConfig(props: ISettingsConfigProps) {
  const { config, settingsId } = props;

  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm();

  const { mutate: updateWalletSettings, isLoading } = useMutation(
    Setting.updateWalletSettingsConfig,
    {
      onSuccess() {
        toast.success(toast.getMessage('onWalletConfigUpdateSuccess'));
        queryClient.invalidateQueries([QUERY_KEYS.walletSettings]);
      },
      onError() {
        toast.error(toast.getMessage('onWalletConfigUpdateError'));
      },
    }
  );

  async function onSubmit(formValues: any) {
    const formattedConfig = config.map((cfg) => ({
      ...cfg,
      value: formValues[cfg.name],
    }));

    updateWalletSettings({ settingsId, config: formattedConfig });
  }

  return (
    <Box paddingTop={7}>
      <form onSubmit={handleSubmit(onSubmit)} id={settingsId}>
        <Stack direction="vertical" gap="2">
          {config.map((cfg) => (
            <Box key={cfg.name}>
              <FormField label={cfg.display} htmlFor={cfg.name}>
                <Box cssProps={{ position: 'relative' }}>
                  <Input
                    disabled={isLoading}
                    style={{ paddingRight: '44px' }}
                    id={cfg.name}
                    placeholder={cfg.value as string}
                    {...register(cfg.name, {
                      value: cfg.value,
                      valueAsNumber: typeof cfg.value === 'number',
                    })}
                  />
                  <Box
                    as="span"
                    onClick={handleSubmit(onSubmit)}
                    cssProps={{
                      color: 'static.grays.10',
                      position: 'absolute',
                      display: 'flex',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      transition: 'color 200ms ease-in-out',
                      '&:hover': {
                        color: 'static.blue',
                      },
                    }}
                  >
                    <EditIcon />
                  </Box>
                </Box>
              </FormField>
            </Box>
          ))}
        </Stack>
      </form>
    </Box>
  );
}
