import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { usePayoutStatus } from './hooks/usePayoutStatus';
import { Loader } from '../Loader';
import { CircleArrowIcon } from '@/components/Shared/CircleArrowIcon';
import { IconContainer } from '@/components/Shared/IconContainer';

const IconButton = styled(Button)(() =>
  css({
    padding: '4px',
    minWidth: 'auto',
    height: 'auto',
    '&:hover': {
      backgroundColor: 'transparent',
      svg: {
        color: 'static.blues.400',
      },
    },
  })
);

interface PayoutStatusCheckProps {
  orderId: string;
  refetchUpfronts?: () => Promise<any>;
}

export function PayoutStatusCheck(props: PayoutStatusCheckProps) {
  const { orderId, refetchUpfronts } = props;
  const { isFetching, refetch } = usePayoutStatus(orderId, refetchUpfronts);

  const handleStatusCheck = async () => {
    await refetch();
  };

  return (
    <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
      {isFetching ? (
        <Loader size="16px" border="static.blue" marginRight="0" />
      ) : (
        <IconButton
          variant="outline"
          onClick={handleStatusCheck}
          disabled={isFetching}
        >
          <IconContainer>
            <CircleArrowIcon />
          </IconContainer>
        </IconButton>
      )}
    </Box>
  );
}
