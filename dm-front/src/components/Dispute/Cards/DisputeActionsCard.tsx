import { Control, UseFormSetValue } from 'react-hook-form';

import { Card } from '@src/components/Card';
import { Stack } from '@src/components/Layouts';
import { Box } from '@src/components/Box';
import { Text } from '@src/components/Text';
import { OrderDetailsIcon } from '@src/components/Shared/OrderDetailsIcon';

import { GenerateReverseSmsaTracking } from '../GenerateReverseSmsaTracking';
import { SelectDisputeStatus } from '../Select/SelectDisputeStatus';

import { DisputeFormValues } from '../types';

interface DisputeActionsCardProps {
  orderDetails: any;
  control: Control<DisputeFormValues>;
  setValue?: UseFormSetValue<DisputeFormValues>;
}

const ACTION_FIELDS = [
  {
    label: 'Dispute Status',
    component: SelectDisputeStatus,
  },
];

export function DisputeActionsCard({
  orderDetails,
  control,
}: DisputeActionsCardProps) {
  return (
    <Card
      heading="Dispute Actions"
      icon={<OrderDetailsIcon />}
      paddingBottom="0"
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
            <Component orderDetails={orderDetails} control={control} />
          </Stack>
        ))}

        <Stack
          direction="horizontal"
          margin="0 2.1875rem 0 3.625rem"
          padding="0 0 0.25rem"
          align="flex-end"
          justify={
            orderDetails?.reverseSMSATrackingNumber
              ? 'space-between'
              : 'flex-end'
          }
        >
          <GenerateReverseSmsaTracking orderDetails={orderDetails} />
        </Stack>
      </Stack>
    </Card>
  );
}
