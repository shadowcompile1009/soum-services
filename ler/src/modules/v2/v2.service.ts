import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  V2ServiceClient,
  V2_PACKAGE_NAME,
  UpdateLogisticServiceRequest,
  UpdateLogisticServiceResponse,
  CreateSMSATracking,
} from '@modules/grpc/proto/v2.pb';

@Injectable()
export class V2Service implements OnModuleInit {
  private service: V2ServiceClient;
  constructor(
    @Inject(V2_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<V2ServiceClient>('V2Service');
  }

  async updateLogisticService(
    payload: UpdateLogisticServiceRequest,
  ): Promise<UpdateLogisticServiceResponse> {
    return firstValueFrom(this.service.updateLogisticService(payload), {
      defaultValue: null,
    });
  }

  async generateSMSATracking(
    payload: CreateSMSATracking,
  ): Promise<CreateSMSATracking> {
    return firstValueFrom(this.service.createSmsaTracking(payload), {
      defaultValue: null,
    });
  }
}
