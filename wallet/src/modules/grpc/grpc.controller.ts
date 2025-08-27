import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

import { WalletService } from '@modules/wallet/wallet.service';
import { WalletSettingsService } from '@modules/wallet-settings/wallet-settings.service';
import { TransactionService } from '@modules/transaction/transaction.service';
import { CreateTransactionDto } from '@modules/transaction/dto/create-transaction.dto';
import { WalletSettings } from '@modules/wallet-settings/schemas/wallet-settings.schema';

import {
  GetCreditsByOrderIdsRequest,
  GetTransactionRequest,
  GetTransactionsRequest,
  GetWalletRequest,
  UpdateAmountTransactionRequest,
  GetListingFeeRequest,
  UpdateTransactionRequest,
  UpdateWalletRequest,
  WALLET_SERVICE_NAME,
  GetPermissionsRequest,
  GetPermissionsResponse,
} from './proto/wallet.pb';
import { TransactionType } from '../transaction/enums/transaction.type.enum';
import { TransactionStatus } from '../transaction/enums/transaction.status.enum';
import { Transaction } from '../transaction/schemas/transaction.schema';
import { APIConstants } from '@src/constants/api-constants';

@Controller('/')
export class GRPCController {
  constructor(
    private readonly walletService: WalletService,
    private readonly walletSettingService: WalletSettingsService,
    private readonly transactionService: TransactionService,
    private readonly walletSettingsService: WalletSettingsService,
  ) {}

  @GrpcMethod(WALLET_SERVICE_NAME, 'GetWallet')
  async getByUserId(payload: GetWalletRequest) {
    let wallet: any = await this.walletService.findOneByUserId(payload.ownerId);
    wallet = wallet.toObject();
    wallet.createdAt = Date.parse(wallet.createdAt) / 1000;
    wallet.updatedAt = Date.parse(wallet.updatedAt) / 1000;

    return wallet;
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'GetTransactions')
  async getByOrderId(payload: GetTransactionsRequest) {
    let transactions: any = await this.transactionService.findByOrderIds([
      payload.orderId,
    ]);
    transactions = transactions.map((t: any) => {
      t = t.toObject();
      t.createdAt = Date.parse(t.createdAt) / 1000;
      t.updatedAt = Date.parse(t.updatedAt) / 1000;
      return t;
    });
    return { data: transactions };
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'CreateTransaction')
  async createTransaction(createTransactionDto: CreateTransactionDto) {
    if (createTransactionDto.amount > 6000) {
      //TODO: We will fix class validator issue for RPC functions later
      throw new RpcException('Amount should not be more than 6000');
    }
    let t: any = await this.transactionService.create(createTransactionDto);
    t = t.toObject();
    t.createdAt = Date.parse(t.createdAt) / 1000;
    t.updatedAt = Date.parse(t.updatedAt) / 1000;

    return t;
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'GetCreditsByOrderIds')
  async GetCreditsByOrderIds(payload: GetCreditsByOrderIdsRequest) {
    let transactions: any = await this.transactionService.findByOrderIds(
      payload.orderIds,
      [TransactionType.CREDIT],
      [
        TransactionStatus.CANCELED,
        TransactionStatus.PENDING,
        TransactionStatus.SUCCESS,
      ],
    );
    transactions = transactions.map((t: any) => {
      t = t.toObject();
      t.createdAt = Date.parse(t.createdAt) / 1000;
      t.updatedAt = Date.parse(t.updatedAt) / 1000;
      return t;
    });
    return { data: transactions };
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'GetListingFee')
  async GetListingFee(payload: GetListingFeeRequest) {
    const listingFee: any = await this.walletSettingService.getListingFee(
      payload.settingKey,
    );
    const setting = (JSON.parse(listingFee.config) || []).find(
      (item: any) => item.name === 'minDepositFee',
    );
    if (!setting) {
      return {};
    }
    return {
      id: listingFee._id,
      walletSettingsId: listingFee.walletSettingsId,
      listingFee: setting.value,
    };
  }
  @GrpcMethod(WALLET_SERVICE_NAME, 'GetPayoutSettings')
  async GetPayoutSettings() {
    const walletSetting: WalletSettings = await (
      await this.walletSettingsService.findByNames('sellerWalletPayout')
    ).pop();
    return walletSetting;
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'GetGlobalWalletToggle')
  async GetGlobalWalletToggle() {
    const walletSetting: WalletSettings = (
      await this.walletSettingsService.findByNames('walletToggle')
    ).pop();
    return walletSetting;
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'UpdatePendingAmountTransaction')
  async UpdatePendingAmountTransaction(
    payload: UpdateAmountTransactionRequest,
  ) {
    const transaction: Transaction =
      await this.transactionService.updatePendingAmountTransaction(
        payload.transactionId,
        payload.amount,
      );
    return transaction;
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'GetTransactionById')
  async GetTransactionById(payload: GetTransactionRequest) {
    let transaction: any = await this.transactionService.findOne(payload.id);
    transaction = transaction.toObject();
    transaction.createdAt = Date.parse(transaction.createdAt);
    transaction.updatedAt = Date.parse(transaction.updatedAt);
    return transaction;
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'UpdateTransaction')
  async UpdateTransaction(payload: UpdateTransactionRequest) {
    const transaction: any = await this.transactionService.findOne(
      payload.transactionId,
    );
    if (transaction) {
      transaction.status = payload.status;
      await this.transactionService.update(payload.transactionId, transaction);
    }
    return transaction;
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'UpdateWallet')
  async UpdateWallet(payload: UpdateWalletRequest) {
    let wallet;
    if (payload.transactionType === 'deposit') {
      wallet = await this.walletService.creditToWallet(
        payload.walletId,
        payload.amount,
      );
    } else {
      wallet = await this.walletService.withdraw(
        payload.walletId,
        payload.amount,
      );
    }
    return wallet;
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'GetPermissions')
  async GetPermissions(
    payload: GetPermissionsRequest,
  ): Promise<GetPermissionsResponse> {
    const apiConstants = APIConstants;
    const response: GetPermissionsResponse = { permissions: [] };
    for (const [, value] of Object.entries(apiConstants)) {
      const tempObj = {
        key: value?.KEY,
        description: value?.DESCRIPTION,
      };
      response.permissions.push(tempObj);
    }
    return response;
  }
}
