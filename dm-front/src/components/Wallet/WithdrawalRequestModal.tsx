import React from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/Toast';

import { CommonModal, FullBleedContainer } from '@/components/Modal';
import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { FormField, Input } from '@/components/Form';
import { Loader } from '@/components/Loader';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { Wallet } from '@/models/Wallet';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Backdrop } from '@/components/Shared/Backdrop';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { useAwaitableComponent } from '@/components/Shared/hooks/useAwaitableComponent';
import { WalletTransactionHistoryTable } from '@/components/Shared/WalletTransactionHistoryTable';

import { useWithdrawalDetails } from './hooks/useWithdrawalDetails';

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  walledID: string;
  onClose: () => void;
}

const SubmitButton = styled(Button)(() => ({ width: '100%' }));

export function WithdrawalRequestModal(props: WithdrawalRequestModalProps) {
  const { isOpen, walledID, onClose } = props;
  const { isLoading, data } = useWithdrawalDetails(walledID);
  const queryClient = useQueryClient();
  const [status, execute, resolve, reject, resetStatus] =
    useAwaitableComponent();

  const isConfirmDialogVisible = status === 'awaiting';

  const submitRequest = useMutation(Wallet.submitWithdrawalRequest, {
    onSuccess() {
      toast.success(
        toast.getMessage('onSubmitWithdrawalRequestSuccess', data?.id)
      );
      queryClient.invalidateQueries([QUERY_KEYS.withdrawalRequests]);
      onClose();
    },
    onError(error: any) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error(
          toast.getMessage('onSubmitWithdrawalRequestError', data?.id)
        );
      }
    },
  });

  async function handleSumbitRequest(evt: React.SyntheticEvent) {
    try {
      evt.preventDefault();
      await execute().then(() => submitRequest.mutate(data?.id));
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
      {submitRequest.isLoading && (
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
            Are you sure you want to submit a withdrawal of amount &#123;{' '}
            {data?.amount} SAR &#125; in favor of {data?.user?.name}?
          </Text>
        </Box>
      </ConfirmationDialog>
      <Stack direction="vertical" gap="15">
        {/* Heading - Start */}
        <FullBleedContainer>
          <Text color="static.black" fontSize="bigText" fontWeight="regular">
            Request ID:{' '}
            <Text
              as="span"
              fontSize="bigText"
              fontWeight="regular"
              color="static.blues.400"
            >
              {data.id}
            </Text>
          </Text>
        </FullBleedContainer>
        {/* Heading - End */}
        {/* Withdrawal Form - Start */}
        <FullBleedContainer>
          <form id="withdrawal-request">
            {/* Request Details  - Start */}
            <Box marginBottom={5}>
              <Text
                as="span"
                fontSize="baseText"
                fontWeight="semibold"
                color="static.blues.400"
              >
                Request Details
              </Text>
            </Box>
            <Stack direction="horizontal" gap="10">
              {/* Left Column - Start */}
              <Stack direction="vertical" gap="5" flex="1">
                <FormField label="Wallet ID" htmlFor="wallet-id">
                  <Input id="wallet-id" value={data?.walletId} disabled />
                </FormField>
                <FormField label="Wallet Balance" htmlFor="wallet-balance">
                  <Input
                    id="wallet-balance"
                    value={data?.wallet?.balance}
                    disabled
                  />
                </FormField>
              </Stack>
              {/* Left Column - End */}
              {/* Right Column - Start */}
              <Stack direction="vertical" gap="5" flex="1">
                <FormField label="Wallet Status" htmlFor="wallet-status">
                  <Input
                    id="wallet-status"
                    value={data?.wallet?.status}
                    disabled
                  />
                </FormField>
                <FormField label="Withdraw Amount" htmlFor="withdraw-amount">
                  <Input
                    id="withdraw-amount"
                    value={`${data?.amount} SAR`}
                    disabled
                  />
                </FormField>
              </Stack>
              {/* Right Column - End */}
            </Stack>
            {/* Request Details  - Start */}
            {/* Bank Information  - Start */}
            <Box marginBottom={5}>
              <Text
                as="span"
                fontSize="baseText"
                fontWeight="semibold"
                color="static.blues.400"
              >
                Bank Information
              </Text>
            </Box>
            <Stack direction="horizontal" gap="10">
              {/* Left Column - Start */}
              <Stack direction="vertical" gap="5" flex="1">
                <FormField label="Bank IBAN" htmlFor="iban">
                  <Input id="iban" value={data?.bank?.iban} disabled />
                </FormField>
                <FormField label="Account Name" htmlFor="account-name">
                  <Input
                    id="account-name"
                    value={data?.bank?.accountName}
                    disabled
                  />
                </FormField>
              </Stack>
              {/* Left Column - End */}
              {/* Right Column - Start */}
              <Stack direction="vertical" gap="5" flex="1">
                <FormField label="Bank Name" htmlFor="bank-name">
                  <Input id="bank-name" value={data?.bank?.name} disabled />
                </FormField>
                <Box
                  cssProps={{
                    marginTop: 'auto',
                    paddingBottom: '26.7px',
                  }}
                >
                  <SubmitButton
                    form="withdrawal-request"
                    type="submit"
                    variant="filled"
                    onClick={handleSumbitRequest}
                    disabled={
                      data?.status === 'Success' || submitRequest.isLoading
                    }
                  >
                    Submit Withdrawal
                  </SubmitButton>
                </Box>
              </Stack>
              {/* Right Column - End */}
            </Stack>
            {/* Bank Information  - End */}
          </form>
        </FullBleedContainer>
        {/* Withdrawal Form - End */}
        {/* User Informationo - Start */}
        <FullBleedContainer>
          <Box marginBottom={5}>
            <Text
              as="span"
              fontSize="baseText"
              fontWeight="semibold"
              color="static.blues.400"
            >
              User Information
            </Text>
          </Box>
          <Stack direction="horizontal" gap="10">
            {/* Left Column - Start */}
            <Stack direction="vertical" gap="5" flex="1">
              <FormField label="User Name" htmlFor="user-name">
                <Input id="user-name" value={data?.user?.name} disabled />
              </FormField>
              <FormField label="Number of Deposits" htmlFor="deposit-number">
                <Input
                  id="deposit-number"
                  value={data?.user?.totalDeposits}
                  disabled
                />
              </FormField>
            </Stack>
            {/* Left Column - End */}
            {/* Right Column - Start */}
            <Stack direction="vertical" gap="5" flex="1">
              <FormField label="User Phone" htmlFor="user-phone">
                <Input
                  id="user-phone"
                  value={data?.user?.phoneNumber}
                  disabled
                />
              </FormField>
              <FormField
                label="Number of Withdrawals"
                htmlFor="withdrawal-number"
              >
                <Input
                  id="withdrawal-number"
                  value={data?.user?.totalWithdrawals}
                  disabled
                />
              </FormField>
            </Stack>
          </Stack>
        </FullBleedContainer>
        {/* User Informationo - End */}
        {/* Transaction History - Start */}
        <WalletTransactionHistoryTable transactionDetails={data?.history} />
        {/* Transaction History - End */}
      </Stack>
    </CommonModal>
  );
}
