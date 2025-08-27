import { useState } from 'react';

import { Text } from '@/components/Text';
import {
  ConfirmationDialog,
  ConfirmationDialogProps,
} from '@/components/ConfirmationDialog';
import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';

import { SelectVendor } from './SelectVendor';
import { SelectService } from './SelectService';
import { ILogisticVendor, IVendorService } from '@/models/LogisticVendor';
import isEmpty from 'lodash.isempty';

export interface AssignLogisticServiceProps
  extends Omit<ConfirmationDialogProps, 'children'> {}

export function AssignLogisticService(props: AssignLogisticServiceProps) {
  const { isOpen, onCancel, onConfirm } = props;
  const [selectedVendor, setSelectedVendor] = useState<ILogisticVendor | {}>(
    {}
  );
  const [selectedService, setSelectedServvice] = useState<IVendorService | {}>(
    {}
  );

  function handleOnCancel() {
    setSelectedVendor({});
    setSelectedServvice({});
    onCancel('Logistic vendor or vendor service not selected');
  }

  function handleOnConfirm() {
    if (isEmpty(selectedVendor) || isEmpty(selectedService)) {
      setSelectedVendor({});
      setSelectedServvice({});
      onCancel('Logistic vendor or vendor service not selected');
      return;
    }
    onConfirm({ vendor: selectedVendor, service: selectedService });
    setSelectedVendor({});
    setSelectedServvice({});
  }

  function handleVendorSelect(vendor?: ILogisticVendor) {
    if (!isEmpty(vendor)) {
      setSelectedVendor(vendor);
      return;
    }

    setSelectedVendor({});
  }

  function handleServiceSelect(service?: IVendorService) {
    if (!isEmpty(service)) {
      setSelectedServvice(service);
      return;
    }

    setSelectedServvice({});
  }

  return (
    <ConfirmationDialog
      top={100}
      isOpen={isOpen}
      onConfirm={handleOnConfirm}
      onCancel={handleOnCancel}
    >
      <Box
        cssProps={{
          paddingBottom: 5,
        }}
      >
        <Box cssProps={{ mb: 8 }}>
          <Text fontSize="baseText" fontWeight="regular" color="static.black">
            Modify Logistics Service
          </Text>
        </Box>

        <Stack direction="vertical" gap="10">
          <Stack direction="vertical" gap="3">
            <Text fontSize="baseText" fontWeight="regular" color="static.gray">
              Assigned Vendor
            </Text>
            <SelectVendor handleOnSelect={handleVendorSelect} />
          </Stack>

          {!isEmpty(selectedVendor) && (
            <Box>
              <Stack direction="vertical" gap="3">
                <Text
                  fontSize="baseText"
                  fontWeight="regular"
                  color="static.gray"
                >
                  Assigned Service
                </Text>
                <SelectService
                  handleOnSelect={handleServiceSelect}
                  vendor={selectedVendor}
                />
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </ConfirmationDialog>
  );
}
