import { useMemo, useEffect, useState } from 'react';

import Select from 'react-select';
import { Control, Controller } from 'react-hook-form';

import { useDisputeStatuses } from '../hooks/useDisputeStatuses';
import { selectStyles } from '../styles';

import { DisputeFormValues } from '../types';

type SelectDisputeStatusProps = {
  orderDetails: any;
  control: Control<DisputeFormValues>;
};

export const SelectDisputeStatus = ({
  orderDetails,
  control,
}: SelectDisputeStatusProps) => {
  const { data: disputeStatuses } = useDisputeStatuses(orderDetails?.id);

  const [selectedValue, setSelectedValue] = useState<any | null>(null);

  const currentValue = useMemo(
    () => ({
      id: orderDetails?.statusId,
      displayName:
        orderDetails?.disputeStatus === 'No Dispute'
          ? orderDetails?.disputeStatus
          : orderDetails?.orderData?.status,
      name: orderDetails?.orderData?.status?.split(' ').join('-').toLowerCase(),
    }),
    [orderDetails]
  );

  useEffect(() => {
    setSelectedValue(currentValue);
  }, [orderDetails?.statusId]);

  useEffect(() => {
    if (selectedValue && disputeStatuses?.length) {
      const valueExists = disputeStatuses.find(
        (option: any) => option.id === selectedValue.id
      );
      if (!valueExists) {
        setSelectedValue(currentValue);
      }
    }
  }, [selectedValue, disputeStatuses, currentValue]);

  return (
    <Controller
      control={control}
      name="disputeStatus"
      defaultValue={currentValue}
      render={({ field: { onChange, ...field } }) => (
        <Select
          {...field}
          value={selectedValue}
          onChange={(option) => {
            setSelectedValue(option);
            onChange(option);
          }}
          getOptionLabel={(option) => option.displayName}
          getOptionValue={(option) => option.name}
          // @ts-ignore
          styles={selectStyles}
          instanceId="dispute-status-select"
          id="dispute-status-select"
          options={disputeStatuses}
          isSearchable={true}
          isDisabled={!!!disputeStatuses}
        />
      )}
    />
  );
};
