import { SingleValue } from 'react-select';

import { MultiSelect } from '@/components/MultiSelect';
import { colors } from '@/tokens/colors';
import { StatusGroup } from '@/models/StatusGroup';

interface StatusGroupSelectProps {
  options: StatusGroup[];
  handleOnSelect: (values: SingleValue<any>) => void;
  initialValues?: StatusGroup[];
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
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSize: '18px',
    borderColor: colors.static.blue,
    '&:hover': {
      borderColor: colors.static.blue,
    },
  }),
};

export function StatusGroupSelect(props: StatusGroupSelectProps) {
  const { options, handleOnSelect, initialValues, placeholder } = props;

  return (
    <MultiSelect
      // @ts-ignore
      getOptionLabel={(option: StatusGroup) => option.displayName}
      // @ts-ignore
      getOptionValue={(option: StatusGroup) => option.id}
      placeHolder={placeholder}
      instanceId="filter-status-group"
      // @ts-ignore
      handleOnSelect={handleOnSelect}
      options={options}
      styles={styles}
      value={initialValues}
      isSearchable={true}
      isMulti={false}
      isClearable={true}
      closeMenuOnSelect={true}
    />
  );
}
