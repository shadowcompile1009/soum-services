import { Control, UseFormSetValue } from 'react-hook-form';

import { Card } from '@src/components/Card';
import { Stack } from '@src/components/Layouts';
import { Box } from '@src/components/Box';
import { Text } from '@src/components/Text';
import { OrderDetailsIcon } from '@src/components/Shared/OrderDetailsIcon';

import { SelectOrderStatus } from '../Select/SelectOrderStatus';
import { SelectNCTReason } from '../Select/SelectNCTReason';
import { SelectNCTPenalty } from '../Select/SelectNCTPenalty';
import { GenerateReverseSmsaTracking } from '../GenerateReverseSmsaTracking';

import { OrderFormValues } from '../types';

interface OrderActionsCardProps {
  orderDetails: any;
  control: Control<OrderFormValues>;
  watchedNCTReason: any;
  setValue: UseFormSetValue<OrderFormValues>;
}

const ACTION_FIELDS = [
  {
    label: 'Order Status',
    component: SelectOrderStatus,
  },
  {
    label: 'NCT Reason',
    component: SelectNCTReason,
  },
  {
    label: 'NCT Penalty',
    component: SelectNCTPenalty,
  },
];

export function OrderActionsCard({
  orderDetails,
  control,
  watchedNCTReason,
  setValue,
}: OrderActionsCardProps) {
  return (
    <Card
      heading="Order Actions"
      icon={<OrderDetailsIcon />}
      paddingBottom="0"
      cardHeaderPadding="8px 1.0625rem"
    >
      <Stack direction="vertical" gap="0.75rem">
        {ACTION_FIELDS.map(({ label, component: Component }) => (
          <Stack
            key={label}
            direction="horizontal"
            margin="0 2.1875rem 0 3.625rem"
            padding="0 0 0.25rem"
            justify="space-between"
          >
            <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
              <Text
                fontWeight="regular"
                fontSize="bigText"
                color="static.blues.500"
              >
                {label}
              </Text>
            </Box>
            <Component
              orderDetails={orderDetails}
              control={control}
              NCTReason={label === 'NCT Penalty' ? watchedNCTReason : undefined}
              setValue={setValue}
              submodule="order"
            />
          </Stack>
        ))}

        <GenerateReverseSmsaTracking orderDetails={orderDetails} />
      </Stack>
    </Card>
  );
}
