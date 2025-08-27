import { useRef, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { styles } from '@/components/Shared/commonSelectStyles';
import { useChangeUpfrontStatus } from '@/components/Shared/hooks/useChangeUpfrontStatus';
import { ConsignmentStatus, Upfronts } from '@/models/Upfronts';

interface OrderStatusSelectProps {
  upfront: Upfronts;
  orderId: string;
  value: string;
  queryKey: string[];
  refetchUpfronts?: () => Promise<any>;
  isPayoutToSellerPage?: boolean;
}

export function UpfrontStatusSelect(props: OrderStatusSelectProps) {
  const {
    value,
    orderId,
    queryKey,
    upfront,
    refetchUpfronts,
    isPayoutToSellerPage = false,
  } = props;
  const selectRef = useRef(null);

  // Hardcoded status options
  const [options] = useState([
    { value: ConsignmentStatus.NEW, label: 'New' },
    { value: ConsignmentStatus.RECEIVED, label: 'Ready to Inspect' },
    { value: ConsignmentStatus.APPROVED, label: 'Approved' },
    { value: ConsignmentStatus.PAYOUT_TO_SELLER, label: 'Payout to Seller' },
    { value: ConsignmentStatus.REJECTED, label: 'Rejected' },
    { value: ConsignmentStatus.CLOSED_FULFILLED, label: 'Closed-fulfilled' },
    {
      value: ConsignmentStatus.CLOSED_UNFULFILLED,
      label: 'Closed-unfulfilled',
    },
  ]);

  const [payoutOptions] = useState([
    { value: ConsignmentStatus.PAYOUT_TO_SELLER, label: 'Payout to Seller' },
    { value: ConsignmentStatus.PAYOUT_PROCESSING, label: 'Payout Processing' },
    { value: ConsignmentStatus.TRANSFERRED, label: 'Transferred' },
  ]);

  const [transferredOptions] = useState([
    { value: ConsignmentStatus.TRANSFERRED, label: 'Transferred' },
    { value: ConsignmentStatus.CLOSED_FULFILLED, label: 'Closed-fulfilled' },
    {
      value: ConsignmentStatus.CLOSED_UNFULFILLED,
      label: 'Closed-unfulfilled',
    },
  ]);

  // Determine which options to show based on status and page
  const getOptions = () => {
    if (value === ConsignmentStatus.TRANSFERRED) {
      return transferredOptions;
    }
    return isPayoutToSellerPage ? payoutOptions : options;
  };

  // Check if select should be disabled
  const isDisabled =
    value === ConsignmentStatus.PAYOUT_TO_SELLER ||
    value === ConsignmentStatus.PAYOUT_PROCESSING;

  const mutation = useChangeUpfrontStatus(
    orderId,
    queryKey,
    upfront,
    refetchUpfronts
  );

  async function handleOnSelect(
    newValue: SingleValue<{ value: string; label: string }>
  ) {
    if (!newValue || newValue.value === value) return;
    // Call mutation to handle status update
    mutation.handleSelect(newValue.value, () => {
      if (selectRef.current) {
        // @ts-ignore: Set the select value back to current on failure
        selectRef.current?.setValue(value);
      }
    });
  }

  function getCurrentValue() {
    return getOptions().find((option) => option.value === value) || null;
  }

  return (
    <Select
      ref={selectRef}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      // @ts-ignore
      styles={styles}
      instanceId={`upfront-status-select-${orderId}`}
      id={`upfront-status-select-${orderId}`}
      onChange={handleOnSelect}
      isLoading={false}
      value={getCurrentValue()}
      options={getOptions()}
      isSearchable={true}
      placeholder="Choose Action"
      isDisabled={isDisabled}
    />
  );
}
