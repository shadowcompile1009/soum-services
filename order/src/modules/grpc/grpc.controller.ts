import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { APPLE_SERVICE_NAME, GetApplesResponse } from './proto/apple.pb';

@Controller('grpc')
export class GrpcController {
  constructor() {}
}
