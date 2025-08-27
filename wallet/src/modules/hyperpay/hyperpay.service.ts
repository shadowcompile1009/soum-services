import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { HyperPayLoginResDto } from '@modules/hyperpay/dto/login-res.dto';
import hyperpayConfig from '@src/config/hyperpay.config';

import {
  CreateHyperpayTransationDTO,
  CreateHyperpayTransationResponseDTO,
  GetSpecificOrderRequestDTO,
  GetSpecificPayoutRequestDTO,
  GetSpecificPayoutResponseDTO,
} from './dto/transaction.dto';

@Injectable()
export class HyperpayService {
  private readonly logger = new Logger(HyperpayService.name);
  private accessToken: string;

  constructor(
    @Inject(hyperpayConfig.KEY)
    private readonly hyperConfig: ConfigType<typeof hyperpayConfig>,
    private readonly httpService: HttpService,
  ) {}

  async getAccessToken() {
    const { accessToken, message } = await this.loginHyperSplit();
    if (!accessToken) {
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return accessToken;
  }

  private async loginHyperSplit(): Promise<HyperPayLoginResDto> {
    const client = this.httpService.axiosRef;
    return new Promise(async (resolve) => {
      try {
        const res = await client.post(
          `/api/v1/login`,
          {
            email: this.hyperConfig.splitEmail,
            password: this.hyperConfig.splitPass,
          },
          {
            timeout: 5000,
          },
        );
        if (res.status !== HttpStatus.OK || res.data.status === false) {
          this.logger.error(res.data.errors);
        }
        if (res.data && res.data.data && res.data.data.accessToken !== null) {
          return resolve({
            accessToken: res.data.data.accessToken,
            message: 'Successfully logged in HyperSplits',
          });
        }
        return resolve({
          accessToken: null,
          message: 'Failed to login HyperSplits',
        });
      } catch (error) {
        this.logger.error('HYPERSPLIT: Failed to login', error);
        return resolve({
          accessToken: null,
          message: 'Failed to login HyperSplits',
        });
      }
    });
  }

  async createDepositTransaction(
    data: CreateHyperpayTransationDTO,
  ): Promise<CreateHyperpayTransationResponseDTO> {
    if (!this.accessToken) {
      this.accessToken = await this.getAccessToken();
    }
    const bankIdBIC = data?.user?.bankDetail?.bankBIC;
    const beneficiary = [
      {
        name: data?.user?.bankDetail?.accountHolderName,
        accountId: data?.user?.bankDetail?.accountId,
        debitCurrency: 'SAR',
        transferAmount: data?.transaction?.amount.toFixed(2),
        transferCurrency: 'SAR',
        bankIdBIC,
        payoutBeneficiaryAddress1: data?.user?.address?.district,
        payoutBeneficiaryAddress2: data?.user?.address?.city,
        payoutBeneficiaryAddress3: data?.user?.address?.postalCode,
        swift: !data?.user?.bankDetail?.isNonSaudiBank ? 0 : 1,
      },
    ];

    if (bankIdBIC == 'INMASARI') {
      beneficiary[0].accountId = beneficiary[0].accountId.substring(10);
      delete beneficiary[0].bankIdBIC;
    }
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.httpService.axiosRef.post(
          '/api/v1/orders',
          {
            configId: this.hyperConfig.splitConfigId,
            merchantTransactionId: data.transaction.id,
            transferOption: '0',
            beneficiary,
          },
          {
            headers: {
              Authorization: 'Bearer ' + this.accessToken,
            },
          },
        );
        if (
          response.status !== HttpStatus.OK ||
          response.data.status === false
        ) {
          this.logger.error(response.data.errors);
          reject(response.data);
        }
        resolve(response.data.data);
      } catch (error) {
        this.logger.error(
          'HYPERSPLIT: Failed to create depositTransaction',
          error,
        );
        reject(error);
      }
    });
  }

  async getSpecificOrder(data: GetSpecificOrderRequestDTO): Promise<string> {
    if (!this.accessToken) {
      this.accessToken = await this.getAccessToken();
    }
    const client = this.httpService.axiosRef;
    return new Promise(async (resolve) => {
      try {
        const res = await client.get(
          `/api/v1/orders/${data.accountId}/${data.uniqueId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Bearer ' + this.accessToken,
            },
            timeout: 2000,
          },
        );
        if (res.status !== HttpStatus.OK || res.data.status === false) {
          this.logger.error(res.data.errors);
        }
        if (res.data && res.data.data && res.data.data[0].batch_id !== null) {
          return resolve(res.data.data[0].batch_id);
        }
        return resolve(null);
      } catch (error) {
        this.logger.error('HYPERSPLIT: Failed to fetch SpecificOrder', error);
        return resolve(null);
      }
    });
  }

  async getSpecificPayout(
    data: GetSpecificPayoutRequestDTO,
  ): Promise<GetSpecificPayoutResponseDTO> {
    if (!this.accessToken) {
      this.accessToken = await this.getAccessToken();
    }
    return new Promise(async (resolve) => {
      try {
        const response = await this.httpService.axiosRef.get(
          `/api/v1/payouts/${data.batchId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Bearer ' + this.accessToken,
            },
            timeout: 2000,
          },
        );
        if (
          response.status !== HttpStatus.OK ||
          response.data.status === false
        ) {
          this.logger.error(response.data.errors);
          return resolve(null);
        }
        return resolve({
          status: response.data.data[0].PayoutStatus,
          createdAt: response.data.data[0].created_at,
          updatedAt: response.data.data[0].updated_at,
        });
      } catch (error) {
        this.logger.error('HYPERSPLIT: Failed to fetch SpecificPayout', error);
        return resolve({
          status: 'Failed',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });
  }
}
