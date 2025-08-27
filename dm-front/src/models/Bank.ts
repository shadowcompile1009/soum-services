import { instanceToPlain } from 'class-transformer';

import { apiClientV2 } from '@/api/client';

interface IBankRespoonse {
  status: boolean;
  _id: string;
  bankName: string;
  bankCode: string;
}

interface IBank {
  status: boolean;
  id: string;
  bankName: string;
  bankCode: string;
}

export const BankEndpoints = {
  getBanks: 'rest/api/v1/bank/list',
};

export class Bank {
  static async getBanks() {
    const result = await apiClientV2.client.get(BankEndpoints.getBanks);
    return result.data?.responseData;
  }

  static mapBanks(banks: IBankRespoonse[]): Bank[] {
    const mappedBanks = banks?.map(
      (bank: IBankRespoonse) =>
        new Bank({
          id: bank._id,
          status: bank.status,
          bankName: bank.bankName,
          bankCode: bank.bankCode,
        })
    );

    return instanceToPlain(mappedBanks) as Bank[];
  }

  public status: boolean;
  public id: string;
  public bankName: string;
  public bankCode: string;

  constructor({ status, id, bankName, bankCode }: IBank) {
    this.status = status;
    this.id = id;
    this.bankCode = bankCode;
    this.bankName = bankName;
  }
}
