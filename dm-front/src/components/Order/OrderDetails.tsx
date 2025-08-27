import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import css from '@styled-system/css';
import { format } from 'date-fns';
import Select from 'react-select';
import { useMutation } from '@tanstack/react-query';

import { Loader } from '@/components/Loader';
import { Button } from '@/components/Button';
import { styles } from '@/components/Shared/commonSelectStyles';
import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { TableLoader } from '@/components/TableLoader';
import { TableContainer } from '@/components/Shared/TableComponents';
import { Card } from '@/components/Card';
import { OrderIcon } from '@/components/Sidebar/OrderIcon';
import { UserIcon } from '@/components/Sidebar/UserIcon';
import { toast } from '@/components/Toast';
import { Order } from '@/models/Order';

import {
  useOrderDetail,
  useNCTReasonByOrderId,
  useNCTReasons,
  useOrderStatuses,
  useRelistProductMutation,
} from './hooks';
import { useOrderPenalties } from '@/components/Order/hooks/useOrderPenalties';

export interface ButtonProps {
  flexBasis?: string;
}

const CardsGrid = styled('div')(() => {
  return css({
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginRight: -10,
    marginLeft: -10,
  });
});

const CardItem = styled('div')<ButtonProps>((props) => {
  const { flexBasis = '24%' } = props;
  return css({
    flexBasis: flexBasis,
    padding: 10,
    '@media (max-width: 960px)': {
      flexBasis: '100%',
    },
  });
});

const GenerateSmsaTrackingId = styled.span(() =>
  css({
    cursor: 'pointer',
    color: 'static.blue',
    textDecoration: 'underline',
  })
);

export function OrderDetails() {
  const selectRef = useRef();
  const router = useRouter();

  const { query } = router;
  const { id } = query;
  const { isLoading, data } = useOrderDetail(id as string);
  const orderDetails = data;

  // get reasons list
  const { data: NCTReasons } = useNCTReasons();
  const { data: penaltyData } = useOrderPenalties();

  // get reason by id
  const mappedNCTReasons = useMemo(
    () => Order.mapNCTReasons(NCTReasons || []),
    [NCTReasons]
  );
  const { data: mappedNCTReasonById } = useNCTReasonByOrderId(id as string);
  // set reason value after update
  const [NCTReason, setNCTReason] = useState<any>();
  const [currentPenalty, setCurrentPenalty] = useState<any>();
  const [penalties, setPenalties] = useState<any>();

  // const {data: reverseSmsaTrackingId} = useSMSATrackingByOrderId(id as string);
  const reverseSmsaTracking = useMutation(
    () => {
      return Order.getReverseSmsaTrackingById(id as string);
    },
    {
      onSuccess(data: string) {
        orderDetails.reverseSMSATrackingNumber = data;
        toast.success(toast.getMessage('onGenerateSmsaTrackingSuccess'));
      },
      onError() {
        toast.error(toast.getMessage('onGenerateSmsaTrackingError'));
      },
    }
  );

  const orderStatuses = useOrderStatuses();
  const relistProductMutation = useRelistProductMutation();

  const getReverseSmsaTracking = () => {
    reverseSmsaTracking.mutate();
  };

  const relistProduct = () => {
    relistProductMutation.mutate({ dmoId: orderDetails?.id as string });
  };

  const getOrderStatusName = (id: string) => {
    if (id) {
      const name = [...orderStatuses].filter((statusId) => id == statusId.id);
      return name[0]?.displayName;
    }
  };

  useEffect(() => {
    setNCTReason(mappedNCTReasonById);
  }, [mappedNCTReasonById]);

  useEffect(() => {
    if (penaltyData?.config) {
      setPenalties(
        penaltyData.config.map((p: string) => ({
          id: p,
          name: p,
        }))
      );
    }

    if (orderDetails) {
      setCurrentPenalty({
        id: orderDetails.orderData?.penalty,
        name: orderDetails.orderData?.penalty,
      });
    }
  }, [penaltyData, orderDetails]);

  const changeNCTReasonMutation = useMutation(
    ({
      orderId,
      nctReasonId,
    }: {
      orderId: string;
      nctReasonId: string;
    }): Promise<void> => {
      return Order.updateNCTReason(orderId, nctReasonId);
    },
    {
      onSuccess: () => {
        toast.success(toast.getMessage('onUpdateNCTReasonSuccess'));
      },
      onError: (error: any) => {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(toast.getMessage('onUpdateNCTReasonError'));
        }
      },
    }
  );

  const changePenaltyMutation = useMutation(
    ({
      sellerId,
      id,
      penalty,
    }: {
      sellerId: string;
      id: string;
      penalty: number;
    }): Promise<void> => {
      return Order.updatePenalty(sellerId, id, penalty);
    },
    {
      onSuccess: () => {
        toast.success(toast.getMessage('onUpdateNCTPenaltySuccess'));
      },
      onError: (error: any) => {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(toast.getMessage('onUpdateNCTPenaltyError'));
        }
      },
    }
  );

  const onChangeNct = useCallback(
    (newValue: any, clearValueOnError: () => void) => {
      return changeNCTReasonMutation.mutate(
        { orderId: id as string, nctReasonId: newValue.id },
        {
          onError() {
            clearValueOnError();
          },
          onSuccess() {
            setNCTReason(newValue);
          },
        }
      );
    },
    // we need only the first closure of handleSelect
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onChangePenalty = useCallback(
    (newValue: any, clearValueOnError: () => void) => {
      return changePenaltyMutation.mutate(
        {
          sellerId: orderDetails.orderData.sellerId,
          id: data.id,
          penalty: newValue,
        },
        {
          onError() {
            clearValueOnError();
          },
          onSuccess() {
            setCurrentPenalty(newValue);
          },
        }
      );
    },
    // we need only the first closure of handleSelect
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onInputPenalty = useCallback((value: any) => {
    const penalty = parseInt(value);

    if (isNaN(penalty) || penalty < 1) {
      return;
    }

    onChangePenalty(
      {
        id: penalty,
        name: penalty,
      },
      () => {}
    );
  }, []);

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );
  return (
    <>
      <Text
        fontWeight="bigSubtitle"
        fontSize="headingThree"
        color="static.black"
      >
        {orderDetails?.orderData?.orderNumber}
      </Text>
      <CardsGrid>
        <CardItem flexBasis="30%">
          <Card heading="Order Details" icon={<OrderIcon />}>
            {/* Order Details - Start */}
            <Stack direction="vertical" gap="12">
              <Stack direction="horizontal" gap="2" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Order ID
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.orderNumber}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Product ID
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.productId}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Order Date
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails && orderDetails?.createdAt && (
                      <>
                        <span>
                          {format(
                            new Date(orderDetails?.createdAt),
                            'dd/MM/yyyy'
                          )}
                        </span>
                        <br />
                        <span>
                          {format(
                            new Date(orderDetails?.createdAt),
                            'hh:mm:ss aa'
                          )}
                        </span>
                      </>
                    )}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Order Type
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.orderType}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Assigned Logistics
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.logistic}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      SMSA Tracking
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.trackingNumber}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Pickup Tracking
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.pickUpTrackingNumber}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Order Status
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {getOrderStatusName(orderDetails?.statusId)}
                  </Text>
                </Box>
              </Stack>

              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      NCT Reason
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Select
                    isDisabled={false}
                    // check useState if value not return from backside
                    value={NCTReason}
                    // @ts-ignore
                    styles={styles}
                    // @ts-ignore
                    onChange={onChangeNct}
                    // @ts-ignore
                    ref={selectRef}
                    placeholder="---"
                    isLoading={false}
                    options={mappedNCTReasons}
                    getOptionLabel={(option) => option.displayName}
                    getOptionValue={(option) => option.id}
                    isSearchable={true}
                    id="nct-reason-select"
                    instanceId="nct-reason-select"
                  />
                </Box>
              </Stack>

              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      NCT Penalty
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Select
                    isDisabled={!NCTReason}
                    // check useState if value not return from backside
                    value={currentPenalty}
                    // @ts-ignore
                    styles={styles}
                    // @ts-ignore
                    onChange={onChangePenalty}
                    // @ts-ignore
                    ref={selectRef}
                    placeholder="---"
                    isLoading={false}
                    options={penalties}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    isSearchable={true}
                    onInputChange={_.debounce(onInputPenalty, 750)}
                    id="order-penalty-select"
                    instanceId="order-penalty-select"
                  />
                </Box>
              </Stack>

              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Reverse SMSA Tracking
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                    onClick={getReverseSmsaTracking}
                  >
                    {/* {orderDetails?.trackingNumber} */}
                    {/* Generate */}
                    {!orderDetails?.reverseSMSATrackingNumber ? (
                      <GenerateSmsaTrackingId>Generate</GenerateSmsaTrackingId>
                    ) : (
                      orderDetails?.reverseSMSATrackingNumber
                    )}
                  </Text>
                </Box>
              </Stack>
              <Box>
                {relistProductMutation.isLoading ? (
                  <Loader size="12px" border="static.blue" />
                ) : !orderDetails?.isProductRelisted &&
                  getOrderStatusName(orderDetails?.statusId) === 'Refunded' ? (
                  <Button onClick={relistProduct} variant="filled">
                    Relist Product
                  </Button>
                ) : (
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.blues.400"
                  >
                    Product Relisted
                  </Text>
                )}
              </Box>
            </Stack>
          </Card>
        </CardItem>
        <CardItem flexBasis="26%">
          <Card heading="Billing Details" icon={<OrderIcon />}>
            <Stack direction="vertical" gap="12">
              {/* Billing Details - Start */}
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Buyer Grand Total
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.grandTotal}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Buyer Payment Status
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.paymentStatus}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Seller Payout
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.payoutAmount}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Product Sell Price
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.sellPrice}
                  </Text>
                </Box>
              </Stack>
              {/* Price Quality Extra Commission row */}
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Price Quality Extra Commission
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.price_quality_extra_commission ||
                      'N/A'}
                  </Text>
                </Box>
              </Stack>
            </Stack>
          </Card>
        </CardItem>
        <CardItem flexBasis="22%">
          <Card heading="Buyer Details" icon={<UserIcon />}>
            {/* Buyer Details - Start */}
            <Stack direction="vertical" gap="12">
              <Stack direction="horizontal" gap="2" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Name
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.buyerName}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Phone
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.buyerPhone}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      City
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.buyerCity}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Address
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                    textAlign="right"
                  >
                    {orderDetails?.orderData?.buyerAddress}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      IBAN
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.buyerIBAN || 'N/A'}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Bank Name
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.buyerBankName || 'N/A'}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Bank BIC
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.buyerBankBIC || 'N/A'}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Account Name
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.buyerAccountName || 'N/A'}
                  </Text>
                </Box>
              </Stack>
            </Stack>
          </Card>
        </CardItem>
        <CardItem flexBasis="22%">
          <Card heading="Seller Details" icon={<UserIcon />}>
            {/* Seller Details - Start */}
            <Stack direction="vertical" gap="12">
              <Stack direction="horizontal" gap="2" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Seller Type
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.sellerType}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" gap="2" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Name
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.sellerName}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Phone
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.sellerPhone}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      City
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.sellerCity}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Address
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                    textAlign="right"
                  >
                    {orderDetails?.orderData?.sellerAddress}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      IBAN
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.sellerIBAN}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Bank Name
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.sellerBankName}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="horizontal" justify="space-between">
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Bank BIC
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.sellerBankBIC || 'N/A'}
                  </Text>
                </Box>
              </Stack>
              <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
              >
                <Box>
                  <Stack direction="vertical" gap="4">
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.grays.500"
                    >
                      Account Name
                    </Text>
                  </Stack>
                </Box>
                <Box>
                  <Text
                    fontWeight="regular"
                    fontSize="baseText"
                    color="static.grays.500"
                  >
                    {orderDetails?.orderData?.sellerAcountName}
                  </Text>
                </Box>
              </Stack>
            </Stack>
          </Card>
        </CardItem>
      </CardsGrid>
    </>
  );
}
