import { useEffect, useRef } from 'react';

import {
  useMutation,
  useQueryClient,
  useIsMutating,
} from '@tanstack/react-query';
import { toast as toastMessage } from 'react-hot-toast';

import { Box } from '@src/components/Box';
import { Card } from '@src/components/Card';
import { PayoutDetailsIcon } from '@src/components/Shared/PayoutDetailsIcon';
import { Stack } from '@src/components/Layouts/Stack';
import { Text } from '@src/components/Text';
import { Button } from '@src/components/Button';
import { CommisionInput } from './CommisionInput';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { toast } from '@src/components/Toast';
import { SellerOrderDetails } from '@src/models/OrderDetails';
import { Loader } from '@src/components/Loader';

export const PayoutDetailsCard = ({
  orderDetails,
  orderSellerDetails,
  getMatchedOrder,
}: {
  orderDetails: any;
  orderSellerDetails: any;
  getMatchedOrder: any;
}) => {
  const isMutatingSellerPayout = useIsMutating({
    mutationKey: [QUERY_KEYS.editSellerPayout, orderDetails?.orderId],
  });

  const commisionRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (commisionRef.current) {
      commisionRef.current.value = orderSellerDetails?.commission;
    }
  }, [orderSellerDetails?.commission, commisionRef]);

  const editPayoutMutation = useMutation(
    ({
      orderId,
      commission,
    }: {
      orderId: string;
      commission: string | number;
    }): Promise<void> => {
      const values = {
        commission: commission.toString(),
        iban: orderSellerDetails?.iban || '',
        accountName: orderSellerDetails?.accountName || '',
        bank: orderSellerDetails?.bankDetails || '',
      };

      return SellerOrderDetails.postEditPayout(orderId, values);
    },
    {
      mutationKey: [QUERY_KEYS.editSellerPayout, orderDetails?.orderId],
      onSuccess() {
        toast.success(
          toast.getMessage(
            'onSellerEditPayoutSuccess',
            getMatchedOrder?.orderNumber
          )
        );
        queryClient.invalidateQueries([
          QUERY_KEYS.orderDetails,
          orderDetails?.orderId,
          'seller',
        ]);
      },
      onError(error: any) {
        queryClient.invalidateQueries([
          QUERY_KEYS.orderDetails,
          orderDetails?.id,
          'seller',
        ]);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(
            toast.getMessage(
              'onSellerEditPayoutError',
              getMatchedOrder?.orderNumber
            )
          );
        }
      },
    }
  );

  const handleUpdate = async () => {
    const missingFields = [];

    if (!orderSellerDetails?.bankDetails?.bankName) {
      missingFields.push('Bank Name');
    }
    if (!orderSellerDetails?.iban) {
      missingFields.push('IBAN');
    }
    if (!orderSellerDetails?.accountName) {
      missingFields.push('Beneficiary Name');
    }

    if (missingFields.length > 0) {
      const lastField = missingFields.pop();
      const errorMessage =
        missingFields.length > 0
          ? `${missingFields.join(', ')} and ${lastField} are required`
          : `${lastField} is required`;

      toastMessage.error(errorMessage, { duration: 4000 });
      return;
    }

    await editPayoutMutation.mutate({
      orderId: orderDetails?.orderId,
      commission: commisionRef.current?.value || '',
    });
  };

  return (
    <Card
      heading="Payout Details"
      icon={<PayoutDetailsIcon />}
      paddingBottom="0"
      fontSize="1.5rem"
      paddingBodyX="0"
    >
      <Box
        cssProps={{
          marginLeft: '3.625rem',
        }}
      >
        <Box
          cssProps={{
            display: 'flex',
            width: 'fit-content',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <CommisionInput
            ref={commisionRef}
            sellerCommission={orderSellerDetails?.commission}
          />
          <Stack direction="vertical" padding="0 0 0.25rem">
            <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
              <Text fontWeight="bold" fontSize="baseText" color="static.black">
                Bank Name
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
                width: '18rem',
                paddingLeft: '0.75rem',
              }}
            >
              {orderSellerDetails?.bankDetails?.bankName}
            </Box>
          </Stack>
          <Stack direction="vertical" padding="0 0 0.25rem">
            <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
              <Text fontWeight="bold" fontSize="baseText" color="static.black">
                IBAN
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
                width: '18rem',
                paddingLeft: '0.75rem',
              }}
            >
              {orderSellerDetails?.iban}
            </Box>
          </Stack>
          <Stack direction="vertical" padding="0 0 0.25rem">
            <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
              <Text fontWeight="bold" fontSize="baseText" color="static.black">
                Beneficiary Name
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
                width: '18rem',
                paddingLeft: '0.75rem',
              }}
            >
              {orderSellerDetails?.accountName}
            </Box>
          </Stack>
          <Stack
            direction="vertical"
            padding="0 0 0.25rem"
            margin="1.5938rem 0 0"
          >
            <Button
              onClick={handleUpdate}
              variant="filled"
              disabled={!!isMutatingSellerPayout}
            >
              {!!isMutatingSellerPayout ? (
                <Loader size="24px" marginRight="0" border="static.blue" />
              ) : (
                'Update'
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};
