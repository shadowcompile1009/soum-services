import { SingleValue } from 'react-select';

import { MultiSelect } from '@/components/MultiSelect';
import { colors } from '@/tokens/colors';
import { VendorService } from '@/models/LogisticVendor';

interface VendorServicesSelectProps {
  options: VendorService[];
  handleOnSelect: (values: SingleValue<any>) => void;
  initialValues?: VendorService[];
  placeholder: string;
}

const styles = {
  placeholder: (provided: Record<string, unknown>) => ({
    ...provided,
    color: colors.static.gray,
    opacity: 0.6,
  }),
  control: (provided: Record<string, unknown>) => ({
    ...provided,
    minHeight: '44px',
    lineHeight: '27px',
    minWidth: '280px',
    maxWidth: '560px',
    fontFamily:
      "Inter system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSize: '18px',
    borderColor: colors.static.blue,
    '&:hover': {
      borderColor: colors.static.blue,
    },
  }),
};

export function VendorServicesSelect(props: VendorServicesSelectProps) {
  const { options, handleOnSelect, initialValues, placeholder } = props;

  return (
    <MultiSelect
      // @ts-ignore
      getOptionLabel={(option: VendorService) => option.displayName}
      // @ts-ignore
      getOptionValue={(option: VendorService) => option.id}
      placeHolder={placeholder}
      instanceId="vendor-services"
      // @ts-ignore
      handleOnSelect={handleOnSelect}
      options={options}
      styles={styles}
      value={initialValues}
      isSearchable={true}
      isMulti={true}
      isClearable={false}
      closeMenuOnSelect={false}
      id="vendor-services-select"
    />
  );
}
