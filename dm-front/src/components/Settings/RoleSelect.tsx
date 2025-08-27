import { useQuery } from '@tanstack/react-query';
import Select, { SingleValue } from 'react-select';
import deepmerge from 'deepmerge';

import { styles } from '@/components/Shared/commonSelectStyles';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { FormField } from '@/components/Form';
import { colors } from '@/tokens/colors';
import { User } from '@/models/User';
import { useMemo } from 'react';

const selectStyles = deepmerge.all([
  styles,
  {
    control: (
      provided: Record<string, unknown>,
      state: Record<string, unknown>
    ) => {
      return {
        ...provided,
        height: '44px',
        backgroundColor: state.isDisabled ? colors.static.grays['50'] : 'auto',
      };
    },
  },
]);

interface RoleSelectProps {
  onChange: (newValue: SingleValue<any>) => void;
  value: any;
  error: string | undefined;
  isDisabled?: boolean;
}

export function RoleSelect(props: RoleSelectProps) {
  const { onChange, value, error, isDisabled = false } = props;
  const { isLoading, data } = useQuery(
    [QUERY_KEYS.rolesList],
    () => User.getRoles(),
    { staleTime: Infinity, cacheTime: Infinity }
  );

  const mappedRoles = useMemo(() => User.mapRoles(data), [data]);

  return (
    <FormField label="User Role" htmlFor="role" error={error}>
      <Select
        isDisabled={isDisabled}
        value={value}
        onChange={onChange}
        id="role"
        placeholder="User Role"
        styles={selectStyles}
        isLoading={isLoading}
        options={mappedRoles}
        getOptionLabel={(option) => option.displayName}
        getOptionValue={(option) => option.roleId}
        isSearchable={true}
      />
    </FormField>
  );
}
