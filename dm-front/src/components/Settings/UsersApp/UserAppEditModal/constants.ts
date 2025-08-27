import { UserAppResponse } from '../hooks/types';

const formatOptions = (values: string[]) =>
  values.map((value) => ({
    value,
    label: value.includes('-')
      ? // Handle special cases and hyphenated values
        value === 'soum-uae'
        ? 'Soum UAE'
        : value === 'soum-ksa'
        ? 'Soum KSA'
        : value
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
      : // Capitalize non-hyphenated values
        value.charAt(0).toUpperCase() + value.slice(1),
  }));

export const getOptions = (userDetails?: UserAppResponse) => {
  if (!userDetails?.metaData) {
    return {
      businessModel: [],
      sellerType: { business: [], soum: [] },
      sellerCategory: [],
      operatingModel: { default: [], soum: [] },
    };
  }

  const { metaData } = userDetails;

  // Transform metadata arrays into required format
  const businessModelOptions = formatOptions(metaData.businessModel);
  const sellerTypeOptions = formatOptions(metaData.sellerType);
  const sellerCategoryOptions = formatOptions(metaData.sellerCategory);
  const operatingModelOptions = formatOptions(metaData.operatingModel);

  return {
    businessModel: businessModelOptions,
    // Maintain the nested structure for sellerType
    sellerType: {
      business: sellerTypeOptions.filter((option) =>
        ['corporate-partnership', 'local-stores', 'soum-uae'].includes(
          option.value
        )
      ),
      soum: sellerTypeOptions.filter((option) =>
        ['soum-ksa'].includes(option.value)
      ),
    },
    sellerCategory: sellerCategoryOptions,
    operatingModel: {
      default: operatingModelOptions.filter((option) =>
        ['normal-payout', 'early-payout'].includes(option.value)
      ),
      soum: operatingModelOptions.filter((option) =>
        ['soum-payout'].includes(option.value)
      ),
    },
  };
};

export const formDefaultValues = (userDetails: UserAppResponse | undefined) => {
  return {
    businessModel: userDetails?.businessModel,
    sellerType: userDetails?.sellerType,
    sellerCategory: userDetails?.sellerCategory,
    operatingModel: userDetails?.operatingModel,
    isBusinessIndividual: userDetails?.isBusiness,
    isVatRegistered: userDetails?.isVATRegistered,
    vatRegisteredName: userDetails?.userVATRegisteredName,
    vatNumber: userDetails?.userVATRegisteredNumber,
    crNumber: userDetails?.storeCRN,
    bankName: userDetails?.userBankName,
    registeredAddress: userDetails?.userAddress,
    iban: userDetails?.userIBAN,
  };
};
