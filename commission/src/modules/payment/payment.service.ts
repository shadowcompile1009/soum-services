import { Inject, Injectable } from '@nestjs/common';
import {
  GetPaymentOptionRequest,
  GetPaymentOptionsRequest,
  GetPaymentOptionsResponse,
  PAYMENT_PACKAGE_NAME,
  PaymentOption,
  PaymentServiceClient,
} from '../grpc/proto/payment.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  private service: PaymentServiceClient;
  constructor(
    @Inject(PAYMENT_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service =
      this.client.getService<PaymentServiceClient>('PaymentService');
  }

  async getAllPaymentOptions(
    payload: GetPaymentOptionsRequest,
  ): Promise<GetPaymentOptionsResponse> {
    return firstValueFrom(this.service.getPaymentOptions(payload), {
      defaultValue: null,
    });
  }

  async getPaymentOptionById(
    payload: GetPaymentOptionRequest,
  ): Promise<PaymentOption> {
    return firstValueFrom(this.service.getPaymentOption(payload), {
      defaultValue: null,
    });
  }
}
