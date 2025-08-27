import { Stack } from '@src/components/Layouts';
import { Box } from '@src/components/Box';
import { Text } from '@src/components/Text';
import { IBuyerOrderDetails } from '@src/models/OrderDetails';

export const SellerPenalty = ({
  buyerOrderDetails,
}: {
  buyerOrderDetails: IBuyerOrderDetails;
}) => {
  return (
    <Stack
      direction="vertical"
      align="left"
      gap="0.5rem"
      style={{ marginLeft: '2.6875rem' }}
    >
      <Stack
        direction="horizontal"
        align="center"
        gap="6"
        style={{ height: '2.25rem' }}
      >
        <Text fontSize="1.5rem" fontWeight="semibold" color="static.black">
          Seller Penalty
        </Text>
      </Stack>
      <Stack direction="vertical" padding="0 0 0.75rem">
        <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
          <Text fontWeight="bold" fontSize="baseText" color="static.black">
            Seller Wallet Balance
          </Text>
        </Box>
        <Box
          cssProps={{
            borderRadius: '0.25rem',
            backgroundColor: '#6c757d13',
            display: 'flex',
            alignItems: 'center',
            height: '2.125rem',
            marginTop: '0.5469rem',
            marginBottom: '0.3125rem',
            width: '14.125rem',
            paddingLeft: '0.75rem',
          }}
        >
          {buyerOrderDetails?.sellerWalletDetail} SAR
        </Box>
      </Stack>
      <Stack direction="vertical" padding="0 0 0.25rem">
        <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
          <Text fontWeight="bold" fontSize="baseText" color="static.black">
            Deducting Listing Fees
          </Text>
        </Box>
        <Box
          cssProps={{
            borderRadius: '0.25rem',
            backgroundColor: '#6c757d13',
            display: 'flex',
            alignItems: 'center',
            height: '2.125rem',
            marginTop: '0.5469rem',
            marginBottom: '0.3125rem',
            width: '14.125rem',
            paddingLeft: '0.75rem',
          }}
        >
          {buyerOrderDetails?.listingFee} SAR
        </Box>
        <Text fontSize="0.625rem" fontWeight="bold" color="static.black">
          Note: Deducts SAR 50
        </Text>
      </Stack>
    </Stack>
  );
};
