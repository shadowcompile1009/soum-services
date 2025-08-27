export type MetaData = {
  operatingModel: string[];
  businessModel: string[];
  sellerType: string[];
  sellerCategory: string[];
};

export type UserAppResponse = {
  message: string | null;
  metaData: MetaData;
  operatingModel: string;
  businessModel: string;
  sellerType: string;
  sellerCategory: string;
  storeCRN: string;
  userAddress: string;
  userBankName: string;
  userIBAN: string;
  userBankBIC: string;
  isBusiness: boolean;
  isVATRegistered: boolean;
  userVATRegisteredNumber: string;
  userVATRegisteredName: string;
  status: string;
  timeStamp: string;
  violations: null | any;
};
