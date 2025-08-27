import { useMemo } from 'react';

import { Loader } from '@/components/Loader';
import { Box } from '@/components/Box';
import { FormField, Input } from '@/components/Form';
import { CommonModal, FullBleedContainer } from '@/components/Modal';
import { Text } from '@/components/Text';
import { Stack } from '@/components/Layouts';
import { Wallet } from '@/models/Wallet';
import { useWalletDetails } from './hooks/useWalletDetails';
import { WalletTransactionsTable } from './WalletTransactionsTable';

interface WalletDetailsModalProps {
  isOpen: boolean;
  walletId: string;
  onClose: () => void;
}
export function WalletDetailsModal(props: WalletDetailsModalProps) {
  const { isOpen, walletId, onClose } = props;
  const { isLoading, isError, data } = useWalletDetails(walletId);

  const walletDetails = useMemo(
    () => Wallet.mapWalletDetails(data?.data || {}),
    [data]
  );

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

  if (isError) {
    return (
      <Text fontSize="baseText" fontWeight="regular" color="static.grays.10">
        Something went wrong
      </Text>
    );
  }

  return (
    <CommonModal onClose={onClose} isOpen={isOpen}>
      <Stack direction="vertical" gap="15">
        {/* Heading - Start */}
        <FullBleedContainer>
          <Text
            color="static.black"
            fontSize="headingThree"
            fontWeight="regular"
          >
            View Wallet
          </Text>
        </FullBleedContainer>
        {/* Heading - End */}
        {/* wallet details Form - Start */}
        <FullBleedContainer>
          <form id="wallet-details">
            <Stack direction="horizontal" gap="20">
              {/* Left  - Start */}
              <Stack direction="vertical" gap="10" flex="1">
                <FormField label="User Name" htmlFor="user-name">
                  <Input
                    disabled
                    id="user-name"
                    autoComplete="off"
                    value={walletDetails?.userName}
                  />
                </FormField>
                <FormField label="Wallet ID" htmlFor="wallet-id">
                  <Input
                    disabled
                    id="wallet-id"
                    autoComplete="off"
                    value={walletDetails?.id}
                  />
                </FormField>
              </Stack>
              {/* Left  - End */}
              {/* Left  - Start */}
              <Stack direction="vertical" gap="10" flex="1">
                <FormField label="User Number" htmlFor="user-number">
                  <Input
                    disabled
                    id="user-number"
                    autoComplete="off"
                    value={walletDetails?.userPhone}
                  />
                </FormField>
                <FormField label="Wallet Status" htmlFor="wallet-status">
                  <Input
                    disabled
                    id="wallet-status"
                    autoComplete="off"
                    value={walletDetails?.status}
                  />
                </FormField>
              </Stack>
              {/* Left  - End */}
              {/* placeholder stack to add space between fields in the middle */}
              <Stack></Stack>
              {/* Left  - Start */}
              <Stack direction="vertical" gap="10" flex="1">
                <FormField label="Total Balance" htmlFor="total-Balance">
                  <Input
                    disabled
                    id="total-Balance"
                    autoComplete="off"
                    value={walletDetails?.totalBalance}
                  />
                </FormField>
                <FormField label="On Hold Balance" htmlFor="onhold-balance">
                  <Input
                    disabled
                    id="onhold-balance"
                    autoComplete="off"
                    value={walletDetails?.onholdBalance}
                  />
                </FormField>
              </Stack>
              {/* Left  - End */}
              {/* Right  - Start */}
              <Stack direction="vertical" gap="10" flex="1">
                <FormField
                  label="Available Balance"
                  htmlFor="available-balance"
                >
                  <Input
                    disabled
                    id="available-balance"
                    autoComplete="off"
                    value={walletDetails?.availableBalance}
                  />
                </FormField>
                <FormField
                  label="Pending Withdrawal Balance"
                  htmlFor="pending-balance"
                >
                  <Input
                    disabled
                    id="pending-balance"
                    autoComplete="off"
                    value={walletDetails?.pendingTransactions}
                  />
                </FormField>
              </Stack>
              {/* Right  - End */}
            </Stack>
          </form>
        </FullBleedContainer>
        {/* wallet details Form - End */}

        {/* wallet transactions - Start */}
        <WalletTransactionsTable walletId={walletId} />
        {/* wallet transactions - End */}
      </Stack>
    </CommonModal>
  );
}
