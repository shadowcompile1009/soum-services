import { useEffect, useMemo, useRef, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { useAwaitableComponent } from '@/components/Shared/hooks/useAwaitableComponent';
import { useMutation } from '@tanstack/react-query';

import { FinanceOrder, INCTReasons, IOrderStatus, Order, OrderStatusNameType } from '@/models/Order';
import { useNCTReasons } from '@/components/Order/hooks/useNCTReasons';
import { useOrderStatuses } from '@/components/Order/hooks/useOrderStatuses';
import { useChangeOrderStatus } from '@/components/Shared/hooks/useChangeOrderStatus';
import { styles } from '@/components/Shared/commonSelectStyles';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { toast } from '@/components/Toast';

interface OrderStatusSelectProps {
  order: Order | FinanceOrder;
  orderId: string;
  value: IOrderStatus;
  queryKey: string[];
  loadOptions?: IOrderStatus[];
  selectRules?: (...args: any[]) => any,
  selectedStatus?: string[];
  setSelectedStatus?: (status: string[]) => void;
}
export function OrderStatusSelect(props: OrderStatusSelectProps) {
  const { value, orderId, queryKey, order, loadOptions, selectRules } = props;
  const selectRef = useRef();

  const orderStatuses = useOrderStatuses();
  const [options, setOptions] = useState(() => selectRules ? selectRules(value, loadOptions) : orderStatuses);
  const mutation = useChangeOrderStatus(orderId, queryKey, order);

  const { data: NCTReasons } = useNCTReasons();
  const [NCTReason, setNCTReason] = useState<{
    id: string;
    displayName: string;
    name: string;
  }>();

  const mappedNCTReasons = useMemo(
    () => Order.mapNCTReasons(NCTReasons || []),
    [NCTReasons]
  );

  const changeNCTReasonMutation = useMutation(
    ({
      nctReasonId,
      dmoId,
      orderId,
    }: {
      nctReasonId: string;
      dmoId: string;
      orderId: string;
    }): Promise<void> => {
      return Order.createNCTReason(nctReasonId, dmoId, orderId);
    },
    {
      onSuccess: () => {
        toast.success(toast.getMessage('onCreateNCTReasonSuccess'));
      },
      onError: (error: any) => {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(toast.getMessage('onCreateNCTReasonError'));
        }
      },
    }
  );

  const upsertArr = (arr: string[], value: string) => {
    const matchedRecord = arr.filter((data: string) => data?.includes(value?.split('-')[0]))[0];

    if (matchedRecord) {
      arr = arr.filter((item: string) => item !== matchedRecord);
    }

    return [...arr, value];
  }

  const [status, execute, resolve, reject, resetStatus] =
    useAwaitableComponent();


  useEffect(() => {
    if (!selectRules) {
      setOptions(orderStatuses);
    }
  }, [orderStatuses, selectRules]);
  const isConfirmDialogVisible = status === 'awaiting';

  const onChangeNct = (newValue: any) => {
    setNCTReason(newValue);
  };

  const setNCTReasonSubmit = (
    nctValue: INCTReasons,
    selectStatusValue: IOrderStatus
  ) => {
    changeNCTReasonMutation.mutate({
      nctReasonId: nctValue.id,
      dmoId: order.id,
      orderId: order.dmOrderId,
    });
    mutation.handleSelect(selectStatusValue as IOrderStatus, () => {
      if (selectRef.current) {
        // @ts-ignore
        selectRef.current?.setValue(value);
      }
    });
  };

  async function handleOnSelect(newValue: SingleValue<IOrderStatus>) {
    // little hack so that on setting the value after error
    // onChange event is fired, and it goes into an infinite loop
    if (newValue?.id === value.id) return;

    if (selectRules) {
      // Update the options based on the new selected value
      const updatedOptions = selectRules(newValue, loadOptions);
      setOptions(updatedOptions);
    }

    if (newValue?.name === 'refund-to-buyer') {
      try {
        await execute().then((nctValue: any) => {
          if (!nctValue) {
            toast.error(toast.getMessage('onEmptyStatusNCTReason'));
            return;
          }
          setNCTReasonSubmit(nctValue, newValue);
        });
      } catch (err) {
        // @ts-ignore
        selectRef.current?.setValue(value);
        resetStatus();
      }

      return;
    }
    // set this else condition to not fire change status on cancel popup
    mutation.handleSelect(newValue as IOrderStatus, () => {
      if (selectRef.current) {
        // @ts-ignore
        selectRef.current?.setValue(value);
      }
    });

    if (props?.setSelectedStatus) {
      props.setSelectedStatus(upsertArr(props?.selectedStatus || [], `${orderId}-${newValue?.displayName}`));
    }
  }

  function getCurrentValue() {
    if (props?.setSelectedStatus) {
      const selectedData = props?.selectedStatus?.find((data) => data?.includes(orderId));
      const displayName = selectedData?.split('-')[1] || 'Choose Action';

      return {
        id: '',
        name: 'new-order' as OrderStatusNameType,
        displayName,
      };
    }

    return value;
  }

  return (
    <>
      <Select
        // @ts-ignore
        ref={selectRef}
        getOptionLabel={(option: IOrderStatus) => option.displayName}
        getOptionValue={(option: IOrderStatus) => option.name}
        // @ts-ignore
        styles={styles}
        instanceId="order-status-select"
        id="order-status-select"
        onChange={handleOnSelect}
        value={getCurrentValue()}
        options={options}
        isSearchable={true}
        placeholder="Choose Action"
      />
      {/* set NCT Reason On Select buyer to refund status */}
      <ConfirmationDialog
        top={180}
        isOpen={isConfirmDialogVisible}
        onConfirm={() => resolve(NCTReason)}
        onCancel={reject}
      >
        <Box
          cssProps={{
            borderBottom: '1px solid',
            borderColor: 'static.grays.50',
            paddingBottom: 5,
          }}
        >
          <Text fontSize="bigText" fontWeight="semibold" color="static.black">
            Assign NCT Reason
          </Text>
          <Text fontSize="baseText" fontWeight="regular" color="static.black">
            Please choose the NCT reason for this order
          </Text>
          <br />
          <Select
            value={NCTReason}
            isDisabled={false}
            // @ts-ignore
            styles={styles}
            onChange={onChangeNct}
            placeholder="---"
            isLoading={false}
            options={mappedNCTReasons}
            getOptionLabel={(option) => option.displayName}
            getOptionValue={(option) => option.id}
            isSearchable={true}
            id="reason-nct-select"
            instanceId="reason-nct-select"
          />
        </Box>
      </ConfirmationDialog>
    </>
  );
}
