import { useMemo, useEffect, useState, SyntheticEvent } from 'react';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isValidIBAN } from 'ibantools';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { Bank } from '@/models/Bank';
import { toast } from '@/components/Toast';
import { Loader } from '@/components/Loader';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { Checkbox, FormField, Input } from '@/components/Form';
import { CommonModal, FullBleedContainer } from '@/components/Modal';
import { Text } from '@/components/Text';
import { Stack } from '@/components/Layouts';
import { SellerPayoutDTO, SellerEditPayoutDTO } from '@/types/dto';
import { SellerOrderDetails } from '@/models/OrderDetails';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { useAwaitableComponent } from '@/components/Shared/hooks/useAwaitableComponent';
import { useOrdersTable } from '@/components/Shared/hooks/useOrdersTable';
import { EOrderModules } from '@/models/Order';
import { Backdrop } from '@/components/Shared/Backdrop';

import { BankSelect } from './BankSelect';
import { useSellerOrderDetails } from './hooks/useSellerOrderDetails';
import { PaymentHistoryTable } from './PaymentHistoryTable';
import { WalletTransactionsTable } from './WalletTransactionsTable';
import { OrderDetailsText } from './shared';
import { WalletRelease } from './WalletRelease';

const paymentScehma = yup.object().shape({
  amount: yup.string().required('Amount is required'),
  isQuickPayout: yup.boolean().required(),
});

const payoutSchema = yup.object().shape({
  commission: yup.string().required('Commission is required'),
  iban: yup
    .string()
    .required('IBAN is required')
    .test('iban', 'Invalid IBAN', function (value) {
      return isValidIBAN(value as unknown as string);
    }),
  accountName: yup.string().required('Account name is required'),
  bank: yup.object().required('Bank name is required'),
});

interface SellerPayoutModalProps {
  isOpen: boolean;
  orderId: string;
  onClose: () => void;
}
export function SellerPayoutModal(props: SellerPayoutModalProps) {
  const queryClient = useQueryClient();
  const { isOpen, orderId, onClose } = props;
  const { isLoading, data } = useSellerOrderDetails(orderId);
  const [status, execute, resolve, reject, resetStatus] =
    useAwaitableComponent();

  const isConfirmDialogVisible = status === 'awaiting';

  const { orders: payouts } = useOrdersTable({
    submodule: EOrderModules.PAYOUT,
  });

  const { data: bankData } = useQuery(
    [QUERY_KEYS.bankList],
    () => Bank.getBanks(),
    {
      initialData: () => queryClient.getQueryData([QUERY_KEYS.bankList]),
      initialDataUpdatedAt: () =>
        queryClient.getQueryState([QUERY_KEYS.bankList])?.dataUpdatedAt,
    }
  );

  const mappedBanks = useMemo(() => Bank.mapBanks(bankData), [bankData]);

  const getMatchedOrder = useMemo(() => {
    if (payouts) {
      return payouts.find((payout) => payout.id === orderId);
    }
  }, [orderId, payouts]);

  const isWalletCreditRelease = getMatchedOrder?.payoutType === 'Wallet Credit';

  const orderDetails = useMemo(
    () => SellerOrderDetails.mapOrderDetails(data?.responseData || {}),
    [data]
  );
  const [EditPayoutWalletValue, setEditPayoutWalletValue] = useState(
    orderDetails?.commission
  );

  const {
    control: paymentControl,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<SellerPayoutDTO>({
    resolver: yupResolver(paymentScehma),
  });

  const {
    control,
    register: editPayoutRegister,
    handleSubmit: editPayouthandleSubmit,
    reset: editPayoutReset,
    formState: { errors: editPayoutErrors },
  } = useForm<SellerEditPayoutDTO>({
    resolver: yupResolver(payoutSchema),
  });

  const payoutMutation = useMutation(
    ({
      orderId,
      values,
    }: {
      orderId: string;
      values: SellerPayoutDTO;
    }): Promise<void> => {
      return SellerOrderDetails.postSellerPayout(orderId, values);
    },
    {
      onSuccess() {
        toast.success(
          toast.getMessage(
            'onSellerPayoutSuccess',
            getMatchedOrder?.orderNumber
          )
        );
        queryClient.invalidateQueries([QUERY_KEYS.sellerPayouts]);
        onClose();
      },
      onError(error: any) {
        queryClient.invalidateQueries([QUERY_KEYS.paymentHistory, orderId]);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(
            toast.getMessage('onBuyerRefundError', getMatchedOrder?.orderNumber)
          );
        }
      },
    }
  );

  const payoutToWalletMutation = useMutation(
    ({
      orderId,
      walletId,
      releaseAmount,
    }: {
      orderId: string;
      walletId: string;
      releaseAmount: number;
    }): Promise<void> => {
      return SellerOrderDetails.payoutToWallet({
        orderId,
        walletId,
        releaseAmount,
      });
    },
    {
      onSuccess() {
        toast.success(
          toast.getMessage(
            'onSellerToWalletPayoutSuccess',
            getMatchedOrder?.orderNumber
          )
        );
        queryClient.invalidateQueries([QUERY_KEYS.sellerToWalletPayouts]);
        onClose();
      },
      onError(error: any) {
        queryClient.invalidateQueries([QUERY_KEYS.paymentHistory, orderId]);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(toast.getMessage('onToWalletRefundError'));
        }
      },
    }
  );

  const editPayoutMutation = useMutation(
    ({
      orderId,
      values,
    }: {
      orderId: string;
      values: SellerEditPayoutDTO;
    }): Promise<void> => {
      return SellerOrderDetails.postEditPayout(orderId, values);
    },
    {
      onSuccess() {
        toast.success(
          toast.getMessage(
            'onSellerEditPayoutSuccess',
            getMatchedOrder?.orderNumber
          )
        );
        queryClient.invalidateQueries([
          QUERY_KEYS.orderDetails,
          orderId,
          'seller',
        ]);
      },
      onError(error: any) {
        queryClient.invalidateQueries([
          QUERY_KEYS.orderDetails,
          orderId,
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
  const editPayoutWalletCreditMutation = useMutation(
    ({ orderId }: { orderId: string }): Promise<void> => {
      return SellerOrderDetails.postEditPayoutWalletCredit(
        orderId,
        EditPayoutWalletValue || +orderDetails?.commission
      );
    },
    {
      onSuccess() {
        toast.success(
          toast.getMessage(
            'onSellerEditPayoutWalletCreditSuccess',
            getMatchedOrder?.orderNumber
          )
        );
        queryClient.invalidateQueries([
          QUERY_KEYS.orderDetails,
          orderId,
          'seller',
        ]);
        queryClient.invalidateQueries([QUERY_KEYS.transactionDetails]);
      },
      onError(error: any) {
        queryClient.invalidateQueries([
          QUERY_KEYS.orderDetails,
          orderId,
          'seller',
        ]);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(
            toast.getMessage(
              'onSellerEditPayoutWalletCreditError',
              getMatchedOrder?.orderNumber
            )
          );
        }
      },
    }
  );

  const handlePayoutWalletChangeValue = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    orderDetails.commission = +target.value;
    setEditPayoutWalletValue(+target.value);
  };

  useEffect(() => {
    editPayoutReset({
      bank: mappedBanks?.find(
        (bank) => bank.bankCode === orderDetails.bankCode
      ),
      iban: orderDetails?.iban,
      accountName: orderDetails?.accountName,
      commission: String(orderDetails?.commission),
      commissionAmount: String(orderDetails?.commissionAmount),
    });
    reset({
      amount: String(orderDetails?.payoutAmount),
      isQuickPayout: orderDetails?.isQuickPayout,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetails]);

  async function handleSellerPayout(formValues: SellerPayoutDTO) {
    try {
      if (isWalletCreditRelease) {
        await execute().then(() =>
          payoutToWalletMutation.mutate({
            orderId,
            walletId: orderDetails.walletId,
            releaseAmount: Number(formValues.amount),
          })
        );

        return;
      }
      await execute().then(() =>
        payoutMutation.mutate({ orderId, values: formValues })
      );
    } catch (err) {
      resetStatus();
    }
  }

  async function handleEditPayout(formValues: SellerEditPayoutDTO) {
    await editPayoutMutation.mutate({ orderId, values: formValues });
  }
  async function handleEditPayoutWalletCredit() {
    await editPayoutWalletCreditMutation.mutate({ orderId });
  }

  if (isLoading) {
    return (
      <CommonModal onClose={onClose} isOpen={isOpen}>
        <Box
          cssProps={{
            width: 580,
            height: 480,
            margin: -10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader size="48px" border="static.blue" marginRight="0" />
        </Box>
      </CommonModal>
    );
  }

  return (
    <CommonModal onClose={onClose} isOpen={isOpen}>
      {(payoutMutation.isLoading || payoutToWalletMutation.isLoading) && (
        <Backdrop>
          <Loader size="48px" border="static.blue" marginRight="0" />
        </Backdrop>
      )}
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
            Are you sure you want to submit a payment for &#123; Payout &#125;
            with the amount {getValues('amount')} for the seller{' '}
            {getMatchedOrder?.seller?.name}
          </Text>
        </Box>
      </ConfirmationDialog>
      <Stack direction="vertical" gap="15">
        {/* Heading - Start */}
        <FullBleedContainer>
          <Text color="static.black" fontSize="bigText" fontWeight="regular">
            Payout - Order:{' '}
            <Text
              as="span"
              fontSize="bigText"
              fontWeight="regular"
              color="static.blues.400"
            >
              {getMatchedOrder?.orderNumber}
            </Text>
          </Text>
        </FullBleedContainer>
        {/* Heading - End */}
        {/* Payout Form - Start */}
        <FullBleedContainer>
          <form id="seller-payout" onSubmit={handleSubmit(handleSellerPayout)}>
            <Stack direction="horizontal" gap="20">
              {/* Left  - Start */}
              <Stack direction="vertical" gap="10" flex="1">
                <FormField
                  label="Payout Amount to Pay"
                  htmlFor="payout-amount"
                  error={errors.amount?.message}
                >
                  <Input
                    disabled={isWalletCreditRelease ? false : true}
                    id="payout-amount"
                    autoComplete="off"
                    {...register('amount')}
                  />
                </FormField>
                <Box cssProps={{ marginTop: 'auto' }}>
                  <Button
                    disabled={
                      payoutMutation.isLoading ||
                      orderDetails?.isPayoutSuccess ||
                      payoutToWalletMutation.isLoading ||
                      orderDetails?.isSuccessPayoutToWallet
                    }
                    form="seller-payout"
                    type="submit"
                    variant="filled"
                  >
                    {isWalletCreditRelease
                      ? 'Submit Release'
                      : 'Submit Payment'}
                  </Button>
                </Box>
                <Controller
                  control={paymentControl}
                  name="isQuickPayout"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      id="is-quick-payout"
                      checked={value ?? false}
                      onChange={onChange}
                      label={"Mark this order as 'Quick Payout'"}
                    />
                  )}
                />
              </Stack>
              {/* Left  - End */}
              {/* Right  - Start */}
              <Stack direction="vertical" gap="10" flex="1">
                <OrderDetailsText
                  text="Base Buy Price (SellPrice)"
                  value={orderDetails?.basePrice}
                />
                <OrderDetailsText
                  text="Seller Commission Amount"
                  value={orderDetails?.commissionAmount}
                />
                <OrderDetailsText
                  text="Discount"
                  value={orderDetails?.discount}
                />
                <OrderDetailsText
                  text="Shipping Charges"
                  value={orderDetails?.shippingCharges}
                />
                <OrderDetailsText text="VAT" value={orderDetails?.vat} />
                <OrderDetailsText
                  text="Grand Total for Seller"
                  value={orderDetails?.grandTotal}
                  fontWeight="semibold"
                />
              </Stack>
              {/* Right  - End */}
            </Stack>
          </form>
        </FullBleedContainer>
        {/* Edit Payout Section for Wallet Credit  - Start */}
        {getMatchedOrder?.payoutType === 'Wallet Credit' && (
          <Stack direction="vertical" gap="3">
            <Text
              fontWeight="semibold"
              fontSize="bigSubtitle"
              color="static.blues.500"
            >
              Edit Payout
            </Text>
            <Stack direction="horizontal" align="center" gap="20">
              <Box cssProps={{ width: '50%' }}>
                <FormField
                  label="Seller commission %"
                  htmlFor="seller-commission"
                >
                  {/* value will be depend on backend for the first time it returns and open modal */}
                  <Input
                    disabled={orderDetails?.isSuccessPayoutToWallet}
                    id="seller-commission"
                    autoComplete="off"
                    value={+orderDetails?.commission}
                    onChange={handlePayoutWalletChangeValue}
                  />
                </FormField>
              </Box>
              <Box
                cssProps={{
                  width: '50%',
                  display: 'flex',
                  justifyContent: 'end',
                }}
              >
                <Button
                  disabled={
                    editPayoutWalletCreditMutation.isLoading ||
                    orderDetails?.isSuccessPayoutToWallet ||
                    orderDetails?.creditStatus === 'Canceled'
                  }
                  onClick={handleEditPayoutWalletCredit}
                  type="button"
                  variant="purple_filled"
                >
                  Edit Payout
                </Button>
              </Box>
            </Stack>
          </Stack>
        )}
        {/* Edit Payout Section for Wallet Credit  - end */}
        {/* Payout Form - End */}
        {/* Edit Payout Section - Start */}
        {getMatchedOrder?.payoutType === 'Wallet Credit' ? (
          <WalletRelease
            sellerId={getMatchedOrder?.seller.id}
            orderId={getMatchedOrder.id}
          />
        ) : (
          <Stack direction="vertical" gap="3">
            <Text
              fontWeight="semibold"
              fontSize="bigSubtitle"
              color="static.blues.500"
            >
              Edit Payout
            </Text>
            <form
              id="edit-payout"
              onSubmit={editPayouthandleSubmit(handleEditPayout)}
            >
              <Stack direction="horizontal" gap="20">
                <Stack direction="vertical" gap="10" flex="1">
                  <FormField
                    label="Seller commission %"
                    htmlFor="seller-commission"
                    error={editPayoutErrors.commission?.message}
                  >
                    <Input
                      id="seller-commission"
                      autoComplete="off"
                      {...editPayoutRegister('commission')}
                    />
                  </FormField>
                  <FormField
                    label="IBAN"
                    htmlFor="iban"
                    error={editPayoutErrors.iban?.message}
                  >
                    <Input
                      id="iban"
                      autoComplete="off"
                      disabled
                      {...editPayoutRegister('iban')}
                    />
                  </FormField>
                </Stack>
                <Stack direction="vertical" gap="10" flex="1">
                  <Box cssProps={{ width: '50%' }}>
                    <Controller
                      control={control}
                      name="bank"
                      render={({ field: { onChange, value } }) => (
                        <BankSelect
                          isDisabled
                          onChange={onChange}
                          value={value as Bank}
                          error={editPayoutErrors.bank?.message}
                        />
                      )}
                    />
                  </Box>
                  <Stack direction="horizontal" justify="space-between">
                    <Box cssProps={{ width: '50%' }}>
                      <FormField
                        label="Account Name"
                        htmlFor="account-name"
                        error={editPayoutErrors.accountName?.message}
                      >
                        <Input
                          id="account-name"
                          autoComplete="off"
                          disabled
                          {...editPayoutRegister('accountName')}
                        />
                      </FormField>
                    </Box>
                    <Box cssProps={{ alignSelf: 'flex-end' }}>
                      <Button
                        form="edit-payout"
                        type="submit"
                        variant="outline"
                      >
                        Edit Payout
                      </Button>
                      <Box
                        // to take into account inputs
                        // invisible error fields
                        cssProps={{
                          opacity: 0,
                          fontWeight: 'smallText',
                          fontSize: 'smallText',
                        }}
                      >
                        spacer
                      </Box>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            </form>
          </Stack>
        )}
        {/* Edit Payout Section - End */}
        {/* Payment History - Start */}
        {!isWalletCreditRelease && (
          <PaymentHistoryTable
            orderId={orderId}
            orderNumber={getMatchedOrder?.orderNumber as string}
          />
        )}
        {/* Payment History - End */}
        {/* Transaction History - Start */}
        <FullBleedContainer>
          <WalletTransactionsTable orderId={orderId} />
        </FullBleedContainer>
        {/* Transaction History - End */}
      </Stack>
    </CommonModal>
  );
}
