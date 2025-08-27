import { useMemo, useEffect, useState } from 'react';

import Select from 'react-select';
import { Control, Controller } from 'react-hook-form';

import { useOrderStatusesByCurrentStatus } from '../../hooks';
import { selectStyles } from '../styles';

export type statusesSubmodules = 'refund' | 'payout' | 'order' | 'dispute';

type SelectOrderStatusProps = {
  orderDetails: any;
  control: Control<any>;
  submodule: statusesSubmodules;
  styles?: any;
};

export const SelectOrderStatus = ({
  orderDetails,
  control,
  styles,
  submodule,
}: SelectOrderStatusProps) => {
  const { data: editOrderDetailStatuses } = useOrderStatusesByCurrentStatus(
    orderDetails?.id,
    submodule
  );

  const [selectedValue, setSelectedValue] = useState<any | null>(null);

  const currentValue = useMemo(
    () => ({
      id: orderDetails?.statusId,
      displayName: orderDetails?.orderData?.orderStatus,
      name: orderDetails?.orderData?.status?.split(' ').join('-').toLowerCase(),
    }),
    [orderDetails]
  );

  useEffect(() => {
    setSelectedValue(currentValue);
  }, [orderDetails?.statusId]);

  useEffect(() => {
    if (selectedValue && editOrderDetailStatuses?.length) {
      const valueExists = editOrderDetailStatuses.find(
        (option: any) => option?.id === selectedValue.id
      );
      if (!valueExists) {
        setSelectedValue(currentValue);
      }
    }
  }, [selectedValue, editOrderDetailStatuses, currentValue]);

  return (
    <Controller
      control={control}
      name="orderStatus"
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
          styles={styles || selectStyles}
          instanceId="order-status-select"
          id="order-status-select"
          options={editOrderDetailStatuses}
          isSearchable={true}
          isDisabled={!!!editOrderDetailStatuses}
        />
      )}
    />
  );
};
