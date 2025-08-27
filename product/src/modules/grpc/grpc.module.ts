import { Module } from '@nestjs/common';
import { ProductViewModule } from '../product-views/product-views.module';
import { V2Module } from '../v2/v2.module';
import { GrpcController } from './grpc.controller';
import { ProductModule } from '../product/product.module';
import { ConsignmentModule } from '../consignment/consignment.module';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [GrpcController],
  imports: [ProductViewModule, V2Module, ProductModule, ConsignmentModule, EmailModule],
})
export class GrpcModule {}
