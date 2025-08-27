import { Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [GrpcController],
  imports: [ProductsModule],
})
export class GrpcModule {}
