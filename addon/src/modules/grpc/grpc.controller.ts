import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AddonService } from '../addon/addon.service';
import {
  ADDON_SERVICE_NAME,
  GetAddonsRequest,
  GetAddonsResponse,
} from './proto/addon.pb';
import { AddonFilter } from '../addon/schemas/addon.schema';

@Controller('grpc')
export class GrpcController {
  constructor(private readonly addonService: AddonService) {}

  @GrpcMethod(ADDON_SERVICE_NAME, 'GetAddons')
  async GetAddons(payload: GetAddonsRequest): Promise<GetAddonsResponse> {
    const addonFilter: AddonFilter = {
      modelId: payload.modelId,
      addonIds: payload.addonIds,
      price: payload.price,
    };
    const result = await this.addonService.findAll(
      {
        offset: 0,
        limit: 100,
      },
      addonFilter,
    );
    return { addons: result?.items } as GetAddonsResponse;
  }
}
