import { Inject, Injectable } from '@nestjs/common';
import {
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  INVOICE_PACKAGE_NAME,
  InvoiceServiceClient,
} from '../grpc/proto/invoice.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InvoiceService {
  private service: InvoiceServiceClient;
  constructor(
    @Inject(INVOICE_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service =
      this.client.getService<InvoiceServiceClient>('InvoiceService');
  }

  async createInvoice(
    payload: CreateInvoiceRequest,
  ): Promise<CreateInvoiceResponse> {
    return firstValueFrom(this.service.createInvoice(payload), {
      defaultValue: null,
    });
  }
}
