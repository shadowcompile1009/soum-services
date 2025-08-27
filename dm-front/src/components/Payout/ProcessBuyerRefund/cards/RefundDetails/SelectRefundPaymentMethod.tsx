import Select from 'react-select';
import { Control, Controller } from 'react-hook-form';

import { IPaymentMethod } from '@src/models/OrderDetails';

import { selectStyles } from './styles';

import { RefundFormValues } from './types';

type SelectRefundPaymentMethodProps = {
  orderDetails: any;
  control: Control<RefundFormValues>;
  buyerOrderDetails: any;
};

export const SelectRefundPaymentMethod = ({
  control,
  buyerOrderDetails,
}: SelectRefundPaymentMethodProps) => {
  const paymentMethods: IPaymentMethod[] = buyerOrderDetails?.paymentMethods;

  return (
    <Controller
      control={control}
      name="refundPaymentMethod"
      defaultValue={buyerOrderDetails?.paymentMethods?.[0]}
      render={({ field }) => (
        <Select
          {...field}
          getOptionLabel={(option) => option.displayName}
          getOptionValue={(option) => option.label}
          // @ts-ignore
          styles={selectStyles}
          instanceId="refund-payment-method-select"
          id="refund-payment-method-select"
          options={paymentMethods}
          isSearchable={true}
        />
      )}
    />
  );
};
