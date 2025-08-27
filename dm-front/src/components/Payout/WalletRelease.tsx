import { useQuery } from '@tanstack/react-query';

import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { Stack } from '@/components/Layouts';
import { FormField, Input } from '@/components/Form';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Wallet } from '@/models/Wallet';
import { Loader } from '@/components/Loader';

interface WalletReleaseProps {
  sellerId: string;
  orderId: string;
}

export function WalletRelease(props: WalletReleaseProps) {
  const { sellerId, orderId } = props;

  const { isLoading, data } = useQuery([QUERY_KEYS.transactionDetails], () =>
    Wallet.getTransaction({ ownerId: sellerId, orderId })
  );

  return isLoading ? (
    <Loader />
  ) : (
    <Stack direction="vertical" gap="3">
      <Text
        fontWeight="semibold"
        fontSize="bigSubtitle"
        color="static.blues.500"
      >
        Credit Release
      </Text>

      <Stack direction="horizontal" gap="20">
        <Stack direction="vertical" gap="10" flex="1">
          <FormField label="Wallet ID" htmlFor="wallet-id">
            <Input
              id="Wallet ID"
              autoComplete="off"
              disabled
              value={data?.walletId}
            />
          </FormField>

          <Stack direction="horizontal" gap="2">
            <Box cssProps={{ flex: 1 }}>
              <FormField
                label="Credit Transaction #"
                htmlFor="credit-transaction"
              >
                <Input
                  id="credit-transaction"
                  autoComplete="off"
                  disabled
                  value={data?.id}
                />
              </FormField>
            </Box>
            <Box cssProps={{ flex: 1 }}>
              <FormField label="Credit Amount" htmlFor="credit-amount">
                <Input
                  id="credit-amount"
                  autoComplete="off"
                  disabled
                  value={data?.amount}
                />
              </FormField>
            </Box>
          </Stack>
        </Stack>
        <Stack direction="vertical" gap="10" flex="1">
          <Stack direction="horizontal" gap="2">
            <Box cssProps={{ flex: 1 }}>
              <FormField label="Wallet Status" htmlFor="wallet-status">
                <Input
                  id="wallet-status"
                  autoComplete="off"
                  disabled
                  value={data?.wallet.status}
                />
              </FormField>
            </Box>
            <Box cssProps={{ flex: 1 }}>
              <FormField label="Wallet Balance" htmlFor="wallet-balance">
                <Input
                  id="wallet-balance"
                  autoComplete="off"
                  disabled
                  value={data?.wallet.balance}
                />
              </FormField>
            </Box>
          </Stack>
          <Stack direction="horizontal" gap="2">
            <Box cssProps={{ flex: 1 }}>
              <FormField label="Credit Status" htmlFor="credit-status">
                <Input
                  id="credit-status"
                  autoComplete="off"
                  disabled
                  value={data?.status}
                />
              </FormField>
            </Box>
            <Box cssProps={{ flex: 1 }}>
              <FormField label="Order ID" htmlFor="order-id">
                <Input
                  id="order-id"
                  autoComplete="off"
                  disabled
                  value={data?.orderId}
                />
              </FormField>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
