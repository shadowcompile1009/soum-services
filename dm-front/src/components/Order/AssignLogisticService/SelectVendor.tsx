import React from 'react';

import { styles } from '@/components/Shared/commonSelectStyles';
import { MultiSelect } from '@/components/MultiSelect';
import { ILogisticVendor } from '@/models/LogisticVendor';

import { useLogisticVendors } from './useLogisticVendors';

interface SelectVendorProps {
  handleOnSelect: (vendor?: ILogisticVendor) => void;
}

export function SelectVendor(props: SelectVendorProps) {
  const { handleOnSelect } = props;
  const { data: vendors, isLoading } = useLogisticVendors();
  return (
    <MultiSelect
      // @ts-ignore
      getOptionLabel={(option: ILogisticVendor) => option.displayName}
      // @ts-ignore
      getOptionValue={(option: ILogisticVendor) => option.id}
      placeHolder="Choose vendor"
      options={vendors}
      styles={styles}
      isSearchable={true}
      isMulti={false}
      isClearable={false}
      closeMenuOnSelect={true}
      // @ts-ignore
      handleOnSelect={handleOnSelect}
      isLoading={isLoading}
    />
  );
}
