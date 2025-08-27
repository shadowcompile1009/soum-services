import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { V2Module } from '@src/modules/v2/v2.module';
import { GrpcModule } from './modules/grpc/grpc.module';
import { dbService } from './config/database.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConditionModule } from './modules/condition/condition.module';
import { CategoryConditionModule } from './modules/category-condition/category-condition.module';
import kafka from './config/kafka.config';
import { CategoryModule } from './modules/category/category.module';
import { AttributeModule } from './modules/attribute/attribute.module';
import { OptionModule } from './modules/option/option.module';
import { AwsModule } from './modules/aws/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [kafka],
    }),
    MikroOrmModule.forRoot(dbService.getConfig()),
    V2Module,
    GrpcModule,
    CategoryModule,
    ConditionModule,
    CategoryConditionModule,
    AttributeModule,
    OptionModule,
    AwsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
