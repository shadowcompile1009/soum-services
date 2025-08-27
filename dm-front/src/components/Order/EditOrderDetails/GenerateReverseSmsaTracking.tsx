import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { Box } from '@src/components/Box/Box';
import { Button } from '@src/components/Button/Button';
import { Text } from '@src/components/Text';
import { toast } from '@src/components/Toast';
import { Order } from '@src/models/Order';
import { Stack } from '@src/components/Layouts/Stack';

export const GenerateReverseSmsaTracking = ({
  orderDetails,
}: {
  orderDetails: any;
}) => {
  const router = useRouter();

  const { query } = router;
  const { id } = query;

  const reverseSmsaTracking = useMutation(
    () => {
      return Order.getReverseSmsaTrackingById(id as string);
    },
    {
      onSuccess(data: string) {
        orderDetails.reverseSMSATrackingNumber = data;
        toast.success(toast.getMessage('onGenerateSmsaTrackingSuccess'));
      },
      onError() {
        toast.error(toast.getMessage('onGenerateSmsaTrackingError'));
      },
    }
  );

  const getReverseSmsaTracking = () => {
    reverseSmsaTracking.mutate();
  };

  return !orderDetails?.reverseSMSATrackingNumber ? (
    <Stack
      direction="horizontal"
      margin="0 2.1875rem 0 3.625rem"
      padding="0 0 0.25rem"
      align="flex-end"
      justify={
        orderDetails?.reverseSMSATrackingNumber ? 'space-between' : 'flex-end'
      }
      objectFit="contain"
    >
      <Button
        type="button"
        variant="darkFilled"
        paddingX="0.5rem"
        paddingY="0.375rem"
        onClick={getReverseSmsaTracking}
        disabled={orderDetails?.disputeStatus !== 'Open Dispute'}
      >
        + Tracking label generation
      </Button>
    </Stack>
  ) : (
    <Stack
      direction="horizontal"
      margin="0 2.1875rem 0 3.625rem"
      padding="0 0 0.25rem"
      align="flex-end"
      justify={
        orderDetails?.reverseSMSATrackingNumber ? 'space-between' : 'flex-end'
      }
      objectFit="contain"
    >
      <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
        <Text fontWeight="regular" fontSize="bigText" color="static.blues.500">
          Reverse SMSA Tracking
        </Text>
      </Box>
      <Text color="static.gray" fontSize="regularText" fontWeight="bigText">
        {orderDetails?.reverseSMSATrackingNumber}
      </Text>
    </Stack>
  );
};
