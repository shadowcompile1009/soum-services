import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { ECaptureOrderStatus, Order } from '@/models/Order';
import { toast } from '@/components/Toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';

interface CaptureLinkProps {
  orderId: string;
  captureOrderDetails: { captureStatus: string };
  children: any;
}

export function CaptureLink(props: CaptureLinkProps) {
  const { orderId, captureOrderDetails } = props;

  const [captureTitle, setCaptureTitle] = useState('Capture');
  const [captureDisableStatus, setCaptureDisableStatus] = useState(false);

  const queryClient = useQueryClient();

  const captureIndividualMutation = useMutation(
    ({ orderId }: { orderId: string }): Promise<void> => {
      return Order.captureIndividualTransaction(orderId);
    },
    {
      onSuccess: () => {
        setCaptureTitle('Capture');
        queryClient.invalidateQueries([QUERY_KEYS.bnplOrders]);
        toast.success(toast.getMessage('onCreateCaptureTransactionSuccess'));
      },
      onError: (error: any) => {
        setCaptureTitle('Capture');
        setCaptureDisableStatus(false);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(toast.getMessage('onCreateCaptureTransactionError'));
        }
      },
    }
  );

  function captureOrder() {
    setCaptureTitle('Capturing');
    setCaptureDisableStatus(true);
    captureIndividualMutation.mutate({ orderId });
  }

  function checkDisableStatus(captureStatus: string) {
    if (
      captureStatus === ECaptureOrderStatus.NotCaptured &&
      !captureDisableStatus
    ) {
      return false;
    }
    return true;
  }
  return (
    <Button
      disabled={checkDisableStatus(captureOrderDetails.captureStatus)}
      variant="filled"
      onClick={captureOrder}
    >
      {captureTitle}
    </Button>
  );
}
