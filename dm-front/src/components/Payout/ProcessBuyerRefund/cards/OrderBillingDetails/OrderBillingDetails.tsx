import { Box } from '@src/components/Box';
import { Card } from '@src/components/Card';
import { Stack } from '@src/components/Layouts/Stack';
import { OrderDetailsIcon } from '@src/components/Shared/OrderDetailsIcon';

import {
  PAYOUT_BREAKDOWN_FIRST_GROUP_ITEMS,
  PAYOUT_BREAKDOWN_SECOND_GROUP_ITEMS,
} from '../../constants';

import { OrderBillingDetailsItem } from './OrderBillingDetailsItem';

export const OrderBillingDetails = ({
  buyerOrderDetails,
}: {
  buyerOrderDetails: any;
}) => {
  return (
    <Card
      heading="Order Billing Details"
      icon={<OrderDetailsIcon />}
      paddingBottom="0"
      fontSize="1.5rem"
      paddingBodyX="0"
    >
      <Stack direction="horizontal" gap="3.75rem">
        <Box
          cssProps={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            marginLeft: '3.625rem',
            width: 'fit-content',
            gap: '0.75rem',
          }}
        >
          {PAYOUT_BREAKDOWN_FIRST_GROUP_ITEMS(buyerOrderDetails).map(
            (item, index, array) => {
              const final = index === array.length - 1;
              return (
                <OrderBillingDetailsItem
                  key={item.text}
                  {...item}
                  final={final}
                />
              );
            }
          )}
        </Box>
        <Box
          cssProps={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            width: 'fit-content',
            gap: '0.75rem',
          }}
        >
          {PAYOUT_BREAKDOWN_SECOND_GROUP_ITEMS(buyerOrderDetails).map(
            (item) => {
              return (
                <OrderBillingDetailsItem
                  key={item.text}
                  {...item}
                  width="100%"
                />
              );
            }
          )}
        </Box>
      </Stack>
    </Card>
  );
};
