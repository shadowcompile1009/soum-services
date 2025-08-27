import { Card } from '@src/components/Card';
import { OrderDetailsIcon } from '@src/components/Shared/OrderDetailsIcon';
import { formatDistanceToNow } from 'date-fns';
import { Stack } from '@src/components/Layouts';
import { Box } from '@src/components/Box';
import { Text } from '@src/components/Text';

import { OrderDetailsProps } from '../types';

const TIME_FIELDS = [
  { label: 'Time since order', field: 'orderData.createdAt' },
  { label: 'Time since confirmation', field: 'orderData.confirmationDate' },
  { label: 'Time since shipping', field: 'orderData.shippingDate' },
  { label: 'Time since Delivery', field: 'orderData.deliveryDate' },
  { label: 'Time since dispute', field: 'orderData.disputeDate' },
];

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
};

export function OrderEventsCard({ orderDetails }: OrderDetailsProps) {
  const formattedDateComponent = (date: Date) => {
    if (!date) return 'NA';

    const timeString = formatDistanceToNow(new Date(date));
    const parts = timeString.split(' ');
    const number = parts.find((part) => !isNaN(Number(part)));
    const text = parts
      .filter((part) => isNaN(Number(part)))
      .filter((part) => part.toLowerCase() !== 'about')
      .join(' ');
    return (
      <>
        <Box cssProps={{ color: '#6C757D' }}>{number}</Box>
        <Box cssProps={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </Box>
      </>
    );
  };

  return (
    <Card
      heading="Order Events"
      icon={<OrderDetailsIcon />}
      cardHeaderPadding="8px 1.0625rem"
    >
      <Stack direction="vertical" gap="0.75rem">
        {TIME_FIELDS.map(({ label, field }) => (
          <Stack
            key={field}
            direction="horizontal"
            borderBottom="0.66px solid #C2C2C2"
            margin="0 2.1875rem 0 58px"
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
            <Box
              cssProps={{
                borderRadius: '0.25rem',
                backgroundColor: '#6c757d13',
                display: 'flex',
                alignItems: 'center',
                height: '2.125rem',
                width: '14.125rem',
                paddingLeft: '0.75rem',
              }}
            >
              {formattedDateComponent(getNestedValue(orderDetails, field))}
            </Box>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
