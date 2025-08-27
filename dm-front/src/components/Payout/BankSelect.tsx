import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Select, { SingleValue } from 'react-select';
import deepmerge from 'deepmerge';

import { styles } from '@/components/Shared/commonSelectStyles';
import { Bank } from '@/models/Bank';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { FormField } from '@/components/Form';
import { colors } from '@/tokens/colors';

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

interface BankSelectProps {
  onChange: (newValue: SingleValue<Bank>) => void;
  value: Bank;
  error: string | undefined;
  isDisabled?: boolean;
}

export function BankSelect(props: BankSelectProps) {
  const { onChange, value, error, isDisabled = false } = props;
  const { isLoading, data } = useQuery(
    [QUERY_KEYS.bankList],
    () => Bank.getBanks(),
    { staleTime: Infinity, cacheTime: Infinity }
  );
  const mappedBanks = useMemo(() => Bank.mapBanks(data), [data]);

  return (
    <FormField label="Bank Name" htmlFor="bank" error={error}>
      <Select
        isDisabled={isDisabled}
        value={value}
        onChange={onChange}
        id="bank"
        placeholder="Bank Name"
        styles={selectStyles}
        isLoading={isLoading}
        options={mappedBanks}
        getOptionLabel={(option) => option.bankName}
        getOptionValue={(option) => option.id}
        isSearchable={true}
      />
    </FormField>
  );
}
