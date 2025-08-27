import { Inject, Injectable } from '@nestjs/common';
import {
  GetCityTiersRequest,
  GetCityTiersResponse,
  GetLogisticServicesRequest,
  GetLogisticServicesResponse,
  LER_PACKAGE_NAME,
  LerServiceClient,
  MapLogisticsServicesRequest,
  MapLogisticsServicesResponse,
} from '../grpc/proto/ler.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LerService {
  private service: LerServiceClient;
  constructor(
    @Inject(LER_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<LerServiceClient>('LerService');
  }

  async getCityTiers(
    payload: GetCityTiersRequest,
  ): Promise<GetCityTiersResponse> {
    return firstValueFrom(this.service.getCityTiers(payload), {
      defaultValue: null,
    });
  }

  async mapLogisticsServices(
    payload: MapLogisticsServicesRequest,
  ): Promise<MapLogisticsServicesResponse> {
    return firstValueFrom(this.service.mapLogisticsServices(payload), {
      defaultValue: null,
    });
  }

  async getLogisticServices(
    payload: GetLogisticServicesRequest,
  ): Promise<GetLogisticServicesResponse> {
    return firstValueFrom(this.service.getLogisticServices(payload), {
      defaultValue: null,
    });
  }
}
