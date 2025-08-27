import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { BankDocument } from '../models/Bank';
import { BankRepository } from '../repositories/bankRepository';
import { BankDto } from '../dto/bank/bankDto';

@Service()
export class BankService {
  @Inject()
  error: ErrorResponseDto;
  @Inject()
  bankRepository: BankRepository;

  async getBankViaId(bankId: string) {
    try {
      const [errBrand, bank] = await this.bankRepository.getById(bankId);
      if (errBrand) {
        this.error.errorCode = bank.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = bank.result.toString();
        this.error.message = bank.message;
        throw this.error;
      }
      return bank.result as BankDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_BANK,
          exception.message
        );
      }
    }
  }

  async getBankList() {
    try {
      const [errBrand, banks] = await this.bankRepository.getBankList();
      if (errBrand) {
        this.error.errorCode = banks.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = banks.result.toString();
        this.error.message = banks.message;
        throw this.error;
      }
      return banks.result as BankDocument[];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_BANK,
          exception.message
        );
      }
    }
  }

  async addNewBankList(request: BankDto[]) {
    try {
      const data = await Promise.all(
        request?.map(async (bank: BankDto) => {
          const [, resBank] = await this.bankRepository.getBankDetailViaCode(
            bank.bankCode
          );
          const bankData = resBank.result as BankDocument;
          if (bankData) {
            return;
          }
          return await this.bankRepository.createNewBank({
            bankName: bank.bankName,
            bankName_ar: bank.bankNameAr,
            bankCode: bank.bankCode,
            isNonSaudiBank: true,
            status: 'Active',
          } as any);
        })
      );
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_SAVE_NEW_BANK,
          exception.message
        );
      }
    }
  }

  async getBankViaCode(bankBIC: string) {
    try {
      const [, resBank] = await this.bankRepository.getBankDetailViaCode(
        bankBIC
      );
      return resBank.result as BankDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_BANK,
          exception.message
        );
      }
    }
  }
}
