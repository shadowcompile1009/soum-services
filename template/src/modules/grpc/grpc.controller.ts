import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppleService } from '../apple/apple.service';
import { APPLE_SERVICE_NAME, GetApplesResponse } from './proto/apple.pb';

@Controller('grpc')
export class GrpcController {
  constructor(private readonly appleService: AppleService) {}

  @GrpcMethod(APPLE_SERVICE_NAME, 'GetApples')
  async GetApples(): Promise<GetApplesResponse> {
    const result = await this.appleService.findAll({
      offset: 0,
      limit: 100,
      search: '',
    });
    return { apples: result.items };
  }
}
