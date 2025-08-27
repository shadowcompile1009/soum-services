import { useMemo, useRef } from 'react';
import isEmpty from 'lodash.isempty';
import { useMutation } from '@tanstack/react-query';
import Select, { SelectInstance } from 'react-select';
import { useQueryClient } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { useNCTReasons } from '@/components/Order/hooks';
import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { useAwaitableComponent } from '@/components/Shared/hooks';
import { MultiSelect } from '@/components/MultiSelect';
import { IAction, Action } from '@/models/Action';
import { styles } from '@/components/Shared/commonSelectStyles';
import { OrderV2, Order, INCTReasons } from '@/models/Order';

import { AssignLogisticService } from './AssignLogisticService/AssignLogisticService';
import { ILogisticVendor, IVendorService } from '@/models/LogisticVendor';

interface ActionSelectProps {
  options: IAction[];
  initialValues?: IAction[];
  order: OrderV2;
  queryKey: string[];
  submodule: string;
}

export function ActionSelect(props: ActionSelectProps) {
  const { options, initialValues, order, queryKey, submodule } = props;
  const selectRef = useRef<SelectInstance<INCTReasons> | null>(null);

  const queryClient = useQueryClient();

  const { data: NCTReasons } = useNCTReasons();

  const assignLogisticMutation = useMutation(
    ({
      serviceId,
      vendorId,
      dmoId,
    }: {
      serviceId: string;
      vendorId: string;
      dmoId: string;
    }) => {
      return Action.assignLogisticVendor({ vendorId, serviceId, dmoId });
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(queryKey);
        toast.success(toast.getMessage('onApplyActionSuccess'));
        selectRef.current?.clearValue();
      },
      onError() {
        toast.error(toast.getMessage('onApplyActionError'));
        selectRef.current?.clearValue();
      },
    }
  );

  const applyActionMutation = useMutation(
    ({
      actionId,
      submodule,
      dmOrderId,
      nctReasonId,
      orderId,
    }: {
      actionId: string;
      submodule: string;
      dmOrderId: string;
      nctReasonId?: string;
      orderId?: string;
    }) => {
      return Action.applyAction(
        dmOrderId,
        submodule,
        actionId,
        nctReasonId,
        orderId
      );
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(queryKey);
        toast.success(toast.getMessage('onApplyActionSuccess'));
        selectRef.current?.clearValue();
      },
      onError() {
        toast.error(toast.getMessage('onApplyActionError'));
        selectRef.current?.clearValue();
      },
    }
  );

  const [
    statusLogistics,
    executeLogistics,
    resolveLogistics,
    rejectLogistics,
    resetStatusLogistics,
  ] = useAwaitableComponent();

  const [status, execute, resolve, reject, resetStatus] =
    useAwaitableComponent();
  const isRequestRefund = status === 'awaiting';
  const isAssigningLogistic = statusLogistics === 'awaiting';

  async function handleOnSelect(value: IAction) {
    if (isEmpty(value)) return null;

    if (value.name === 'Assign Logistics Service') {
      await executeLogistics()
        .then((selectedVendorAndServices) => {
          const { vendor, service } = selectedVendorAndServices as {
            vendor: ILogisticVendor;
            service: IVendorService;
          };

          assignLogisticMutation.mutate({
            dmoId: order.dmOrderId,
            vendorId: vendor.id,
            serviceId: service.id,
          });
        })
        .catch(() => {
          selectRef.current?.clearValue();
          reject('Empty logistic service');
          resetStatusLogistics();
        });
      return;
    }

    if (value.name === 'Request Refund') {
      await execute()
        .then((nctReason: any) => {
          if (isEmpty(nctReason)) {
            toast.error(toast.getMessage('onEmptyStatusNCTReason'));
            reject('Empty NCT');
            resetStatus();
            return;
          }
          applyActionMutation.mutate({
            actionId: value.id,
            submodule: submodule,
            dmOrderId: order.dmOrderId,
            nctReasonId: nctReason.id,
            orderId: order.id,
          });
        })
        .catch(() => {
          selectRef.current?.clearValue();
          reject('Empty NCT');
          resetStatus();
        });
      return;
    }

    applyActionMutation.mutate({
      actionId: value.id,
      submodule: submodule,
      dmOrderId: order.dmOrderId,
    });
  }

  async function handleNctReasonSelect() {
    await resolve(selectRef.current?.getValue()[0]);
  }

  const mappedNCTReasons = useMemo(
    () => Order.mapNCTReasons(NCTReasons || []),
    [NCTReasons]
  );

  return (
    <>
      <MultiSelect
        // @ts-ignore
        getOptionLabel={(option: IAction) => option.displayName}
        // @ts-ignore
        getOptionValue={(option: IAction) => option.id}
        placeHolder="Choose action"
        // @ts-ignore
        handleOnSelect={handleOnSelect}
        options={options}
        styles={styles}
        value={initialValues}
        isSearchable={true}
        isMulti={false}
        isClearable={false}
        closeMenuOnSelect={true}
        id="action-select"
        instanceId="action-select"
      />
      {/* set NCT Reason On Select buyer to refund status */}
      <ConfirmationDialog
        top={180}
        isOpen={isRequestRefund}
        onConfirm={handleNctReasonSelect}
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
            ref={selectRef}
            isDisabled={false}
            // @ts-ignore
            styles={styles}
            placeholder="Select NCT Reason"
            isLoading={false}
            options={mappedNCTReasons}
            getOptionLabel={(option) => option.displayName}
            getOptionValue={(option) => option.id}
            isSearchable={true}
          />
        </Box>
      </ConfirmationDialog>
      <AssignLogisticService
        isOpen={isAssigningLogistic}
        onCancel={rejectLogistics}
        onConfirm={resolveLogistics}
      />
    </>
  );
}
