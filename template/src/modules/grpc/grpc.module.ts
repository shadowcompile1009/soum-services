import { Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller';
import { AppleModule } from '../apple/apple.module';

@Module({
  controllers: [GrpcController],
  imports: [AppleModule], // Import modules here
})
export class GrpcModule {}
