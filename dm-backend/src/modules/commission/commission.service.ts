import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  COMMISSION_PACKAGE_NAME,
  CommissionServiceClient,
  ProductCommissionSummaryResponse,
  UpdateSellerCommissionRequest,
} from '../grpc/proto/commission.pb';

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

  async addSellerCommissionPenalty(
    payload: UpdateSellerCommissionRequest,
  ): Promise<ProductCommissionSummaryResponse> {
    return firstValueFrom(this.service.addSellerCommissionPenalty(payload), {
      defaultValue: null,
    });
  }
}
