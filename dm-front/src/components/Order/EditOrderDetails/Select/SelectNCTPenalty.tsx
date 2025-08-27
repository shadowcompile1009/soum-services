import { useCallback, useEffect, useState } from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import Select from 'react-select';
import _ from 'lodash';

import { useOrderPenalties } from '../../hooks/useOrderPenalties';

import { selectStyles } from '../styles';
import { OrderFormValues } from '../types';

type SelectNCTPenaltyProps = {
  control: Control<OrderFormValues>;
  NCTReason: {
    id: string;
    displayName: string;
  } | null;
  orderDetails: any;
  setValue: UseFormSetValue<OrderFormValues>;
};

export const SelectNCTPenalty = ({
  control,
  NCTReason,
  orderDetails,
  setValue,
}: SelectNCTPenaltyProps) => {
  const { data: penaltyData } = useOrderPenalties();
  const [penalties, setPenalties] = useState<
    Array<{ id: string; name: string }>
  >([]);

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
      setValue('nctPenalty', {
        id: orderDetails.orderData?.penalty,
        name: orderDetails.orderData?.penalty,
      });
    }
  }, [penaltyData, orderDetails]);

  const onInputPenalty = useCallback((value: string) => {
    const penalty = parseInt(value);
    if (isNaN(penalty) || penalty < 1) return;

    return {
      id: penalty.toString(),
      name: penalty.toString(),
    };
  }, []);

  // Check if NCTReason has a valid value
  const isDisabled = !NCTReason?.id;

  return (
    <Controller
      control={control}
      name="nctPenalty"
      render={({ field }) => (
        <Select
          {...field}
          isDisabled={isDisabled}
          // @ts-ignore
          styles={selectStyles}
          placeholder="---"
          isLoading={false}
          options={penalties}
          key={Math.random()}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          isSearchable={true}
          onInputChange={_.debounce((value) => {
            const newValue = onInputPenalty(value);
            if (newValue) {
              field.onChange(newValue);
            }
          }, 750)}
          id="order-penalty-select"
          instanceId="order-penalty-select"
        />
      )}
    />
  );
};
