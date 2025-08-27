import { Inject, Injectable } from '@nestjs/common';
import {
  COMMISSION_PACKAGE_NAME,
  CalculateCommissionSummaryRequest,
  CalculateCommissionSummaryRequestForList,
  CalculateCommissionSummaryResponse,
  CalculateCommissionSummaryResponseForList,
  CommissionServiceClient,
  CommissionSummaryResponse,
  CreateCommissionSummaryRequest,
  ProductCommissionSummaryResponse,
  UpdateSellPriceRequest,
} from '../grpc/proto/commission.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommissionService {
  private service: CommissionServiceClient;
  constructor(
    @Inject(COMMISSION_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service =
      this.client.getService<CommissionServiceClient>('CommissionService');
  }

  async calculateProductCommissionSummary(
    payload: CalculateCommissionSummaryRequest,
  ): Promise<CalculateCommissionSummaryResponse> {
    return await firstValueFrom(
      this.service.calculateProductCommissionSummary(payload),
      {
        defaultValue: null,
      },
    );
  }

  async calculateProductCommissionSummaryForList(
    payload: CalculateCommissionSummaryRequestForList,
  ): Promise<CalculateCommissionSummaryResponseForList> {
    return await firstValueFrom(
      this.service.calculateProductCommissionSummaryForList(payload),
      {
        defaultValue: null,
      },
    );
  }

  async createProductCommissionSummary(
    payload: CreateCommissionSummaryRequest,
  ): Promise<CommissionSummaryResponse> {
    return await firstValueFrom(
      this.service.createProductCommissionSummary(payload),
      {
        defaultValue: null,
      },
    );
  }

  async updateSellPriceCommissionSummary(
    payload: UpdateSellPriceRequest,
  ): Promise<ProductCommissionSummaryResponse> {
    return await firstValueFrom(this.service.updateSellPrice(payload), {
      defaultValue: null,
    });
  }
}
