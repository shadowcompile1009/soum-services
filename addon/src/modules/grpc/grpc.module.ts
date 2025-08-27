import { Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller';
import { AddonModule } from '../addon/addon.module';

@Module({
  controllers: [GrpcController],
  imports: [AddonModule],
})
export class GrpcModule {}
