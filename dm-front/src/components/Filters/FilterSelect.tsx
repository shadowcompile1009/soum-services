import Select from 'react-select';

import { colors } from '@/tokens/colors';

interface FilterSelectProps {
  options: any;
  handleOnSelect: (values: any) => void;
  initialValues?: string[];
  placeholder: string;
  width: string;
  isMulti?: boolean;
}

const FilterSelect = (props: FilterSelectProps) => {
  const {
    options,
    handleOnSelect,
    placeholder,
    width,
    isMulti = false,
  } = props;

  const styles = {
    placeholder: (provided: Record<string, unknown>) => ({
      ...provided,
      color: colors.static.gray,
      opacity: 0.6,
    }),
    control: (provided: Record<string, unknown>) => ({
      ...provided,
      minHeight: '2.75rem',
      lineHeight: '1.6875rem',
      width: width,
      fontFamily:
        "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      fontSize: 18,
      boxShadow: 'none',
      borderColor: colors.static.blue,
      ':hover': {
        border: '1px solid',
        borderColor: 'hover.blue',
        outline: 'none !important',
      },
    }),
  };

  return (
    <Select
      isMulti={isMulti}
      name="colors"
      options={options}
      getOptionLabel={(option: any) => option.displayName}
      getOptionValue={(option: any) => option.name}
      placeholder={placeholder}
      styles={styles}
      classNamePrefix="select"
      //@ts-ignore
      onChange={handleOnSelect}
    />
  );
};

export default FilterSelect;
