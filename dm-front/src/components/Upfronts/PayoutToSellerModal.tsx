import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { toast } from '@/components/Toast';
import { Loader } from '@/components/Loader';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { FormField, Input } from '@/components/Form';
import { CommonModal } from '@/components/Modal';
import { Text } from '@/components/Text';
import { Stack } from '@/components/Layouts';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { useAwaitableComponent } from '@/components/Shared/hooks/useAwaitableComponent';
import { Backdrop } from '@/components/Shared/Backdrop';
import { Upfronts } from '@/models/Upfronts';
import { usePayoutToSellerDetails } from './hooks/usePayoutToSellerDetails';
import { useEffect } from 'react';

interface PayoutToSellerModalProps {
  isOpen: boolean;
  orderId: string;
  onClose: () => void;
}

interface PayoutFormData {
  amount: number;
  iban: string;
  accountName: string;
  bank: string;
}

export function PayoutToSellerModal(props: PayoutToSellerModalProps) {
  const queryClient = useQueryClient();
  const { isOpen, orderId, onClose } = props;
  const [status, execute, resolve, reject, resetStatus] =
    useAwaitableComponent();
  const { isLoading, data: payoutDetails } = usePayoutToSellerDetails(orderId);

  const isConfirmDialogVisible = status === 'awaiting';

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset
  } = useForm({
    defaultValues: {
      amount: parseFloat(payoutDetails?.payoutAmount),
      iban: payoutDetails?.accountId,
      accountName: payoutDetails?.accountHolderName,
      bank: payoutDetails?.bankName,
    },
  });

  useEffect(() => {
    if (payoutDetails) {
      reset({
        amount: parseFloat(payoutDetails?.payoutAmount),
        iban: payoutDetails.accountId,
        accountName: payoutDetails.accountHolderName,
        bank: payoutDetails.bankName,
      });
    }
  }, [payoutDetails]);

  const payoutMutation = useMutation(
    ({ orderId ,payoutAmount}: { orderId: string ,payoutAmount:number}): Promise<void> => {
      return Upfronts.payoutToSeller(orderId,payoutAmount);
    },
    {
      onSuccess() {
        toast.success(toast.getMessage('onPayoutToSellerSuccess', orderId));
        queryClient.invalidateQueries([QUERY_KEYS.payoutToSellerUpfront]);
        onClose();
      },
      onError(error: any) {
        queryClient.invalidateQueries([
          QUERY_KEYS.payoutToSellerUpfront,
          orderId,
        ]);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(toast.getMessage('onPayoutToSellerError', orderId));
        }
      },
    }
  );

  async function handleSellerPayout(data:PayoutFormData) {
    console.log(data);
    try {
      await execute().then(() => payoutMutation.mutate({ orderId,payoutAmount:data.amount }));
    } catch (err) {
      resetStatus();
    }
  }

  return (
    <CommonModal onClose={onClose} isOpen={isOpen} height={180}>
      {payoutMutation.isLoading ||
        (isLoading && (
          <Backdrop>
            <Loader size="48px" border="static.blue" marginRight="0" />
          </Backdrop>
        ))}
      <ConfirmationDialog
        top={180}
        isOpen={isConfirmDialogVisible}
        onConfirm={resolve}
        onCancel={reject}
      >
        <Box
          cssProps={{
            borderBottom: '1px solid',
            borderColor: 'static.grays.50',
            paddingBottom: 5,
          }}
        >
          <Text fontSize="baseText" fontWeight="regular" color="static.black">
            Are you sure you want to submit a payment for{' '}
            {payoutDetails?.accountHolderName} with the amount{' '}
            {watch('amount')}
          </Text>
        </Box>
      </ConfirmationDialog>

      <Stack direction="vertical" gap="3">
        <Text
          fontWeight="semibold"
          fontSize="bigSubtitle"
          color="static.blues.500"
        >
          Payout To Seller
        </Text>
        {isLoading ?
          <Backdrop>
            <Loader size="48px" border="static.blue" marginRight="0" />
          </Backdrop>
        :<form id="seller-payout" onSubmit={handleSubmit(handleSellerPayout)}>
          <Stack direction="horizontal" gap="20">
            <Stack direction="vertical" gap="10" flex="1">
              <FormField
                label="Payout Amount to Pay"
                htmlFor="payout-amount"
                error={errors.amount?.message?.toString()}
              >
                <Input
                  type="number"
                  id="payout-amount"
                  autoComplete="off"
                  defaultValue={payoutDetails?.payoutAmount}
                  step="0.01" // Optional: allows decimals like 12.50
                  {...register('amount', {
                    valueAsNumber: true, // ✅ This ensures it becomes a number
                    required: 'Payout amount is required',
                    validate: {
                      isNumber: (value) =>
                        typeof value === 'number' && !isNaN(value) || 'Payout amount must be a valid number',
                      isPositive: (value) =>
                        value > 0 || 'Payout amount must be greater than 0',
                    },
                  })}
                />


              </FormField>
              <FormField
                label="IBAN"
                htmlFor="iban"
                error={errors.iban?.message?.toString()}
              >
                <Input
                  id="iban"
                  autoComplete="off"
                  disabled
                  value={payoutDetails?.accountId}
                  {...register('iban')}
                />
              </FormField>
              <Box cssProps={{ marginTop: 'auto' }}>
                <Button
                  disabled={payoutMutation.isLoading || isLoading}
                  form="seller-payout"
                  type="submit"
                  variant="filled"
                >
                  Submit Payment To Seller
                </Button>
              </Box>
            </Stack>
            <Stack direction="vertical" gap="10" flex="1">
              <Box cssProps={{ width: '100%' }}>
                <FormField
                  label="Bank Name"
                  htmlFor="bank-name"
                  error={errors.bank?.message?.toString()}
                >
                  <Input
                    id="bank-name"
                    autoComplete="off"
                    disabled
                    value={payoutDetails?.bankName}
                    {...register('bank')}
                  />
                </FormField>
              </Box>
              <Stack direction="horizontal" justify="space-between">
                <Box cssProps={{ width: '100%' }}>
                  <FormField
                    label="Account Name"
                    htmlFor="account-name"
                    error={errors.accountName?.message?.toString()}
                  >
                    <Input
                      id="account-name"
                      autoComplete="off"
                      disabled
                      value={payoutDetails?.accountHolderName}
                      {...register('accountName')}
                    />
                  </FormField>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </form>}
      </Stack>
    </CommonModal>
  );
}
