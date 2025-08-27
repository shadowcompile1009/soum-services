import { useEffect, useState, useMemo } from 'react';

import { useForm, Controller } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';
import deepmerge from 'deepmerge';
import { formatDistanceToNow } from 'date-fns';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { isValidIBAN } from 'ibantools';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import css from '@styled-system/css';

import { toast } from '@src/components/Toast';
import { Bank } from '@src/models/Bank';
import { Loader } from '@src/components/Loader';
import { Box } from '@src/components/Box';
import { Button } from '@src/components/Button';
import { FormField, Input } from '@src/components/Form';
import { CommonModal, FullBleedContainer } from '@src/components/Modal';
import { Text } from '@src/components/Text';
import { Stack } from '@src/components/Layouts';
import { styles } from '@src/components/Shared/commonSelectStyles';
import { BuyerOrderDetails, IPaymentMethod } from '@src/models/OrderDetails';
import { BankV2, BuyerRefundDTOV2 } from '@src/types/dto';
import { ConfirmationDialog } from '@src/components/ConfirmationDialog';
import { useAwaitableComponent } from '@src/components/Shared/hooks/useAwaitableComponent';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { useOrdersTable } from '@src/components/Shared/hooks/useOrdersTable';
import { EOrderModules } from '@src/models/Order';
import { Backdrop } from '@src/components/Shared/Backdrop';

import { useBuyerOrderDetails } from './hooks/useBuyerOrderDetails';
import { BankSelect } from './BankSelect';
import { PaymentHistoryTable } from './PaymentHistoryTable';
import { WalletTransactionsTable } from './WalletTransactionsTable';
import { OrderDetailsText } from './shared';

const CancelButton = styled(Button)(() =>
  css({
    height: '30px',
    width: '180px',
    margin: '10px 0px;',
  })
);

const INSTANT_REFUND = 'instantRefund';
const REVERSAL = 'reversal';
const REFUND_TO_WALLET = 'refundToWallet';

const penaltyFeeStatus = {
  AVAILABLE: 'Available',
  ONHOLD: 'OnHold',
  PENDING: 'Pending',
  PENALIZED: 'Penalized',
  NOTSET: 'Not set',
};

const schema = yup.object().shape({
  grandTotal: yup.number().required(),
  paymentMethod: yup
    .object({
      label: yup.string(),
      recommended: yup.boolean(),
      displayName: yup.string(),
    })
    .required('Payment method is required'),
  amount: yup
    .number()
    .typeError('Amount should be a number')
    .min(0, 'Amount cannot be less than zero.')
    .test(
      'maxGrandTotal',
      'Amount cannot be more than twice the grand total',
      function (value) {
        if (value) {
          return value <= 2 * this.parent.grandTotal;
        }
        return false;
      }
    )
    .test(
      'maxAmount',
      'Amount cannot be more than SAR 7000 if it’s lower than twice grand total',
      function (value) {
        if (value) {
          const twice = 2 * this.parent.grandTotal;
          return value <= twice && value <= 7000;
        }
        return false;
      }
    )
    .required('Amount is required'),
  iban: yup.string().when('paymentMethod', {
    is: (paymentMethod: IPaymentMethod) =>
      paymentMethod.label === INSTANT_REFUND,
    then: yup
      .string()
      .required('IBAN is required')
      .test('iban', 'Invalid IBAN', function (value) {
        return isValidIBAN(value as unknown as string);
      }),
    otherwise: yup.string().notRequired(),
  }),
  bank: yup.object().when('paymentMethod', {
    is: (paymentMethod: IPaymentMethod) =>
      paymentMethod.label === INSTANT_REFUND,
    then: yup.object().required('Bank name is required'),
    otherwise: yup.object().notRequired(),
  }),
  accountName: yup.string().when('paymentMethod', {
    is: (paymentMethod: IPaymentMethod) =>
      paymentMethod.label === INSTANT_REFUND,
    then: yup.string().required('Account name is required'),
    otherwise: yup.string().notRequired(),
  }),
});

const selectStyles = deepmerge.all([
  styles,
  {
    control: (provided: Record<string, unknown>) => ({
      ...provided,
      height: '44px',
    }),
  },
]);

interface BuyerRefundModalProps {
  isOpen: boolean;
  orderId: string;
  sellerId: string;
  onClose: () => void;
}
export function BuyerRefundModal(props: BuyerRefundModalProps) {
  const { isOpen, orderId, sellerId, onClose } = props;
  const { isLoading, data } = useBuyerOrderDetails(orderId);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [payoutStatus, setPayoutStatus] = useState<any>({});

  const [deductFeeStatus, setDeductFeeStatus] = useState(false);
  const [deductFee, setDeductFee] = useState(true);
  const [applyPenaltyFee, setApplyPenaltyFee] = useState(false);

  const [status, execute, resolve, reject, resetStatus] =
    useAwaitableComponent();
  const queryClient = useQueryClient();

  const isConfirmDialogVisible = status === 'awaiting';

  const { orders: payouts } = useOrdersTable({
    submodule: EOrderModules.REFUND,
  });

  const getMatchedOrder = useMemo(() => {
    if (payouts) {
      return payouts.find((payout) => payout.id === orderId);
    }
  }, [orderId, payouts]);

  function handlePaymentSelect(option: SingleValue<IPaymentMethod>) {
    if (option?.label === INSTANT_REFUND) {
      setShowBankDetails(true);
      setShowWalletDetails(false);
    }

    if (option?.label === REFUND_TO_WALLET) {
      setShowWalletDetails(true);
      setShowBankDetails(false);
    }

    if (option?.label === REVERSAL) {
      setShowWalletDetails(false);
      setShowBankDetails(false);
    }
  }

  const orderDetails = useMemo(
    () => BuyerOrderDetails.mapOrderDetails(data?.responseData || {}),
    [data]
  );

  const recommendedPaymentMethod = orderDetails?.paymentMethods?.find(
    (method) => method.recommended
  );

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
  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<BuyerRefundDTOV2>({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    CancelPayoutStatusMutation.mutate({
      orderId,
      ownerId: orderDetails.sellerId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const CancelPayoutStatusMutation = useMutation(
    ({ orderId }: { orderId: string; ownerId: string }): Promise<void> => {
      return BuyerOrderDetails.getCancelPayoutStatus(orderId, sellerId);
    },
    {
      onSuccess(data: any) {
        setPayoutStatus(data);
      },
      onError(error: any) {
        resetStatus();
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      },
    }
  );

  const CancelPayoutMutation = useMutation(
    (): Promise<void> => {
      return BuyerOrderDetails.postCancelPayout(
        payoutStatus?.orderId,
        payoutStatus?.walletId,
        payoutStatus?.ownerId
      );
    },
    {
      onSuccess(data) {
        setPayoutStatus(data);
        toast.success(
          toast.getMessage(
            'onCancelPayoutSuccess',
            getMatchedOrder?.orderNumber
          )
        );
      },
      onError(error: any) {
        resetStatus();
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      },
    }
  );

  const ClosePaymentMutation = useMutation(
    (): Promise<void> => {
      return BuyerOrderDetails.postCloselPayment(orderId);
    },
    {
      onSuccess() {
        toast.success(
          toast.getMessage(
            'onClosePaymentSuccess',
            getMatchedOrder?.orderNumber
          )
        );
        onClose();
      },
      onError(error: any) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      },
    }
  );

  useEffect(() => {
    penaltyFeeStatusMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const penaltyFeeStatusMutation = useMutation(
    () => {
      return BuyerOrderDetails.getPenaltyFeeStatus(sellerId);
    },
    {
      onSuccess(data: any) {
        let status = data?.result?.status;

        if (
          status == penaltyFeeStatus.AVAILABLE ||
          status == penaltyFeeStatus.ONHOLD ||
          status == penaltyFeeStatus.PENDING
        ) {
          setDeductFeeStatus(true);
        } else {
          setDeductFeeStatus(false);
          setDeductFee(false);
        }
      },
      onError() {
        setDeductFee(false);
      },
    }
  );

  const applyPenaltyMutation = useMutation(
    ({ orderId }: { orderId: string }): Promise<void> => {
      return BuyerOrderDetails.putApplyPenaltyFee(
        orderId,
        orderDetails?.sellerId
      );
    },
    {
      onSuccess(data: any) {
        if (data?.responseData?.errorCode == 400) {
          toast.error(toast.getMessage('onApplyPenaltyFeeNotSet'));

          return;
        } else if (
          data?.responseData?.errorDetail == ('Available' || 'OnHold')
        ) {
          toast.success(
            toast.getMessage(
              'onApplyPenaltyFeeSuccess',
              getMatchedOrder?.orderNumber
            )
          );
        } else if (
          data?.responseData?.errorDetail == penaltyFeeStatus.PENALIZED
        ) {
          toast.error(toast.getMessage('onApplyPenaltyFeePenalized'));
        } else if (data?.responseData?.errorDetail == penaltyFeeStatus.NOTSET) {
          toast.error(toast.getMessage('onApplyPenaltyFeeNotSet'));
        }
        setApplyPenaltyFee(true);
        setDeductFee(false);
      },
      onError(error: any) {
        resetStatus();
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(toast.getMessage('onGetPenaltyFeeError'));
        }
      },
    }
  );

  const refundMutation = useMutation(
    ({
      orderId,
      values,
    }: {
      orderId: string;
      values: BuyerRefundDTOV2;
    }): Promise<void> => {
      return BuyerOrderDetails.postBuyerRefund(orderId, values);
    },
    {
      onSuccess() {
        toast.success(
          toast.getMessage('onBuyerRefundSuccess', getMatchedOrder?.orderNumber)
        );
        queryClient.invalidateQueries([QUERY_KEYS.buyerRefunds]);
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

  const refundToWalletMutation = useMutation(
    ({
      orderId,
      walletId,
      refundAmount,
    }: {
      orderId: string;
      walletId: string;
      refundAmount: number;
    }) => {
      return BuyerOrderDetails.refundToWallet(orderId, walletId, refundAmount);
    },
    {
      onSuccess() {
        toast.success(
          toast.getMessage('onBuyerRefundSuccess', getMatchedOrder?.orderNumber)
        );
        queryClient.invalidateQueries([QUERY_KEYS.buyerRefunds]);
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

  useEffect(() => {
    reset({
      bank: mappedBanks?.find(
        (bank) => bank.bankName === orderDetails.bankName
      ),
      grandTotal: orderDetails?.grandTotal,
      paymentMethod: recommendedPaymentMethod,
      amount: orderDetails?.refundAmount,
      iban: orderDetails?.iban,
      accountName: orderDetails?.accountName,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedPaymentMethod]);

  useEffect(() => {
    if (recommendedPaymentMethod?.label === INSTANT_REFUND) {
      setShowBankDetails(true);
      setShowWalletDetails(false);
    }
    if (recommendedPaymentMethod?.label === REFUND_TO_WALLET) {
      setShowBankDetails(false);
      setShowWalletDetails(true);
    }
  }, [recommendedPaymentMethod?.label]);

  async function handleCancelPayout() {
    CancelPayoutMutation.mutate();
  }

  async function handleClosePayment() {
    ClosePaymentMutation.mutate();
  }

  async function handleApplyPenalty() {
    applyPenaltyMutation.mutate({ orderId });
  }

  async function handleBuyerRefundSubmit(formValues: BuyerRefundDTOV2) {
    try {
      if (showWalletDetails) {
        await execute().then(() =>
          refundToWalletMutation.mutate({
            orderId,
            walletId: orderDetails.walletId,
            refundAmount: Number(getValues('amount')),
          })
        );
        return;
      }
      await execute().then(() =>
        refundMutation.mutate({ orderId, values: formValues })
      );
    } catch (err) {
      resetStatus();
    }
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
      {(refundMutation.isLoading || refundToWalletMutation.isLoading) && (
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
            Are you sure you want to submit a payment for &#123; Refund &#125;
            with the amount {getValues('amount')} for the buyer{' '}
            {getMatchedOrder?.buyer.name}
          </Text>
        </Box>
      </ConfirmationDialog>

      <Stack direction="vertical" gap="15">
        {/* Heading - Start */}
        <FullBleedContainer>
          <Text color="static.black" fontSize="bigText" fontWeight="regular">
            Refund - Order:{' '}
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
        {/* Refund Form - Start */}
        <FullBleedContainer>
          <form
            id="buyer-refund"
            onSubmit={handleSubmit(handleBuyerRefundSubmit)}
          >
            <Stack direction="horizontal" gap="20">
              {/* Left  - Start */}
              <Stack direction="vertical" gap="10" flex="1">
                <FormField
                  label="Payment (Refund) Method"
                  htmlFor="payment-method"
                  error={errors.paymentMethod?.message}
                >
                  <Controller
                    control={control}
                    name="paymentMethod"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        // ts-ignore
                        isDisabled={
                          orderDetails?.paymentMethod == 'TABBY' ||
                          orderDetails?.paymentMethod == 'EMKAN' ||
                          orderDetails?.paymentMethod == 'TAMARA'
                        }
                        value={
                          orderDetails?.paymentMethod == 'TABBY'
                            ? {
                                displayName: 'Close Tabby',
                                label: 'TabbyCannotBeRefunded',
                                recommended: false,
                              }
                            : orderDetails?.paymentMethod == 'TAMARA'
                            ? {
                                displayName: 'Tamara orders cannot be refunded',
                                label: 'TamaraCannotBeRefunded',
                                recommended: false,
                              }
                            : orderDetails?.paymentMethod == 'EMKAN'
                            ? {
                                displayName:
                                  'EMKAN refunds must be through the Merchant Portal.',
                                label: 'EmkanCannotBeRefunded',
                                recommended: false,
                              }
                            : value
                        }
                        onChange={(paymentMethod) => {
                          handlePaymentSelect(paymentMethod);
                          onChange(paymentMethod);
                        }}
                        styles={selectStyles}
                        options={orderDetails?.paymentMethods}
                        getOptionLabel={(option: IPaymentMethod) =>
                          option.displayName
                        }
                        getOptionValue={(option: IPaymentMethod) =>
                          option.label
                        }
                        id="payment-method"
                        instanceId="payment-method"
                      />
                    )}
                  />
                </FormField>
                {orderDetails?.paymentMethod != 'TABBY' &&
                  orderDetails?.paymentMethod != 'EMKAN' &&
                  orderDetails?.paymentMethod != 'TAMARA' && (
                    <>
                      <FormField
                        label="Refund Amount to Pay"
                        htmlFor="pay-amount"
                        error={errors.amount?.message}
                      >
                        <Input
                          disabled={
                            getValues('paymentMethod.label') ===
                              INSTANT_REFUND ||
                            getValues('paymentMethod.label') ===
                              REFUND_TO_WALLET
                              ? false
                              : true
                          }
                          id="pay-amount"
                          autoComplete="off"
                          {...register('amount')}
                        />
                      </FormField>
                      {showBankDetails && !showWalletDetails && (
                        <>
                          <FormField
                            label="IBAN"
                            htmlFor="iban"
                            error={errors.iban?.message}
                          >
                            <Input
                              id="iban"
                              placeholder="IBAN"
                              autoComplete="off"
                              disabled
                              {...register('iban')}
                            />
                          </FormField>
                          <Stack direction="horizontal" gap="5">
                            <Box cssProps={{ flex: 1 }}>
                              <Controller
                                control={control}
                                name="bank"
                                render={({ field: { onChange, value } }) => (
                                  <BankSelect
                                    isDisabled
                                    onChange={onChange}
                                    value={value as BankV2}
                                    error={errors.bank?.message}
                                  />
                                )}
                              />
                            </Box>
                            <Box cssProps={{ flex: 1 }}>
                              <FormField
                                label="Account Name"
                                htmlFor="account-name"
                                error={errors.accountName?.message}
                              >
                                <Input
                                  id="account-name"
                                  placeholder="Account Name"
                                  autoComplete="off"
                                  disabled
                                  {...register('accountName')}
                                />
                              </FormField>
                            </Box>
                          </Stack>
                        </>
                      )}
                      {showWalletDetails && !showBankDetails && (
                        <>
                          <FormField label="Wallet ID" htmlFor="walletId">
                            <Input
                              id="walletId"
                              placeholder="Wallet ID"
                              autoComplete="off"
                              disabled
                              value={orderDetails.walletId}
                            />
                          </FormField>
                          <Stack direction="horizontal" gap="5">
                            <Box cssProps={{ flex: 1 }}>
                              <FormField
                                label="Wallet Balance"
                                htmlFor="walletBalance"
                              >
                                <Input
                                  id="walletBalance"
                                  placeholder="Wallet Balance"
                                  autoComplete="off"
                                  disabled
                                  value={orderDetails.walletBalance}
                                />
                              </FormField>
                            </Box>
                            <Box cssProps={{ flex: 1 }}>
                              <FormField
                                label="Wallet Status"
                                htmlFor="walletStatus"
                              >
                                <Input
                                  id="walletStatus"
                                  placeholder="Wallet Status"
                                  autoComplete="off"
                                  disabled
                                  value={orderDetails.walletStatus}
                                />
                              </FormField>
                            </Box>
                          </Stack>
                        </>
                      )}
                    </>
                  )}
                {orderDetails?.paymentMethod == 'TAMARA' && (
                  <>
                    <Stack direction="horizontal" gap="5">
                      <Box cssProps={{ flex: 1 }}>
                        <FormField
                          label="Credit Amount"
                          htmlFor="credit-amount"
                          error={errors.accountName?.message}
                        >
                          <Input
                            disabled
                            id="credit-amount"
                            autoComplete="off"
                            value={payoutStatus?.amount}
                          />
                        </FormField>
                      </Box>
                      <Box cssProps={{ flex: 1 }}>
                        <FormField
                          label="Credit Status"
                          htmlFor="credit-status"
                          error={errors.accountName?.message}
                        >
                          <Input
                            disabled
                            id="credit-status"
                            autoComplete="off"
                            value={payoutStatus?.status}
                          />
                        </FormField>
                      </Box>
                    </Stack>
                  </>
                )}
                {(orderDetails?.paymentMethod == 'TABBY' ||
                  orderDetails?.paymentMethod == 'EMKAN') && (
                  <>
                    <Box cssProps={{ flex: 1 }}>
                      <FormField
                        label="Refund Amount to Pay"
                        htmlFor="refund-amount"
                        error={errors.accountName?.message}
                      >
                        <Input
                          disabled
                          id="refund-amount"
                          autoComplete="off"
                          value={orderDetails?.refundAmount}
                        />
                      </FormField>
                    </Box>
                    <Box cssProps={{ flex: 1 }}>
                      <FormField
                        label="Tabby Capture Status"
                        htmlFor="tabby-capture"
                        error={errors.accountName?.message}
                      >
                        <Input
                          disabled
                          id="tabby-capture"
                          autoComplete="off"
                          value={orderDetails?.captureStatus}
                        />
                      </FormField>
                    </Box>
                  </>
                )}

                <Box cssProps={{ marginTop: 'auto' }}>
                  {orderDetails?.paymentMethod != 'TABBY' &&
                  orderDetails?.paymentMethod != 'TAMARA' &&
                  orderDetails?.paymentMethod !== 'EMKAN' ? (
                    <Button
                      disabled={
                        refundToWalletMutation.isLoading ||
                        refundMutation.isLoading ||
                        orderDetails?.isRefundSuccess ||
                        orderDetails?.isReversalSuccess ||
                        orderDetails?.isSuccessRefundToWallet ||
                        (!showWalletDetails &&
                          orderDetails?.paymentMethod === 'MADFU')
                      }
                      form="buyer-refund"
                      type="submit"
                      variant="filled"
                    >
                      {showWalletDetails
                        ? 'Refund To Wallet'
                        : 'Submit Payment'}
                    </Button>
                  ) : orderDetails?.paymentMethod != 'TAMARA' ? (
                    <Button
                      disabled={orderDetails?.captureStatus != 'Not Captured'}
                      form="buyer-refund"
                      type="button"
                      variant="filled"
                      onClick={handleClosePayment}
                    >
                      {orderDetails?.captureStatus == 'Closed'
                        ? 'Closed'
                        : 'Close Payment'}
                    </Button>
                  ) : (
                    <Button
                      disabled={payoutStatus.status != 'Pending'}
                      form="buyer-refund"
                      type="button"
                      variant="filled"
                      onClick={handleCancelPayout}
                    >
                      {'Cancel Payout'}
                    </Button>
                  )}
                  <Box
                    // to take into account inputs
                    // invisible error fields
                    cssProps={{
                      marginTop: 4,
                      opacity: 0,
                      fontWeight: 'smallText',
                      fontSize: 'smallText',
                    }}
                  >
                    spacer
                  </Box>
                </Box>
              </Stack>
              {/* Left  - End */}
              {/* Right  - Start */}
              <Stack direction="vertical" gap="10" flex="1">
                <FormField
                  label="Buyer Payment Method"
                  htmlFor="buyer-payment-method"
                >
                  <Input
                    id="buyer-payment-method"
                    autoComplete="off"
                    disabled
                    value={orderDetails?.paymentMethod}
                  />
                </FormField>
                <FormField
                  label="Grand Total for Buyer"
                  htmlFor="grand-total-buyer"
                >
                  <Input
                    id="grand-total-buyer"
                    disabled
                    autoComplete="off"
                    // {...register('grandTotal')}
                    value={orderDetails?.grandTotal}
                  />
                </FormField>
                <FormField label="Time Since Order" htmlFor="time-since-order">
                  <Input
                    disabled
                    id="time-since-order"
                    autoComplete="off"
                    value={
                      orderDetails?.orderDate
                        ? formatDistanceToNow(new Date(orderDetails?.orderDate))
                        : ''
                    }
                  />
                </FormField>
                {/* deduct fees section */}
                {orderDetails?.paymentMethod != 'TABBY' && (
                  <>
                    <Box>
                      <Text
                        fontSize="bigSubtitle"
                        fontWeight="baseText"
                        color="static.black"
                      >
                        Seller Penality
                      </Text>
                    </Box>
                    <Stack direction="horizontal" gap="30">
                      <Box cssProps={{ flex: 1 }}>
                        <FormField
                          label="Seller Wallet Balance"
                          htmlFor="seller-wallet-balance"
                          error={errors.accountName?.message}
                        >
                          <Input
                            disabled
                            id="seller-wallet-balance"
                            placeholder="Seller Wallet Balance"
                            autoComplete="off"
                            value={`SAR ${orderDetails?.walletTotalBalance.toFixed(
                              3
                            )}`}
                          />
                        </FormField>
                        {applyPenaltyFee && (
                          <Text
                            fontSize="baseText"
                            fontWeight="baseText"
                            color={
                              applyPenaltyFee && deductFeeStatus
                                ? 'static.blue'
                                : 'static.gray'
                            }
                          >
                            Deducted & transferred successfully
                          </Text>
                        )}
                      </Box>
                      <Box cssProps={{ flex: 1 }}>
                        <Text
                          fontSize="baseText"
                          fontWeight="baseText"
                          color="static.black"
                        >
                          Deducts listing fees
                        </Text>
                        <CancelButton
                          disabled={
                            !deductFee ||
                            !deductFeeStatus ||
                            applyPenaltyMutation.isLoading
                          }
                          type="button"
                          form="buyer-refund"
                          variant="darkFilled"
                          onClick={handleApplyPenalty}
                        >
                          {'Apply Penalty'}
                        </CancelButton>
                        <Text
                          fontSize="baseText"
                          fontWeight="baseText"
                          color={
                            deductFee && deductFeeStatus
                              ? 'static.blue'
                              : 'static.gray'
                          }
                        >
                          Note: Deducts SAR {orderDetails?.listingFee}
                        </Text>
                      </Box>
                    </Stack>
                  </>
                )}
              </Stack>
              {/* Right  - End */}
            </Stack>
          </form>
        </FullBleedContainer>
        {/* Refund Form - End */}
        {/* Order Billing Details - Start */}
        <FullBleedContainer>
          <Stack direction="horizontal" gap="20">
            <Stack direction="vertical" gap="5" flex="1">
              <Stack
                direction="horizontal"
                justify="space-between
            "
              >
                <Box cssProps={{ paddingBottom: 5 }}>
                  <Text
                    fontSize="bigSubtitle"
                    fontWeight="semibold"
                    color="static.black"
                  >
                    Order Billing Details
                  </Text>
                </Box>
              </Stack>
              <OrderDetailsText
                text="Shipping Charges"
                value={orderDetails?.shippingCharges}
              />
              <OrderDetailsText
                text="Sell Price"
                value={orderDetails?.sellPrice}
              />
              <OrderDetailsText
                text="Buyer Comission"
                value={orderDetails?.buyerCommision}
              />
              <OrderDetailsText
                text="Discount Total"
                value={orderDetails?.discountTotal}
              />
              <OrderDetailsText text="VAT" value={orderDetails?.vat} />
              <OrderDetailsText
                text="Grand Total for Buyer"
                value={orderDetails?.grandTotal}
                fontWeight="semibold"
              />
              <OrderDetailsText
                text="Buyer Cancellation Fee"
                value={orderDetails?.cancellationFee}
                fontWeight="semibold"
              />
              <OrderDetailsText
                text="Refund Amount to Pay for Buyer"
                value={orderDetails?.refundAmountWithFeeToPay}
                fontWeight="semibold"
              />
              <OrderDetailsText
                text="Reservation amount to be refunded from DM"
                value={orderDetails?.reservationAmount}
                fontWeight="semibold"
              />
              <OrderDetailsText
                text="Remaining amount to be refunded offline"
                value={orderDetails?.reservationRemainingAmount}
                fontWeight="semibold"
              />
            </Stack>
            <Stack direction="vertical" gap="10" flex="1"></Stack>
          </Stack>
        </FullBleedContainer>
        {/* Order Billing Details - End */}
        {/* Payment History - Start */}
        <PaymentHistoryTable
          orderId={orderId}
          orderNumber={getMatchedOrder?.orderNumber as string}
        />
        <FullBleedContainer>
          <WalletTransactionsTable orderId={orderId} />
        </FullBleedContainer>
        {/* Payment History - End */}
      </Stack>
    </CommonModal>
  );
}
