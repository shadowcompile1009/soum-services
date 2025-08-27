import styled from 'styled-components';
import css from '@styled-system/css';
import { Stack } from '../Layouts';
import { Text } from '../Text';
import { Button } from '../Button';
import { Box } from '../Box';
import { Card } from '../Card';
import { InputProps } from '../Form/Input';
import { colors } from '@/tokens/colors';
import { useSpecificationReportDetails } from './hooks/useSpecificationReportDetails';
import { TableContainer } from '../Shared/TableComponents';
import { TableLoader } from '../TableLoader';
import { Loader } from '../Loader';
import {
  BodyStyle,
  Brand,
  Condition,
  Drivetrain,
  ExteriorColor,
  FuelType,
  InteriorColor,
  Model,
  NumberOfKeys,
  Origin,
  PaymentPlan,
  Transmission,
} from '@/constants/specifications';
import { Label } from '../Form';
import { useEffect, useState } from 'react';
import { useUpdateInspectionReportMutation } from './hooks/useUpdateImageMutation';
import SpecificationDetailHeader from '../ListingDetails/SpecificationDetailHeader';
import SpecificationDetailInput from '../ListingDetails/SpecificationDetailInput';

interface FormFieldProps extends InputProps {
  htmlFor: string;
  label?: string;
  error?: string;
}

export function FormField(props: FormFieldProps): React.ReactElement {
  const { label, htmlFor, error } = props;

  return (
    <Stack direction="vertical" gap="4">
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {props.children}
      {error && (
        <Text
          fontSize="smallText"
          fontWeight="smallText"
          color="static.red"
          as="span"
        >
          {' '}
          {error}
        </Text>
      )}
    </Stack>
  );
}

export const styles = {
  container: (provided: Record<string, unknown>) => ({
    ...provided,
    minWidth: '300px',
    textAlign: 'left',
    '@media (max-width: 500px)': {
      minWidth: '100%',
    },
  }),
  control: (provided: Record<string, unknown>) => ({
    ...provided,
    '&:hover': {
      borderColor: colors.static.black,
    },
  }),
};

export interface ButtonProps {
  flexBasis?: string;
}

const CardsGrid = styled('div')(() => {
  return css({
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginRight: -10,
    marginLeft: -10,
  });
});

const CardItem = styled('div')<ButtonProps>((props) => {
  const { flexBasis = '60%' } = props;
  return css({
    flexBasis: flexBasis,
    padding: 10,
    '@media (max-width: 960px)': {
      flexBasis: '100%',
    },
  });
});

export interface IOption {
  nameEn: string;
  nameAr: string;
}

export interface Specification {
  nameEn: string;
  nameAr: string;
  questionType?: string;
  status: boolean;
  data: {
    value?: string;
    nameEn?: string;
    nameAr?: string;
    status?: boolean;
  }[];
  value?: string;
  icon?: string;
  placeHolder?: string;
  options?: IOption[];
}

const optionsMap = {
  'Payment Plan': PaymentPlan,
  'Number of Keys': NumberOfKeys,
  'Body Style': BodyStyle,
  Drivetrain: Drivetrain,
  Condition: Condition,
  Transmission: Transmission,
  'Fuel Type': FuelType,
  Origin: Origin,
  'Interior Color': InteriorColor,
  'Exterior Color': ExteriorColor,
  Model: Model,
  Brand: Brand,
};

interface Props {
  listingId: string | string[] | undefined;
  categoryName: string;
}

const SpecificationReport = ({ listingId, categoryName }: Props) => {
  const mutation = useUpdateInspectionReportMutation();
  const { isLoading, data } = useSpecificationReportDetails(
    listingId as string,
    categoryName
  );
  const [newData, setNewData] = useState<Specification[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const mergeOptions = (specifications: any, optionsMap: any) => {
    return specifications?.map((spec: any) => {
      if (optionsMap[spec.nameEn]) {
        const result = spec.value
          ? (() => {
              const [nameEn, nameAr] = spec.value.split(' - ');
              return { nameEn, nameAr };
            })()
          : { nameEn: '', nameAr: '' };

        const options = moveItemToTop(optionsMap[spec.nameEn], result);

        return {
          ...spec,
          options,
        };
      }
      return spec;
    });
  };

  useEffect(() => {
    if (data) {
      setNewData(mergeOptions(data, optionsMap));
    }
  }, [data]);

  const moveItemToTop = (arrayOptions: any, selected: any) => {
    if (!selected.nameAr || !selected.nameEn) {
      return arrayOptions;
    }
    return [
      selected,
      ...arrayOptions.filter(
        (option: any) => JSON.stringify(option) !== JSON.stringify(selected)
      ),
    ];
  };

  const handleSelectChange = (nameEn: any, selectedOption: any) => {
    const newSpecifications = newData.map((item: Specification) => {
      if (item.nameEn === nameEn) {
        const options = moveItemToTop(item.options, selectedOption);
        return {
          ...item,
          value: selectedOption.nameEn + ' - ' + selectedOption.nameAr,
          options,
        };
      }
      return item;
    });
    setNewData(newSpecifications);
    setIsDirty(true);
  };

  const toggleClickHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const specificationType = event.target.getAttribute(
      'data-specification-type'
    );
    const newSpecifications = newData.map((item: Specification) => {
      if (item.nameEn === specificationType) {
        return {
          ...item,
          status: event.target.checked,
        };
      }
      return item;
    });
    setNewData(newSpecifications);
    setIsDirty(true);
  };

  const handleOnChange = (event: any) => {
    const specificationType = event.target.getAttribute(
      'data-specification-type'
    );
    let remakeValue = event.target.value;

    if (specificationType === 'Odometer' && remakeValue.length > 7) {
      return;
    }
    if (specificationType === 'Year') {
      if (remakeValue.length > 4) return;
      if (!remakeValue.startsWith('20')) {
        remakeValue = '20';
      }
      event.target.value = remakeValue;
    }
    const commentValue = event.target.value;
    const newSpecifications = newData.map((item: Specification) => {
      if (item.nameEn === specificationType) {
        return {
          ...item,
          value: commentValue,
        };
      }
      return item;
    });

    setNewData(newSpecifications);
    setIsDirty(true);
  };

  const handleSaveData = () => {
    mutation.mutate({
      listingId: listingId as string,
      categoryName: categoryName as string,
      specification: newData?.map((item) => {
        const itemCopy = { ...item };
        delete itemCopy.options;
        return itemCopy;
      }),
    });
    setIsDirty(false);
  };

  const handleNavigation = (e: any) => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        'Changes will be lost if you leave without saving. Are you sure you want to continue?'
      );
      if (!confirmLeave) {
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleNavigation);

    return () => {
      window.removeEventListener('beforeunload', handleNavigation);
    };
  }, [isDirty]);

  if (isLoading) {
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );
  }

  return (
    <>
      <Stack direction="horizontal" gap="10" justify="space-between">
        <Text
          fontWeight="bigSubtitle"
          fontSize="headingThree"
          color="static.black"
        >
          Specification Report
        </Text>
        <Button
          variant="filled"
          onClick={handleSaveData}
          disabled={isLoading || data?.length === 0}
        >
          {isLoading && <Loader size="12px" border="static.blue" />}
          Save
        </Button>
      </Stack>
      <CardsGrid>
        <CardItem>
          <Card>
            {newData?.map((item: Specification, index: any) => (
              <Box key={index} marginBottom={10}>
                <Stack direction="vertical" gap="12">
                  <SpecificationDetailHeader
                    item={item}
                    toggleClickHandler={toggleClickHandler}
                  />
                  <SpecificationDetailInput
                    item={item}
                    index={index}
                    handleOnChange={handleOnChange}
                    handleSelectChange={handleSelectChange}
                  />
                </Stack>
              </Box>
            ))}
          </Card>
        </CardItem>
      </CardsGrid>
    </>
  );
};

export default SpecificationReport;
