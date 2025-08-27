import React from 'react';
import { Box } from '../Box';
import { PLACEHOLDER_SPECIFICATION_CAR } from '@/constants/placeholders';
import Select from 'react-select';
import {
  IOption,
  Specification,
  styles,
} from '../Frontliners/SpecificationReport';
import css from '@styled-system/css';
import { InputProps } from '../Form/Input';
import styled from 'styled-components';

const placeholderStyles = {
  color: 'static.gray',
  fontSize: 2,
};

const Input = styled(Box).attrs((p) => ({
  as: (p as unknown as { as: string }).as || 'input',
}))<InputProps>(() => {
  const padding = {
    pt: 5,
    pr: 8,
    pb: 5,
    pl: 8,
  };

  return css({
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    height: 44,
    width: '100%',
    fontSize: 2,
    ...padding,
    borderRadius: 4,
    backgroundColor: 'static.white',
    border: '1px solid',
    borderColor: '#ccc',
    color: 'static.black',
    '::-webkit-input-placeholder': placeholderStyles,
    '::-ms-input-placeholder': placeholderStyles,
    '::placeholder': placeholderStyles,
    transition: 'all ease',
    transitionDuration: '200ms',
    appearance: 'none',

    ':hover': {
      border: '1px solid',
      borderColor: 'hover.gray',
      outline: 'none !important',
    },
    ':active, :focus': {
      border: '1px solid',
      borderColor: 'static.gray',
      outline: 'none !important',
    },
    ':disabled': {
      opacity: 1,
      borderColor: 'static.grays.50',
      backgroundColor: 'static.grays.50',
      color: 'static.gray',
    },
  });
});

interface Props {
  item: Specification;
  index: string;
  handleOnChange: (event: any) => void;
  handleSelectChange?: (nameEn: any, selectedOption: any) => void;
}

const SpecificationDetailInput = ({
  item,
  index,
  handleOnChange,
  handleSelectChange,
}: Props) => {
  const getValueFromSaved = (savedValue: string, options: IOption[]) => {
    const [nameEn, nameAr] = savedValue?.split(' - ');
    return (
      options.find(
        (option: IOption) =>
          option.nameEn?.trim() === nameEn?.trim() &&
          option.nameAr?.trim() === nameAr?.trim()
      ) || null
    );
  };
  return (
    <>
      {item?.status && (
        <>
          {item.questionType === 'scq' ? (
            <Box>
              <Select
                isDisabled={false}
                // @ts-ignore
                styles={styles}
                menuShouldScrollIntoView={false}
                placeholder={PLACEHOLDER_SPECIFICATION_CAR.select}
                isLoading={false}
                options={item.options}
                getOptionLabel={(option) =>
                  `${option.nameEn} - ${option.nameAr}`
                }
                getOptionValue={(option) => option?.nameEn}
                isSearchable={true}
                onChange={(selectedOption) =>
                  handleSelectChange?.(item.nameEn, selectedOption)
                }
                value={getValueFromSaved(
                  item?.value || '',
                  item?.options || []
                )}
                id={`category-template-select-${index}`}
                instanceId={`category-template-select-${index}`}
              />
            </Box>
          ) : (
            <Box cssProps={{ position: 'relative' }}>
              <Input
                id={item.nameEn}
                onChange={handleOnChange}
                placeholder={item?.placeHolder || 'Enter'}
                type={item.questionType === 'textInput' ? 'text' : 'number'}
                maxLength={item.questionType === 'textInput' ? 30 : 4}
                data-specification-type={item.nameEn}
                pattern={item.nameEn === 'Year' ? '^20\\d{2}$' : undefined}
                value={item?.value || (item.nameEn === 'Year' ? '20' : '')}
              />
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default SpecificationDetailInput;
