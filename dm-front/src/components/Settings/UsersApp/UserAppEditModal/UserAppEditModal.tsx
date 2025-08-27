import { useMemo } from 'react';

import { parseCookies } from 'nookies';
import {
  Controller,
  Control,
  UseFormWatch,
  UseFormSetValue,
  UseFormHandleSubmit,
} from 'react-hook-form';

import { CommonModal } from '@src/components/Modal';
import { Text } from '@src/components/Text';
import { Box } from '@src/components/Box';
import { CloseIcon } from '@src/components/Shared/CloseIcon';

import { getOptions } from './constants';
import { UserAppCheckbox } from './UserAppCheckbox';
import { UserAppInput } from './UserAppInput';
import { UserAppEditSelect } from './Select';

import { FormContainer, Item, SaveButtonElement } from './styles';

import { FormState } from './types';
import { UserAppResponse } from '../hooks/types';

type UserAppEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormState) => void;
  userDetails?: UserAppResponse;
  control: Control<FormState, any>;
  watch: UseFormWatch<FormState>;
  setValue: UseFormSetValue<FormState>;
  handleSubmit: UseFormHandleSubmit<FormState>;
  isInitialLoad: boolean;
};

export const UserAppEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  userDetails,
  control,
  watch,
  setValue,
  handleSubmit,
  isInitialLoad,
}: UserAppEditModalProps) => {
  const cookies = parseCookies();
  const userRole = useMemo(() => cookies['x-user-roleName'], [cookies]);
  const options = useMemo(() => getOptions(userDetails), [userDetails]);

  const businessModel = watch('businessModel');
  const sellerType = watch('sellerType');

  const getSellerTypeOptions = () => {
    if (businessModel === 'business') return options.sellerType.business;
    if (businessModel === 'soum') return options.sellerType.soum;

    return [];
  };

  const getSellerCategoryOptions = () => {
    if (['local-stores'].includes(sellerType)) {
      return options.sellerCategory;
    }
    return [];
  };

  const getOperatingModelOptions = () => {
    if (businessModel === 'soum' || sellerType === 'soum-uae') {
      return options.operatingModel.soum;
    }
    return options.operatingModel.default;
  };

  const isSellerTypeDisabled = businessModel === 'individual';
  const isSellerCategoryDisabled =
    businessModel === 'individual' ||
    businessModel === 'soum' ||
    ['corporate-partnership', 'soum-ksa', 'soum-uae'].includes(sellerType);

  const isOperatingModelDisabled = false;

  watch((data, { name }) => {
    if (name === 'businessModel' && data.businessModel && !isInitialLoad) {
      setValue('sellerType', '');
      setValue('sellerCategory', '');
      setValue('operatingModel', '');
    }

    if (name === 'sellerType' && data.sellerType) {
      if (
        ['corporate-partnership', 'soum-ksa', 'soum-uae'].includes(
          data.sellerType
        ) &&
        !isInitialLoad
      ) {
        setValue('sellerCategory', '');
      }
      if (data.sellerType === 'soum-uae' && !isInitialLoad) {
        setValue('operatingModel', '');
      }
    }
  });

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      width="56.25rem"
      maxHeight="fit-content"
      height="fit-content"
    >
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
          Edit User
        </Text>
        <CloseIcon onClick={onClose} />
      </Box>
      <Box cssProps={{ margin: '1rem 0' }}>
        <Text color="static.black" fontSize="bigText" fontWeight="bold">
          Seller Compliance Details
        </Text>
      </Box>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <Item>
          <Controller
            name="isBusinessIndividual"
            control={control}
            render={({ field }) => (
              <UserAppCheckbox
                {...field}
                checked={field.value}
                id="business/individual"
                label="Are you Business / Individual?"
                value={field.value ? 'true' : 'false'}
                isDisabled={true}
              />
            )}
          />
          <Controller
            name="isVatRegistered"
            control={control}
            render={({ field }) => (
              <UserAppCheckbox
                {...field}
                checked={field.value}
                id="vat-registered"
                label="Are you VAT Registered?"
                value={field.value ? 'true' : 'false'}
                isDisabled={true}
              />
            )}
          />
        </Item>
        <Item>
          <Controller
            name="vatRegisteredName"
            control={control}
            render={({ field }) => (
              <UserAppInput
                label="VAT Registered Name"
                type="text"
                {...field}
                defaultValue={userDetails?.userAddress}
                isDisabled={true}
              />
            )}
          />
          <Controller
            name="vatNumber"
            control={control}
            render={({ field }) => (
              <UserAppInput
                label="VAT Number"
                type="number"
                {...field}
                isDisabled={true}
              />
            )}
          />
        </Item>
        <Item>
          <Controller
            name="crNumber"
            control={control}
            render={({ field }) => (
              <UserAppInput
                label="CR Number"
                type="number"
                placeholder="Enter CR Number"
                {...field}
              />
            )}
          />
          <Controller
            name="bankName"
            control={control}
            render={({ field }) => (
              <UserAppInput
                label="Bank Name"
                type="text"
                {...field}
                isDisabled={true}
              />
            )}
          />
        </Item>
        <Item>
          <Controller
            name="registeredAddress"
            control={control}
            render={({ field }) => (
              <UserAppInput
                label="Registered Address"
                type="text"
                {...field}
                isDisabled={true}
              />
            )}
          />
          <Controller
            name="iban"
            control={control}
            render={({ field }) => (
              <UserAppInput
                label="IBAN"
                type="text"
                {...field}
                isDisabled={true}
              />
            )}
          />
        </Item>
        <Box
          cssProps={{ borderBottom: '1px solid #EBEDF0', margin: '1rem 0' }}
        />
        <Item>
          <Controller
            name="businessModel"
            control={control}
            rules={{
              required:
                userRole === 'Admin' ? 'Business Model is required' : false,
            }}
            render={({ field, fieldState }) => (
              <UserAppEditSelect
                {...field}
                options={options.businessModel}
                label="Business Model"
                // isDisabled={userRole !== 'Admin'}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="sellerType"
            control={control}
            rules={{
              required:
                userRole === 'Admin' && !isSellerTypeDisabled
                  ? 'Seller Type is required'
                  : false,
            }}
            render={({ field, fieldState }) => (
              <UserAppEditSelect
                {...field}
                options={getSellerTypeOptions()}
                label="Seller Type"
                // isDisabled={userRole !== 'Admin' || isSellerTypeDisabled}
                error={fieldState.error?.message}
              />
            )}
          />
        </Item>
        <Item>
          <Controller
            name="sellerCategory"
            control={control}
            rules={{
              required:
                userRole === 'Admin' && !isSellerCategoryDisabled
                  ? 'Seller Category is required'
                  : false,
            }}
            render={({ field, fieldState }) => (
              <UserAppEditSelect
                {...field}
                options={getSellerCategoryOptions()}
                label="Seller Category"
                // isDisabled={userRole !== 'Admin' || isSellerCategoryDisabled}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="operatingModel"
            control={control}
            rules={{
              required:
                userRole === 'Admin' && !isOperatingModelDisabled
                  ? 'Operating Model is required'
                  : false,
            }}
            render={({ field, fieldState }) => (
              <UserAppEditSelect
                {...field}
                options={getOperatingModelOptions()}
                label="Operating Model"
                // isDisabled={userRole !== 'Admin' || isOperatingModelDisabled}
                error={fieldState.error?.message}
              />
            )}
          />
        </Item>
        <SaveButtonElement type="submit">Save</SaveButtonElement>
      </FormContainer>
    </CommonModal>
  );
};
