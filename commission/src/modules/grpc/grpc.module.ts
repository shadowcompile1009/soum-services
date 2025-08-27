import { Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller';
import { ProductCommissionModule } from '../product-commission/product-commission.module';
import { PromoCodeModule } from '../promo-code/promo-code.module';

@Module({
  controllers: [GrpcController],
  imports: [ProductCommissionModule, PromoCodeModule],
})
export class GrpcModule {}
