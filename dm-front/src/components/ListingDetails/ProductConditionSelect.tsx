import { useEffect, useState } from 'react';

import Select from 'react-select';
import { useIsMutating } from '@tanstack/react-query';

import { colors } from '@/tokens/colors';
import { QUERY_KEYS } from '@/constants/queryKeys';

import { useUpdateProductCondition, useGetProductConditions } from './hooks';

interface ProductConditionSelectProps {
  initialValues?: string[];
  width: string;
  isMulti?: boolean;
  categoryId?: string;
  conditionId?: string;
  listingId: string;
}

export const ProductConditionSelect = (props: ProductConditionSelectProps) => {
  const { width, isMulti = false, categoryId, conditionId, listingId } = props;
  const [selectedCondition, setSelectedCondition] = useState<any>(null);

  const { data: conditions } = useGetProductConditions(categoryId ?? '');
  const { mutate: updateProductCondition, isError } =
    useUpdateProductCondition();

  // Reset to original condition when error occurs
  useEffect(() => {
    if (isError) {
      const currentCondition = conditions?.items?.find(
        (condition: any) => condition.id === conditionId
      );
      setSelectedCondition(currentCondition);
    }
  }, [isError, conditionId, conditions?.items]);

  // Initial setup of selected condition
  useEffect(() => {
    const currentCondition = conditions?.items?.find(
      (condition: any) => condition.id === conditionId
    );
    setSelectedCondition(currentCondition);
  }, [conditionId, conditions?.items]);

  const isMutating = useIsMutating({
    mutationKey: [QUERY_KEYS.updateProductCondition, String(listingId)],
  });

  const handelOnSelect = (selectedOption: { id: string }) => {
    if (selectedOption.id === conditionId) return;

    setSelectedCondition(selectedOption);
    updateProductCondition({
      productId: listingId,
      conditionId: selectedOption.id,
    });
  };

  const styles = {
    placeholder: (provided: Record<string, unknown>) => ({
      ...provided,
      color: colors.static.gray,
      opacity: 0.6,
    }),
    valueContainer: (provided: Record<string, unknown>) => ({
      ...provided,
      height: '100%',
      padding: '0 0.5rem',
    }),
    control: (provided: Record<string, unknown>) => ({
      ...provided,
      height: '1.5rem',
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
      isDisabled={!!isMutating}
      name="condition"
      options={conditions?.items}
      value={selectedCondition}
      key={selectedCondition?.id}
      getOptionLabel={(option: any) => option.name}
      getOptionValue={(option: any) => option.id}
      placeholder="Select Condition"
      styles={styles}
      classNamePrefix="select"
      onChange={handelOnSelect}
    />
  );
};
