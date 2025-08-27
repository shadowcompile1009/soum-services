import { useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import css from '@styled-system/css';
import { useForm } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';

import { Addon, IAddon, IGetAddonsResponse } from '@/models/Addon';

import styled from 'styled-components';
import { Box } from '../../Box';
import { Button } from '../../Button';
import { Label } from '../../Form';
import { InputProps } from '../../Form/Input';
import { Stack } from '../../Layouts';
import { Loader } from '../../Loader';
import { CommonModal } from '../../Modal';
import { CloseIcon } from '../../Shared/CloseIcon';
import { DeleteIcon } from '../../Shared/DeleteIcon';
import { IconContainer } from '../../Shared/IconContainer';
import { UploadIcon } from '../../Shared/UploadIcon';
import { Text } from '../../Text';
import { toast } from '../../Toast';
import { Backdrop } from '../../Shared/Backdrop';
import {
  FileUploadContainer,
  FormContainer,
  Item,
  ItemLabel,
  ItemRow,
  FileUploadWrapperContainer,
} from './AddonModalStyles';
import { extractLast24Hex, parseModelId } from '../utils';

interface Props {
  onClose: () => void;
  isOpen: boolean;
  isLoading: boolean;
  addon?: IAddon;
  refetch?: () => void;
}

const placeholderStyles = {
  color: 'static.gray',
  fontSize: 2,
};

const Input = styled(Box).attrs((p) => ({
  as: (p as unknown as { as: string }).as || 'input',
}))<InputProps>(() => {
  const padding = {
    pt: 5,
    pr: 5,
    pb: 5,
    pl: 8,
  };

  return css({
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    height: '38px',
    width: '100%',
    fontSize: '16px',
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
      {error ? (
        <Text
          fontSize="smallText"
          fontWeight="smallText"
          color="static.red"
          as="span"
        >
          {' '}
          {error}
        </Text>
      ) : (
        <></>
      )}
    </Stack>
  );
}

const FileUploadWrapper = styled.label`
  display: flex;
  align-items: center;
  border: 1px solid #0071f2;
  padding: 0px 10px;
  border-radius: 5px;
  width: 484px;
  height: 38px;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;

const FileUploadName = styled.span`
  flex-grow: 1;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileUploadIcon = styled.label`
  cursor: pointer;
  font-size: 20px;
`;

const HiddenInput = styled.input`
  display: none;
`;

export const DeleteQuestionActionLink = styled.span(() =>
  css({
    color: 'static.grays.10',
    cursor: 'pointer',
    '&:hover': {
      color: 'static.red',
    },
  })
);

const Textarea = styled.textarea`
  width: 254px;
  padding: 10px 10px 10px 14px;
  font-size: 16px;
  line-height: 1;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  font-family: inherit;
  height: 131px;

  &:hover {
    border-color: #000;
    outline: none;
  }

  &:focus {
    border-color: #000;
    outline: none;
  }
`;

export interface IOption {
  value: string;
  label: string;
}

export const templatePeriod: IOption[] = [
  { value: 'month', label: 'Months' },
  { value: 'day', label: 'Days' },
  { value: 'year', label: 'Years' },
];

export const templatePrice: IOption[] = [
  { value: 'fixed', label: 'Fixed' },
  { value: 'percentage', label: 'Percentage' },
];

export const templateModel: IOption[] = [
  { value: 'accessory', label: 'Accessories' },
  { value: 'warranty', label: 'Warranties' },
  { value: 'giftWrapping', label: 'Gift Wrapping' },
  { value: 'extraPackaging', label: 'Extra Packaging' },
];

export const templateAddOns: IOption[] = [
  { value: '1', label: 'Products listed by All Sellers (Global)' },
  { value: '2', label: 'Products listed by Specific Seller' },
];

const customStyles = {
  control: (provided: any) => {
    return {
      ...provided,
      width: '254px',
      textAlign: 'left',
      height: '38px',
      paddingLeft: '4px',
      borderColor: '#ccc',
      '@media (max-width: 500px)': {
        minWidth: '100%',
      },
      '&:hover': {
        borderColor: '#000',
      },
      boxShadow: '',
    };
  },
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '8px',
    padding: '0',
    marginTop: '4px',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: 'white',
    color: 'black',
    position: 'relative',
    minHeight: '40px',
    '&:before': {
      content: '""',
      display: 'inline-block',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      border: '2px solid #0071F2',
      marginRight: '8px',
    },
    '&:after': {
      content: '""',
      display: state.isSelected ? 'inline-block' : 'none',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#0071F2',
      position: 'absolute',
      left: '16px',
    },
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
  }),
};

const MainAddonModal = (props: Props) => {
  const { isOpen, onClose, isLoading, addon, refetch } = props;
  const [fileName, setFileName] = useState<String | undefined>('');
  const [isSavePressed, setIsSavePressed] = useState<boolean>(false);

  const router = useRouter();
  const pathname = router.asPath;

  const modelIds = addon?.modelIds
    ? parseModelId(addon.modelIds)
    : [extractLast24Hex(pathname)];

  const [data, setData] = useState<IGetAddonsResponse>();

  const isGiftWrappingOrExtraPackaging = useMemo(
    () => data?.type === 'giftWrapping' || data?.type === 'extraPackaging',
    [data?.type]
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (addon && isOpen) {
      setData({
        ...addon,
        nameEn: addon.name,
        taglineEn: addon.tagLines,
        taglineAr: addon.tagLinesAr,
        descriptionEn: addon.description,
        validity: addon.period.split(' ')[0]
          ? parseInt(addon.period.split(' ')[0], 10)
          : NaN,
        validityType:
          addon.period.split(' ')[1] === 'null'
            ? 'month'
            : addon.period.split(' ')[1],
        modelIds: addon.modelIds ? modelIds : [],
      });
      setValue('image', addon.image);

      if (addon.type === 'accessory') {
        setSelectedAddOns(
          templateAddOns.find((option) => option.value === '1')
        );
      } else if (
        addon.type === 'warranty' &&
        addon.sellerIds.length > 0 &&
        addon.sellerIds[0] !== ''
      ) {
        setSelectedAddOns(
          templateAddOns.find((option) => option.value === '2')
        );
      } else if (
        (addon.type === 'giftWrapping' || addon.type === 'extraPackaging') &&
        addon.sellerIds.length > 0 &&
        addon.sellerIds[0] !== ''
      ) {
        setSelectedAddOns(
          templateAddOns.find((option) => option.value === '2')
        );
      } else {
        setSelectedAddOns(
          templateAddOns.find((option) => option.value === '1')
        );
      }

      setFileName(addon.image);
    }
  }, [addon, isOpen]);

  const handleClose = () => {
    reset();
    onClose();
    setIsSavePressed(false);
    setData({
      ...addon,
      nameEn: addon?.name,
      taglineEn: addon?.tagLines,
      taglineAr: addon?.tagLinesAr,
      descriptionEn: addon?.description,
      validity: addon?.period
        ? parseInt(addon.period.split(' ')[0], 10)
        : undefined,
      validityType: addon?.period.split(' ')[1],
    } as IGetAddonsResponse);

    if (addon) {
      if (data?.type === 'accessory') {
        setSelectedAddOns(
          templateAddOns.find((option) => option.value === '1')
        );
      }
      if (
        data?.type === 'warranty' &&
        data?.sellerIds &&
        data?.sellerIds.length > 0 &&
        data?.sellerIds[0] !== ''
      ) {
        setSelectedAddOns(
          templateAddOns.find((option) => option.value === '2')
        );
      } else if (
        (data?.type === 'giftWrapping' || data?.type === 'extraPackaging') &&
        data?.sellerIds &&
        data?.sellerIds.length > 0 &&
        data?.sellerIds[0] !== ''
      ) {
        setSelectedAddOns(
          templateAddOns.find((option) => option.value === '2')
        );
      } else {
        setSelectedAddOns(
          templateAddOns.find((option) => option.value === '1')
        );
      }
      setValue('image', addon.image);
    } else {
      setSelectedAddOns(undefined);
      setFileName('');
    }
  };

  const options = data?.type
    ? data?.type === 'accessory'
      ? templateAddOns.filter((option) => option.value !== '2')
      : templateAddOns
    : templateAddOns;

  const [selectedAddOns, setSelectedAddOns] = useState<IOption | undefined>();
  const handleAddOnsChange = (option: SingleValue<IOption>) => {
    setSelectedAddOns(option ?? undefined);
  };

  const handleDelete = () => {
    setValue('sellers_id', '');
  };

  const handleSelectChange = (field: string, selectedOption: any) => {
    if (field === 'type' && selectedOption.value === 'accessory') {
      setSelectedAddOns(templateAddOns.find((option) => option.value === '1'));
    }
    const newAddon = {
      ...data,
      [field]: selectedOption.value,
    };
    setData(newAddon as IGetAddonsResponse);
  };

  const addNewAddonsMutation = useMutation(Addon.addNewAddons, {
    onSuccess() {
      toast.success(toast.getMessage('onAddNewAddonSuccess'));
      onClose();
      reset();
      setIsSavePressed(false);
      refetch?.();
    },
    onError() {
      toast.error(toast.getMessage('onAddNewAddonError'));
      reset();
      setIsSavePressed(false);
    },
  });

  const updateAddonMutation = useMutation(Addon.updateAddons, {
    onSuccess() {
      toast.success(toast.getMessage('onUpdateAddonSuccess'));
      onClose();
      setIsSavePressed(false);
      reset();
      setValue('image', addon?.image);
      refetch?.();
    },
    onError() {
      toast.error(toast.getMessage('onUpdateAddonError'));
      setIsSavePressed(false);
    },
  });

  const onSubmit = async (formValues: any) => {
    const formData = new FormData();

    if (isGiftWrappingOrExtraPackaging) {
      formData.append('type', data?.type ?? templateModel[0].value);
      formData.append('nameEn', formValues.name_en);
      formData.append('nameAr', formValues.name_ar);
      formData.append('price', formValues.price);
      formData.append('priceType', data?.priceType ?? templatePrice[0].value);
      formData.append(
        'modelIds',
        JSON.stringify(formValues.modelIds.split(','))
      );

      if (selectedAddOns?.value === '1') {
        formData.append('sellerIds', '');
      }

      if (selectedAddOns?.value === '2') {
        formData.append('sellerIds', formValues.sellers_id);
      }

      if (addon) {
        updateAddonMutation.mutate({
          formValues: formData,
          addonId: addon.id,
        });
      } else {
        addNewAddonsMutation.mutate({ formValues: formData });
      }
    } else if (!formValues.image && !isGiftWrappingOrExtraPackaging) {
      toast.error('Please upload image');
    } else {
      formData.append('priceType', data?.priceType ?? templatePrice[0].value);
      formData.append('descriptionEn', formValues.description_en || '');
      formData.append('price', formValues.price);
      formData.append(
        'validityType',
        data?.validityType ?? templatePeriod[0].value
      );
      formData.append('descriptionAr', formValues.description_ar || '');
      formData.append('nameEn', formValues.name_en);
      formData.append('nameAr', formValues.name_ar);
      formData.append('taglineAr', formValues.tagLine_ar);
      formData.append('taglineEn', formValues.tagLine_en);
      formData.append('type', data?.type ?? templateModel[0].value);
      formData.append('validity', formValues.period);
      formData.append(
        'modelIds',
        JSON.stringify(formValues.modelIds.split(','))
      );

      if (selectedAddOns?.value === '1') {
        formData.append('sellerIds', '');
      }

      if (selectedAddOns?.value === '2') {
        formData.append('sellerIds', formValues.sellers_id);
      }

      if (formValues.image) {
        formData.append('image', formValues.image);
      }

      if (addon) {
        updateAddonMutation.mutate({
          formValues: formData,
          addonId: addon.id,
        });
      } else {
        addNewAddonsMutation.mutate({ formValues: formData });
      }
    }
  };

  const handleFileChange = async (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      setValue('image', event.target.files[0]);
      setFileName(event.target.files[0].name);
    }
  };

  const handleDeleteImage = () => {
    setFileName('');
    setValue('image', '');
  };

  const getValueFromSaved = (savedValue: any, options: IOption[]) => {
    return (
      options.find((option: IOption) => option.value === savedValue) || null
    );
  };

  if (isLoading) {
    return (
      <CommonModal onClose={onClose} isOpen={isOpen}>
        <Box
          cssProps={{
            width: 580,
            height: 480,
            margin: -10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader size="48px" border="static.blue" marginRight="0" />
        </Box>
      </CommonModal>
    );
  }

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleClose}
      width="36.5625rem"
      maxHeight="90vh"
      height="fit-content"
    >
      {(updateAddonMutation.isLoading || addNewAddonsMutation.isLoading) && (
        <Backdrop>
          <Loader size="48px" border="static.blue" marginRight="0" />
        </Backdrop>
      )}
      <Box
        cssProps={{
          borderBottom: '1px solid #EBEDF0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '8',
        }}
      >
        <Text color="static.black" fontSize="regular" fontWeight="medium">
          {addon ? 'Edit Add-on' : 'Add New Add-on'}
        </Text>
        <CloseIcon onClick={onClose} />
      </Box>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <ItemRow>
          <Item>
            <ItemLabel htmlFor="name_en">Add-ons Type</ItemLabel>
            <Select
              isDisabled={false}
              value={getValueFromSaved(
                data?.type || templateModel[0].value,
                templateModel
              )}
              // @ts-ignore
              styles={customStyles}
              onChange={(selectedOption) =>
                handleSelectChange('type', selectedOption)
              }
              placeholder={data?.type}
              isLoading={false}
              options={templateModel}
              getOptionLabel={(option) => option?.label}
              getOptionValue={(option) => option?.value}
              isSearchable={false}
              id="type"
              instanceId="category-template-select"
            />
          </Item>
          <div />
        </ItemRow>
        <Item>
          <ItemLabel htmlFor="file-upload">Upload Image</ItemLabel>
          <FileUploadContainer>
            <FileUploadWrapperContainer>
              <FileUploadWrapper
                htmlFor="file-upload"
                style={{
                  backgroundColor: isGiftWrappingOrExtraPackaging
                    ? '#f2f2f2'
                    : 'white',
                  borderColor: '#cccccc',
                }}
              >
                <FileUploadName>{fileName}</FileUploadName>
                <HiddenInput
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isGiftWrappingOrExtraPackaging}
                />
                <FileUploadIcon
                  htmlFor="file-upload"
                  style={{
                    color: isGiftWrappingOrExtraPackaging ? '#ccc' : '#007bff',
                  }}
                >
                  <UploadIcon />
                </FileUploadIcon>
              </FileUploadWrapper>
              {isSavePressed && !isGiftWrappingOrExtraPackaging && !fileName ? (
                <Text
                  fontWeight="regular"
                  fontSize="baseText"
                  color="static.red"
                >
                  Required
                </Text>
              ) : null}
            </FileUploadWrapperContainer>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDeleteImage()}
              disabled={isGiftWrappingOrExtraPackaging}
              style={{ alignSelf: 'start', marginTop: '5px' }}
            >
              <IconContainer
                color={
                  isGiftWrappingOrExtraPackaging ? 'static.gray' : 'static.red'
                }
              >
                <DeleteIcon />
              </IconContainer>
            </Button>
          </FileUploadContainer>
        </Item>
        <div />
        <ItemRow>
          <Item>
            <ItemLabel htmlFor="name_ar">Name Ar</ItemLabel>
            <Input
              {...register('name_ar', {
                required: !isGiftWrappingOrExtraPackaging && true,
              })}
              style={{
                width: '254px',
              }}
              id="nameAr-input"
              placeholder="Enter Name"
              defaultValue={data ? data?.nameAr : ''}
              onChange={(e) =>
                setData({
                  ...data,
                  nameAr: (e.target as HTMLInputElement).value,
                } as IGetAddonsResponse)
              }
            />
            {isSavePressed && errors.name_ar && (
              <Text fontWeight="regular" fontSize="baseText" color="static.red">
                Required
              </Text>
            )}
          </Item>
          <Item>
            <ItemLabel htmlFor="name_en">Name En</ItemLabel>
            <Input
              {...register('name_en', {
                required: !isGiftWrappingOrExtraPackaging && true,
              })}
              style={{
                width: '254px',
              }}
              id="nameEn-input"
              placeholder="Enter Name"
              defaultValue={data ? data?.nameEn : ''}
              onChange={(e) =>
                setData({
                  ...data,
                  nameEn: (e.target as HTMLInputElement).value,
                } as IGetAddonsResponse)
              }
            />
            {isSavePressed && errors.name_en && (
              <Text fontWeight="regular" fontSize="baseText" color="static.red">
                Required
              </Text>
            )}
          </Item>
        </ItemRow>
        <ItemRow>
          <Item>
            <ItemLabel htmlFor="category-template-select">
              Add-ons Applied on
            </ItemLabel>
            <Select
              value={selectedAddOns}
              // @ts-ignore
              styles={customStyles}
              onChange={handleAddOnsChange}
              placeholder="Select"
              isLoading={false}
              options={options}
              getOptionLabel={(option) => option?.label}
              getOptionValue={(option) => option?.value}
              isSearchable={false}
              id="category-template-select"
              instanceId="category-template-select"
            />
            {isSavePressed && !selectedAddOns && (
              <Text fontWeight="regular" fontSize="baseText" color="static.red">
                Required
              </Text>
            )}
          </Item>
          <Item
            style={{
              opacity: selectedAddOns?.value === '2' ? 1 : 0,
              pointerEvents: selectedAddOns?.value === '2' ? 'auto' : 'none',
            }}
          >
            <FileUploadContainer>
              <FileUploadWrapperContainer>
                <ItemLabel htmlFor="sellers_id">Seller ID</ItemLabel>
                <Input
                  {...register('sellers_id', {
                    required: selectedAddOns?.value === '2' ? true : false,
                  })}
                  style={{
                    width: '225px',
                  }}
                  id="sellers-input"
                  placeholder="Enter Sellers ID"
                  defaultValue={data ? data?.sellerIds?.join(',') : ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      sellerIds: (e.target as HTMLInputElement).value.split(
                        ','
                      ),
                    } as IGetAddonsResponse)
                  }
                />
                {isSavePressed &&
                  errors.sellers_id &&
                  selectedAddOns?.value === '2' && (
                    <Text
                      fontWeight="regular"
                      fontSize="baseText"
                      color="static.red"
                    >
                      Required
                    </Text>
                  )}
              </FileUploadWrapperContainer>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDelete()}
                cssProps={{
                  marginBottom:
                    isSavePressed &&
                    errors.sellers_id &&
                    selectedAddOns?.value === '2'
                      ? '22px'
                      : '',
                }}
              >
                <IconContainer color="static.red">
                  <DeleteIcon />
                </IconContainer>
              </Button>
            </FileUploadContainer>
          </Item>
        </ItemRow>
        <ItemRow>
          <Item>
            <ItemLabel htmlFor="price">Price</ItemLabel>
            <Input
              {...register('price', {
                required: true,
                validate: (value) => value > 0,
              })}
              id="price-input"
              placeholder="Enter Number"
              type="number"
              defaultValue={data ? data?.price : ''}
              style={{ width: '254px' }}
              onChange={(e) =>
                setData({
                  ...data,
                  price: Number((e.target as HTMLInputElement).value),
                } as IGetAddonsResponse)
              }
            />
            {isSavePressed && errors.price && errors.price.type === 'required' && (
              <Text fontWeight="regular" fontSize="baseText" color="static.red">
                Required
              </Text>
            )}
            {isSavePressed && errors.price && errors.price.type === 'validate' && (
              <Text fontWeight="regular" fontSize="baseText" color="static.red">
                Please enter a positive number
              </Text>
            )}
          </Item>
          <Item>
            <ItemLabel htmlFor="price-type-select">Price Type</ItemLabel>
            <Select
              isDisabled={false}
              value={getValueFromSaved(
                (data?.priceType as string) || templatePrice[0].value,
                templatePrice
              )}
              // @ts-ignore
              styles={customStyles}
              onChange={(selectedOption) =>
                handleSelectChange('priceType', selectedOption)
              }
              placeholder={data?.priceType}
              isLoading={false}
              options={templatePrice}
              getOptionLabel={(option) => option?.label}
              getOptionValue={(option) => option?.value}
              isSearchable={false}
              id="price-template-select"
              instanceId="price-template-select"
            />
          </Item>
        </ItemRow>
        <Item>
          <ItemLabel htmlFor="modelIds-input">Model IDs</ItemLabel>
          <Input
            {...register('modelIds', {
              required: true,
              pattern: {
                value: /^[A-Za-z0-9]+(?:,[A-Za-z0-9]+)*$/,
                message:
                  'Please enter valid Model IDs (a single alphanumeric value or alphanumeric values separated by commas and no spaces)',
              },
            })}
            id="modelIds-input"
            placeholder="Enter Model ID"
            type="text"
            defaultValue={modelIds ? modelIds.join(',') : ''}
            style={{ width: '100%' }}
            onChange={(e) =>
              setData({
                ...data,
                modelIds: (e.target as HTMLInputElement).value.split(','),
              } as IGetAddonsResponse)
            }
          />
          {isSavePressed && errors.modelIds && (
            <Text fontWeight="regular" fontSize="baseText" color="static.red">
              {errors.modelIds.type === 'required'
                ? 'Required'
                : (errors.modelIds?.message as string) || ''}
            </Text>
          )}
        </Item>
        <ItemRow>
          <Item>
            <ItemLabel htmlFor="taglineAR-input">Choose taglines AR</ItemLabel>
            <Input
              {...register('tagLine_ar')}
              style={{ width: '254px' }}
              id="taglineAR-input"
              placeholder="Tag, Tag, Tag"
              defaultValue={data ? data?.taglineAr?.join(',') : ''}
              onChange={(e) =>
                setData({
                  ...data,
                  taglineAr: (e.target as HTMLInputElement).value.split(','),
                } as IGetAddonsResponse)
              }
              disabled={isGiftWrappingOrExtraPackaging}
            />
          </Item>
          <Item>
            <ItemLabel htmlFor="taglineEN-input">Choose taglines EN</ItemLabel>
            <Input
              {...register('tagLine_en')}
              style={{ width: '254px' }}
              id="taglineEN-input"
              placeholder="Tag, Tag, Tag"
              defaultValue={data ? data?.taglineEn?.join(',') : ''}
              onChange={(e) =>
                setData({
                  ...data,
                  taglineEn: (e.target as HTMLInputElement).value.split(','),
                } as IGetAddonsResponse)
              }
              disabled={isGiftWrappingOrExtraPackaging}
            />
          </Item>
        </ItemRow>
        <ItemRow>
          <Item>
            <ItemLabel htmlFor="period-input">Selected Period</ItemLabel>
            <Input
              {...register('period')}
              id="period-input"
              placeholder="Enter Number"
              defaultValue={Number.isNaN(data?.validity) ? '' : data?.validity}
              type="number"
              style={{ width: '254px' }}
              onChange={(e) =>
                setData({
                  ...data,
                  validity: parseInt((e.target as HTMLInputElement).value, 10),
                } as IGetAddonsResponse)
              }
              disabled={isGiftWrappingOrExtraPackaging}
            />
          </Item>
          <Item>
            <br />
            <Select
              value={getValueFromSaved(
                data?.validityType || templatePeriod[0].value,
                templatePeriod
              )}
              // @ts-ignore
              styles={customStyles}
              onChange={(selectedOption) =>
                handleSelectChange('validityType', selectedOption)
              }
              placeholder={data?.validityType}
              isLoading={false}
              options={templatePeriod}
              getOptionLabel={(option) => option?.label}
              getOptionValue={(option) => option?.value}
              isSearchable={false}
              id="period-template-select"
              instanceId="period-template-select"
              isDisabled={isGiftWrappingOrExtraPackaging}
            />
          </Item>
        </ItemRow>
        <ItemRow>
          <Item>
            <ItemLabel htmlFor="descriptionAR-input">Description AR</ItemLabel>
            <Textarea
              {...register('description_ar')}
              id="descriptionAR-input"
              placeholder="Enter description"
              defaultValue={data ? data?.descriptionAr : ''}
              onChange={(e) =>
                setData({
                  ...data,
                  descriptionAr: (e.target as HTMLTextAreaElement).value,
                } as IGetAddonsResponse)
              }
              disabled={isGiftWrappingOrExtraPackaging}
              style={{
                backgroundColor: isGiftWrappingOrExtraPackaging
                  ? '#f2f2f2'
                  : 'white',
              }}
            />
          </Item>
          <Item>
            <ItemLabel htmlFor="descriptionEN-input">Description EN</ItemLabel>
            <Textarea
              {...register('description_en')}
              id="descriptionEN-input"
              placeholder="Enter description"
              defaultValue={data ? data?.descriptionEn : ''}
              onChange={(e) =>
                setData({
                  ...data,
                  descriptionEn: (e.target as HTMLTextAreaElement).value,
                } as IGetAddonsResponse)
              }
              disabled={isGiftWrappingOrExtraPackaging}
              style={{
                backgroundColor: isGiftWrappingOrExtraPackaging
                  ? '#f2f2f2'
                  : 'white',
              }}
            />
          </Item>
        </ItemRow>
        <Item>
          <Button
            variant="filled"
            type="submit"
            onClick={() => setIsSavePressed(true)}
            cssProps={{ width: '100%', marginTop: '20px' }}
          >
            {addon ? 'Save' : 'Add'}
          </Button>
        </Item>
      </FormContainer>
    </CommonModal>
  );
};

export default MainAddonModal;
