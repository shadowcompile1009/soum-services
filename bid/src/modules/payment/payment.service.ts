import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  CaptureTransactionRequest,
  CreateTransactionRequest,
  CreateTransactionResponse,
  GetTransactionRequest,
  PAYMENT_PACKAGE_NAME,
  PaymentServiceClient,
  ReverseTransactionRequest,
  TransactionResponse,
} from '@modules/grpc/proto/payment.pb';
import { Metadata } from '@grpc/grpc-js';

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

  async createTransaction(
    payload: CreateTransactionRequest,
    headers: Map<string, string>,
  ): Promise<CreateTransactionResponse> {
    const metadata = new Metadata();
    for (const [key, value] of headers) {
      metadata.add(key, value);
    }
    return firstValueFrom(this.service.createTransaction(payload, metadata), {
      defaultValue: null,
    });
  }

  async getTransactionById(
    payload: GetTransactionRequest,
  ): Promise<TransactionResponse> {
    return firstValueFrom(this.service.getTransactionById(payload), {
      defaultValue: null,
    });
  }

  async captureTransaction(
    payload: CaptureTransactionRequest,
  ): Promise<TransactionResponse> {
    return firstValueFrom(this.service.captureTransaction(payload), {
      defaultValue: null,
    });
  }
  async reverseTransaction(
    payload: ReverseTransactionRequest,
  ): Promise<TransactionResponse> {
    return firstValueFrom(this.service.reverseTransaction(payload), {
      defaultValue: null,
    });
  }
}
