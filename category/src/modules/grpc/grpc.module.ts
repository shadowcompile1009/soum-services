import { Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller';
import { CategoryModule } from '../category/category.module';
import { CategoryConditionModule } from '../category-condition/category-condition.module';
import { ConditionModule } from '../condition/condition.module';
import { AttributeModule } from '../attribute/attribute.module';

@Module({
  controllers: [GrpcController],
  imports: [
    CategoryModule,
    CategoryConditionModule,
    ConditionModule,
    AttributeModule,
  ],
})
export class GrpcModule {}
