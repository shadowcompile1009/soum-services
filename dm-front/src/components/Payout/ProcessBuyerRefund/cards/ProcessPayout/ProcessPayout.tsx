import { useRef } from 'react';

import { SelectInstance } from 'react-select';

import { Box } from '@src/components/Box';
import { Card } from '@src/components/Card';
import { Stack } from '@src/components/Layouts';
import { ProcessPayoutIcon } from '@src/components/Shared/ProcessPayoutIcon';
import { Text } from '@src/components/Text';
import { Button } from '@src/components/Button';

import { SelectPayoutStatus } from './PayoutStatusSelect';

export const ProcessPayout = () => {
  const ref = useRef<SelectInstance>(null);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const payoutStatus = ref.current?.getValue();
    console.log('Payout Status', payoutStatus);
  };

  return (
    <Card
      heading="Process Payout"
      icon={<ProcessPayoutIcon />}
      paddingBottom="0"
      fontSize="1.5rem"
      paddingBodyX="0"
    >
      <Stack direction="vertical" gap="0.75rem">
        <Stack
          direction="horizontal"
          borderBottom="0.66px solid #C2C2C2"
          margin="0 2.1875rem 0 58px"
          padding="0 0 0.25rem"
          justify="space-between"
        >
          <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
            <Text
              fontWeight="regular"
              fontSize="bigText"
              color="static.blues.500"
            >
              Payout Status
            </Text>
          </Box>
          <SelectPayoutStatus ref={ref} />
        </Stack>

        <Stack
          direction="horizontal"
          margin="0 2.1875rem 0 58px"
          padding="0 0 0.25rem"
          justify="space-between"
        >
          <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
            <Text
              fontWeight="regular"
              fontSize="bigText"
              color="static.blues.500"
            >
              Payout amount to pay
            </Text>
          </Box>
          <Box
            cssProps={{
              borderRadius: '0.25rem',
              backgroundColor: '#6c757d13',
              display: 'flex',
              alignItems: 'center',
              height: '2.125rem',
              width: '18rem',
              paddingLeft: '0.75rem',
            }}
          >
            200
          </Box>
        </Stack>
        <Stack
          direction="horizontal"
          margin="0 35px 0 58px"
          padding="0 0 0.25rem"
          justify="right"
        >
          <Button onClick={handleSubmit} variant="filled">
            Submit
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};
