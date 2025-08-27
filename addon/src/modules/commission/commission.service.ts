import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  CalculateAddonSummaryRequest,
  CalculateAddonSummaryResponse,
  CommissionServiceClient,
  COMMISSION_PACKAGE_NAME,
} from '@modules/grpc/proto/commission.pb';

@Injectable()
export class CommissionService implements OnModuleInit {
  private service: CommissionServiceClient;
  constructor(
    @Inject(COMMISSION_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service =
      this.client.getService<CommissionServiceClient>('CommissionService');
  }

  async calculateAddonSummary(
    payload: CalculateAddonSummaryRequest,
  ): Promise<CalculateAddonSummaryResponse> {
    return firstValueFrom(this.service.calculateAddonSummary(payload), {
      defaultValue: null,
    });
  }
}
