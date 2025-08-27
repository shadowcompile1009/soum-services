import React from 'react';
import Select, { components, OptionProps, Props } from 'react-select';
import deepmerge from 'deepmerge';

import { Checkbox } from '@/components/Form';

interface MultiSelectProps extends Props {
  instanceId: string;
  handleOnSelect: (value: unknown) => void;
  placeHolder: string;
  styles?: any;
  isMulti?: boolean;
}

import { styles as defaultSelectStyles } from '@/components/Shared/commonSelectStyles';

export function Option<Option>(props: OptionProps<Option>) {
  return (
    <components.Option {...props}>
      <Checkbox
        checked={props.isSelected}
        label={props.label}
        id={props.label}
        readOnly
      />
    </components.Option>
  );
}

export const MultiSelect = React.forwardRef(function MultiSelect(
  props: MultiSelectProps,
  ref
) {
  const {
    getOptionLabel,
    getOptionValue,
    instanceId,
    handleOnSelect,
    value,
    options,
    placeHolder,
    styles = {},
    isMulti = true,
    ...rest
  } = props;

  const selectStyles = deepmerge.all([defaultSelectStyles, styles]);

  return (
    <Select
      //@ts-ignore
      ref={ref}
      closeMenuOnSelect={false}
      placeholder={placeHolder}
      isMulti={isMulti}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      styles={selectStyles}
      instanceId={instanceId}
      id={instanceId}
      onChange={handleOnSelect}
      value={value}
      options={options}
      isSearchable={true}
      hideSelectedOptions={true}
      {...rest}
    />
  );
});
