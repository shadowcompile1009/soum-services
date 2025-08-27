import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  CreateShipmentReq,
  CreateShipmentResponse,
  LER_PACKAGE_NAME,
  LerServiceClient,
} from '@modules/grpc/proto/ler.pb';

@Injectable()
export class LerService implements OnModuleInit {
  private service: LerServiceClient;
  constructor(
    @Inject(LER_PACKAGE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<LerServiceClient>('LerService');
  }

  async createShipment(
    params: CreateShipmentReq,
  ): Promise<CreateShipmentResponse> {
    return await firstValueFrom(this.service.createShipment(params), {
      defaultValue: null,
    });
  }
}
