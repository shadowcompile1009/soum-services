import { Inject, Injectable } from '@nestjs/common';
import {
  GetCreditsByOrderIdsRequest,
  GetTransactionsRequest,
  GetTransactionsResponse,
  GetWalletRequest,
  GetWalletResponse,
  WALLET_PACKAGE_NAME,
  WalletServiceClient,
} from '../grpc/proto/wallet.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WalletService {
  private service: WalletServiceClient;
  constructor(
    @Inject(WALLET_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<WalletServiceClient>('WalletService');
  }

  async getWallet(payload: GetWalletRequest): Promise<GetWalletResponse> {
    return firstValueFrom(this.service.getWallet(payload), {
      defaultValue: null,
    });
  }

  async getTransaction(
    payload: GetTransactionsRequest,
  ): Promise<GetTransactionsResponse> {
    return firstValueFrom(this.service.getTransactions(payload), {
      defaultValue: null,
    });
  }

  async getCreditsByOrderIds(orderIds: GetCreditsByOrderIdsRequest) {
    return firstValueFrom(this.service.getCreditsByOrderIds(orderIds), {
      defaultValue: null,
    });
  }
}
