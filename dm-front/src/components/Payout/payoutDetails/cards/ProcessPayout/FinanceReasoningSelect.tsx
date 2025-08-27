import { useState } from 'react';

import Select from 'react-select';
import { Control, Controller } from 'react-hook-form';

import { selectStyles } from '../../styles';
import useFinanceReasons from './useFinanceReasons';

type SelectFinanceReasoningProps = {
  control: Control<any>;
  styles?: any;
};

export const SelectFinanceReasoning = ({
  control,
  styles,
}: SelectFinanceReasoningProps) => {
  const { data: finaceReasons } = useFinanceReasons();

  const options = finaceReasons?.map((reason: string) => ({
    label: reason,
    value: reason,
  }));

  const [selectedValue, setSelectedValue] = useState<any | null>(null);

  // const currentValue = useMemo(
  //   () => ({
  //     id: orderDetails?.statusId,
  //     displayName: orderDetails?.orderData?.status,
  //     name: orderDetails?.orderData?.status?.split(' ').join('-').toLowerCase(),
  //   }),
  //   [orderDetails]
  // );

  // useEffect(() => {
  //   setSelectedValue(currentValue);
  // }, [orderDetails?.statusId]);

  // useEffect(() => {
  //   if (selectedValue && editOrderDetailStatuses?.length) {
  //     const valueExists = editOrderDetailStatuses.find(
  //       (option: any) => option?.id === selectedValue.id
  //     );
  //     if (!valueExists) {
  //       setSelectedValue(currentValue);
  //     }
  //   }
  // }, [selectedValue, editOrderDetailStatuses, currentValue]);

  return (
    <Controller
      control={control}
      name="financeReasoning"
      render={({ field: { onChange, ...field } }) => (
        <Select
          {...field}
          value={selectedValue}
          onChange={(option) => {
            setSelectedValue(option);
            onChange(option);
          }}
          // @ts-ignore
          styles={styles || selectStyles}
          instanceId="finance-reasoning-select"
          id="finance-reasoning-select"
          options={options}
          isSearchable={true}
        />
      )}
    />
  );
};
