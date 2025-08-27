import { Box } from '@src/components/Box';
import { Card } from '@src/components/Card';
import { OrderDetailsIcon } from '@src/components/Shared/OrderDetailsIcon';

import { PAYOUT_BREAKDOWN_ITEMS } from '../../constants';
import { PaymentBreakdownItem } from './PaymentBreakdownItem';

export const PaymentBreakdown = ({
  orderSellerDetails,
}: {
  orderSellerDetails: any;
}) => {
  return (
    <Card
      heading="Payout Breakdown"
      icon={<OrderDetailsIcon />}
      paddingBottom="0"
      fontSize="1.5rem"
      paddingBodyX="0"
    >
      <Box
        cssProps={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          marginLeft: '3.625rem',
          width: 'fit-content',
          gap: '0.75rem',
        }}
      >
        {PAYOUT_BREAKDOWN_ITEMS(orderSellerDetails).map(
          (item, index, array) => {
            const final = index === array.length - 1;
            return (
              <PaymentBreakdownItem key={item.text} {...item} final={final} />
            );
          }
        )}
      </Box>
    </Card>
  );
};
