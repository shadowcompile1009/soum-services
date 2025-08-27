import { Loader } from '@/components/Loader';
import { Box } from '@/components/Box';
import { CommonModal, FullBleedContainer } from '@/components/Modal';
import { Text } from '@/components/Text';
import { Stack } from '@/components/Layouts';
import { PaymentLogs } from '@/models/PaymentLogs';
import { FormField, Input } from '@/components/Form';

interface BuyerRefundModalProps {
  rowData?: PaymentLogs;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentLogsModal(props: BuyerRefundModalProps) {
  const { rowData, isOpen, onClose } = props;

  if (!rowData) {
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
      <Stack direction="vertical" gap="15">
        {/* Heading - Start */}
        <FullBleedContainer>
          <Text color="static.black" fontSize="bigText" fontWeight="regular">
            Payment Log - Order:{' '}
            <Text
              as="span"
              fontSize="bigText"
              fontWeight="regular"
              color="static.blues.400"
            >
              {rowData?.orderId}
            </Text>
          </Text>
        </FullBleedContainer>

        <FullBleedContainer>
          <form id="payment-logs-form">
            <Stack direction="horizontal" gap="20">
              {/* Left Section */}
              <Stack direction="vertical" gap="10" flex="1">
                <FormField label="User Name" htmlFor="user-name">
                  <Input id="user-name" value={rowData?.userName} disabled />
                </FormField>
                <FormField label="Order ID" htmlFor="order-id">
                  <Input id="order-id" value={rowData?.orderId} disabled />
                </FormField>
                <FormField label="Action Date" htmlFor="action-date">
                  <Input
                    id="action-date"
                    value={new Date(rowData?.actionDate).toLocaleString()}
                    disabled
                  />
                </FormField>
                <FormField label="Product ID" htmlFor="product-id">
                  <Input id="product-id" value={rowData?.productId} disabled />
                </FormField>
                <FormField label="SOUM Number" htmlFor="soum-number">
                  <Input
                    id="soum-number"
                    value={rowData?.soumNumber}
                    disabled
                  />
                </FormField>
              </Stack>

              {/* Right Section */}
              <Stack direction="vertical" gap="10" flex="1">
                <FormField label="Mobile Number" htmlFor="mobile-number">
                  <Input
                    id="mobile-number"
                    value={rowData?.mobileNumber}
                    disabled
                  />
                </FormField>

                <FormField label="Payment Provider" htmlFor="payment-provider">
                  <Input
                    id="payment-provider"
                    value={rowData?.paymentProvidor}
                    disabled
                  />
                </FormField>
                <FormField label="Amount" htmlFor="amount">
                  <Input id="amount" value={`$${rowData?.amount}`} disabled />
                </FormField>
                <FormField label="Payment Error ID" htmlFor="payment-error-id">
                  <Input
                    id="payment-error-id"
                    value={rowData?.paymentErrorId}
                    disabled
                  />
                </FormField>
              </Stack>
            </Stack>
            <FormField label="Error Message" htmlFor="error-message">
              <pre
                id="error-message"
                style={{
                  height: '200px',
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                  backgroundColor: '#E4E4E4',
                  border: '1px solid #ddd',
                  color: '#FB4646',
                  padding: '10px',
                  borderRadius: 4,
                  borderColor: '#E4E4E4',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                }}
              >
                {(() => {
                  try {
                    // Attempt to parse and format the JSON string
                    return rowData?.errorMessage
                      ? JSON.stringify(
                          JSON.parse(rowData.errorMessage),
                          null,
                          2
                        )
                      : 'No error message available.';
                  } catch (error) {
                    // Handle cases where the content is not valid JSON
                    return (
                      rowData?.errorMessage || 'Invalid error message format.'
                    );
                  }
                })()}
              </pre>
            </FormField>
          </form>
        </FullBleedContainer>
      </Stack>
    </CommonModal>
  );
}
