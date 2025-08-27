import { useRouter } from 'next/router';
import styled from 'styled-components';
import css from '@styled-system/css';
import { format } from 'date-fns';

import { Box } from '@src/components/Box';
import { Stack } from '@src/components/Layouts';
import { Text } from '@src/components/Text';
import { TableLoader } from '@src/components/TableLoader';
import { TableContainer } from '@src/components/Shared/TableComponents';
import { Card } from '@src/components/Card';
import { UserIcon } from '@src/components/Sidebar/UserIcon';

import { useOrderDetailV3, useOrderStatuses } from './hooks';
import { BillingDetailsIcon } from '../Shared/BillingDetailsIcon';
import { OrderDetailsIcon } from '../Shared/OrderDetailsIcon';
import { OrderActivityLogTable } from './OrderActivityLogTable';
export interface ButtonProps {
  width?: React.CSSProperties['width'];
}

const CardsGrid = styled('div')(() => {
  return css({
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '0.875rem',
    rowGap: '1.8125rem',
  });
});

const CardItem = styled('div')<ButtonProps>((props) => {
  const { width = '21.375rem' } = props;

  return css({
    width: width,
  });
});

type DetailRow = {
  label: string;
  value: string | React.ReactNode;
};

type CardConfig = {
  heading: string;
  icon: React.ReactNode;
  width: string;
  rows: DetailRow[];
};

export function AllOrderDetails() {
  const router = useRouter();

  const { query } = router;
  const { id } = query;
  const { isLoading, data } = useOrderDetailV3(id as string);
  const orderDetails = data;

  const orderStatuses = useOrderStatuses();

  const getOrderStatusName = (id: string) => {
    if (id) {
      const name = [...orderStatuses].filter((statusId) => id == statusId.id);
      return name[0]?.displayName;
    }
  };

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  const getFormattedDateTime = (date: string) => (
    <>
      {format(new Date(date), 'dd/MM/yyyy')} -{' '}
      {format(new Date(date), 'hh:mm:ss aa')}
    </>
  );

  const orderDetailsRows: DetailRow[] = [
    { label: 'Order ID', value: orderDetails?.orderData?.orderNumber },
    { label: 'Product ID', value: orderDetails?.orderData?.productId },
    {
      label: 'Order Date',
      value: orderDetails?.createdAt
        ? getFormattedDateTime(orderDetails.createdAt)
        : '',
    },
    { label: 'Order Type', value: orderDetails?.orderData?.orderType },
    { label: 'Assigned Logistics', value: orderDetails?.logistic },
    { label: 'SMSA Tracking', value: orderDetails?.trackingNumber },
    {
      label: 'Order Status',
      value: getOrderStatusName(orderDetails?.statusId),
    },
    {
      label: 'NCT Reason',
      value: orderDetails?.orderData?.dmoNCTReason?.displayName,
    },
  ];

  const billingDetailsRows: DetailRow[] = [
    {
      label: 'Buyer Grand Total',
      value: `SAR ${orderDetails?.orderData?.grandTotal}`,
    },
    {
      label: 'Buyer Payment Status',
      value: orderDetails?.orderData?.paymentStatus,
    },
    {
      label: 'Seller Payout',
      value: `SAR ${orderDetails?.orderData?.payoutAmount}`,
    },
    {
      label: 'Product Sell Price',
      value: `SAR ${orderDetails?.orderData?.sellPrice}`,
    },
  ];

  const buyerDetailsRows: DetailRow[] = [
    { label: 'Name', value: orderDetails?.orderData?.buyerName },
    { label: 'Phone', value: orderDetails?.orderData?.buyerPhone },
    { label: 'City', value: orderDetails?.orderData?.buyerCity },
    { label: 'Address', value: orderDetails?.orderData?.buyerAddress },
    { label: 'IBAN', value: orderDetails?.orderData?.buyerIBAN },
    {
      label: 'Bank Name',
      value: orderDetails?.orderData?.buyerBankName,
    },
    {
      label: 'Bank BIC',
      value: orderDetails?.orderData?.buyerBankBIC,
    },
    {
      label: 'Account Name',
      value: orderDetails?.orderData?.buyerAccountName,
    },
  ];

  const sellerDetailsRows: DetailRow[] = [
    { label: 'Seller Type', value: orderDetails?.orderData?.sellerType },
    { label: 'Name', value: orderDetails?.orderData?.sellerName },
    { label: 'Phone', value: orderDetails?.orderData?.sellerPhone },
    { label: 'City', value: orderDetails?.orderData?.sellerCity },
    { label: 'Address', value: orderDetails?.orderData?.sellerAddress },
    { label: 'IBAN', value: orderDetails?.orderData?.sellerIBAN },
    { label: 'Bank Name', value: orderDetails?.orderData?.sellerBankName },
    {
      label: 'Bank BIC',
      value: orderDetails?.orderData?.sellerBankBIC,
    },
    { label: 'Account Name', value: orderDetails?.orderData?.sellerAcountName },
  ];

  const cardConfigs: CardConfig[] = [
    {
      heading: 'Order Details',
      icon: <OrderDetailsIcon />,
      width: '50rem',
      rows: orderDetailsRows,
    },
    {
      heading: 'Billing Details',
      icon: <BillingDetailsIcon />,
      width: '342px',
      rows: billingDetailsRows,
    },
    {
      heading: 'Buyer Details',
      icon: <UserIcon />,
      width: '26rem',
      rows: buyerDetailsRows,
    },
    {
      heading: 'Seller Details',
      icon: <UserIcon />,
      width: '26rem',
      rows: sellerDetailsRows,
    },
  ];

  const renderDetailRow = (row: DetailRow) => (
    <Stack
      key={row.label}
      direction="horizontal"
      borderBottom="0.66px solid #C2C2C2"
      padding="0.8125rem 1.0625rem"
      justify="space-between"
      marginBottom="0.25rem"
    >
      <Box>
        <Stack direction="vertical" gap="4">
          <Text
            fontWeight="regular"
            fontSize="baseText"
            color="static.blues.500"
          >
            {row.label}
          </Text>
        </Stack>
      </Box>
      <Box>
        <Text
          fontWeight="regular"
          fontSize="baseText"
          color="static.blues.500"
          textAlign="right"
        >
          {row.value}
        </Text>
      </Box>
    </Stack>
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
      {/* <Box cssProps={{ marginTop: 15, marginBottom: '2.375rem' }}>
        <TabSwitch leftText="Order Details" rightText="Invoice Details" />
      </Box> */}
      <CardsGrid>
        {cardConfigs.map((config) => (
          <CardItem key={config.heading} width={config.width}>
            <Card
              heading={config.heading}
              icon={config.icon}
              cardHeaderPadding="8px 1.0625rem"
            >
              <Stack direction="vertical" gap="0.25rem">
                {config.rows.map(renderDetailRow)}
              </Stack>
            </Card>
          </CardItem>
        ))}
      </CardsGrid>

      <OrderActivityLogTable />
    </>
  );
}
