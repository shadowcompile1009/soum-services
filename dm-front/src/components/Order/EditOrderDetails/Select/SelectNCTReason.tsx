import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Select from 'react-select';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';

import { Order } from '@src/models/Order';
import { useNCTReasonByOrderId, useNCTReasons } from '../../hooks';
import { selectStyles } from '../styles';
import { OrderFormValues } from '../types';

type SelectNCTReasonProps = {
  control: Control<OrderFormValues>;
  setValue: UseFormSetValue<OrderFormValues>;
};

export const SelectNCTReason = ({ control }: SelectNCTReasonProps) => {
  const router = useRouter();
  const { data: NCTReasons } = useNCTReasons();
  const { query } = router;
  const { id } = query;

  const [selectedValue, setSelectedValue] = useState<any | null>(null);

  const mappedNCTReasons = useMemo(
    () => Order.mapNCTReasons(NCTReasons || []),
    [NCTReasons]
  );

  const { data: mappedNCTReasonById } = useNCTReasonByOrderId(id as string);

  useEffect(() => {
    setSelectedValue(mappedNCTReasonById);
  }, [mappedNCTReasonById?.id]);

  useEffect(() => {
    if (selectedValue && mappedNCTReasons?.length) {
      const valueExists = mappedNCTReasons.find(
        (option: any) => option.id === selectedValue.id
      );
      if (!valueExists) {
        setSelectedValue(mappedNCTReasonById);
      }
    }
  }, [selectedValue, mappedNCTReasons, mappedNCTReasonById]);

  return (
    <Controller
      control={control}
      name="nctReason"
      defaultValue={mappedNCTReasonById}
      render={({ field: { onChange, ...field } }) => (
        <Select
          {...field}
          value={selectedValue}
          onChange={(option) => {
            setSelectedValue(option);
            onChange(option);
          }}
          // @ts-ignore
          styles={selectStyles}
          placeholder="Select ..."
          isLoading={false}
          options={mappedNCTReasons}
          getOptionLabel={(option: any) => option.displayName}
          getOptionValue={(option: any) => option.id}
          isSearchable={true}
          id="nct-reason-select"
          instanceId="nct-reason-select"
        />
      )}
    />
  );
};
