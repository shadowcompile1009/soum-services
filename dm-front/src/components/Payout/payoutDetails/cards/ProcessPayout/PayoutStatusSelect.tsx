import { forwardRef } from 'react';
import Select from 'react-select';

import { PAYOUT_STATUS_OPTIONS } from '../../constants';
import { selectStyles } from '../../styles';

export const SelectPayoutStatus = forwardRef<any>((_, ref) => {
  return (
    <Select
      // @ts-ignore
      styles={selectStyles}
      placeholder="Select ..."
      isLoading={false}
      options={PAYOUT_STATUS_OPTIONS}
      isSearchable={true}
      ref={ref}
      id="payout-status-select"
      instanceId="payout-status-select"
    />
  );
});

SelectPayoutStatus.displayName = 'SelectPayoutStatus';
