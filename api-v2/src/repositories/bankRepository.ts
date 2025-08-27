import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { Bank, BankDocument } from '../models/Bank';
import { BaseRepository } from './BaseRepository';

@Service()
export class BankRepository extends BaseRepository {
  async getById(
    bankId: string
  ): Promise<
    [boolean, { code: number; result: BankDocument | string; message?: string }]
  > {
    try {
      if (!bankId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.BANK_ID_NOT_FOUND,
          },
        ];
      }
      const data = await Bank.findById(bankId).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.BANK_ID_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_BANK,
          message: exception.message,
        },
      ];
    }
  }

  async getBankList(): Promise<
    [
      boolean,
      { code: number; result: BankDocument[] | string; message?: string }
    ]
  > {
    try {
      const data = await Bank.find({ status: 'Active' }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_BANK,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_BANK,
          message: exception.message,
        },
      ];
    }
  }

  async getBankCodeViaName(
    bankName: string
  ): Promise<
    [boolean, { code: number; result: BankDocument | string; message?: string }]
  > {
    try {
      const data = await Bank.findOne({
        $or: [{ bankName: bankName }, { bankName_ar: bankName }],
      }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_BANK,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_BANK,
          message: exception.message,
        },
      ];
    }
  }
  async getBankDetailViaCode(
    bankCode: string
  ): Promise<
    [boolean, { code: number; result: BankDocument | string; message?: string }]
  > {
    try {
      const data = await Bank.findOne({
        bankCode: bankCode,
      }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: null,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: null,
          message: exception.message,
        },
      ];
    }
  }

  async createNewBank(bank: BankDocument): Promise<BankDocument> {
    try {
      const newBank = new Bank({
        bankName: bank.bankName,
        bankName_ar: bank.bankName_ar,
        bankCode: bank.bankCode,
        status: bank.status,
        isNonSaudiBank: bank.isNonSaudiBank,
      });
      const data = await newBank.save();
      return data;
    } catch (exception) {
      console.log(exception);
      return null;
    }
  }
}
