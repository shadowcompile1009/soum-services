import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  CheckPayoutStatusRequest,
  CheckPayoutStatusResponse,
  CreatePayoutRequest,
  CreatePayoutResponse,
  PAYMENT_PACKAGE_NAME,
  PaymentServiceClient,
} from '../grpc/proto/payment.pb';

@Injectable()
export class PaymentService implements OnModuleInit {
  private service: PaymentServiceClient;
  constructor(
    @Inject(PAYMENT_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service =
      this.client.getService<PaymentServiceClient>('PaymentService');
  }

  async createPayout(
    payload: CreatePayoutRequest,
  ): Promise<CreatePayoutResponse> {
    return await firstValueFrom(this.service.createPayout(payload), {
      defaultValue: null,
    });
  }

  async checkPayoutStatus(
    payload: CheckPayoutStatusRequest,
  ): Promise<CheckPayoutStatusResponse> {
    return await firstValueFrom(this.service.checkPayoutStatus(payload), {
      defaultValue: null,
    });
  }
}
