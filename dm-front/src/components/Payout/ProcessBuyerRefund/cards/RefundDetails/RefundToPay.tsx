import { Control, Controller } from 'react-hook-form';

import { Box } from '@src/components/Box';
import { Stack } from '@src/components/Layouts/Stack';
import { Text } from '@src/components/Text';

import { Input } from './Input';
import { RefundFormValues } from './types';

export const RefundToPay = ({
  control,
  defaultValue,
}: {
  control: Control<RefundFormValues>;
  defaultValue?: number;
}) => {
  return (
    <Stack
      direction="vertical"
      align="flex-start"
      style={{ paddingBottom: '4px' }}
    >
      <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
        <Text fontWeight="bold" fontSize="baseText" color="static.black">
          Refund To Pay
        </Text>
      </Box>
      <Box cssProps={{ position: 'relative', marginTop: '0.5469rem' }}>
        <Controller
          control={control}
          name="refundToPay"
          defaultValue={defaultValue || 0}
          key={`refund-to-pay-${defaultValue}`}
          render={({ field }) => (
            <Input
              {...field}
              disabled={!!!defaultValue}
              id="refund-to-pay"
              type="number"
              inputMode="numeric"
              step="any"
              value={field.value}
            />
          )}
        />
      </Box>
    </Stack>
  );
};
