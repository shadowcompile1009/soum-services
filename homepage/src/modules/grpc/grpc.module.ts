import { Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller';

@Module({
  controllers: [GrpcController],
  imports: [], // Import modules here
})
export class GrpcModule {}
