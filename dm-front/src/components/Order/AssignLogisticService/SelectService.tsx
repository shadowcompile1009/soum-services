import { styles } from '@/components/Shared/commonSelectStyles';
import { MultiSelect } from '@/components/MultiSelect';
import { ILogisticVendor, IVendorService } from '@/models/LogisticVendor';

import { useVendorServices } from './useVendorServices';

interface SelectServiceProps {
  vendor: ILogisticVendor;
  handleOnSelect: (service?: IVendorService) => void;
}

export function SelectService(props: SelectServiceProps) {
  const { vendor, handleOnSelect } = props;
  const { data: services, isLoading } = useVendorServices(vendor.id);

  return (
    <MultiSelect
      key={vendor.id}
      // @ts-ignore
      getOptionLabel={(option: IVendorService) => option.displayName}
      // @ts-ignore
      getOptionValue={(option: IVendorService) => option.id}
      placeHolder="Choose Service"
      options={services}
      styles={styles}
      isSearchable={true}
      isMulti={false}
      isClearable={false}
      closeMenuOnSelect={true}
      // @ts-ignore
      handleOnSelect={handleOnSelect}
      isLoading={isLoading}
      id="service-select"
      instanceId="service-select"
    />
  );
}
