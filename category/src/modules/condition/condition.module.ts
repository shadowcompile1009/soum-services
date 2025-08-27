import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Condition } from './entities/condition';
import { ConditionController } from './condition.controller';
import { ConditionService } from './condition.service';
import { CategoryConditionModule } from '../category-condition/category-condition.module';
import { ConfigModule } from '@nestjs/config';
import { AmazonService } from './upload-image.aws';
import { AuthModule } from '@src/auth/auth.module';
import { V2Module } from '../v2/v2.module';
import awsConfig from '@src/config/aws.config';
import { CsvModule } from 'nest-csv-parser';
import { BullMQService } from '@src/utils/bullMQ.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [awsConfig],
    }),
    MikroOrmModule.forFeature({ entities: [Condition] }),
    CategoryConditionModule,
    V2Module,
    CsvModule,
  ],
  controllers: [ConditionController],
  providers: [ConditionService, AmazonService, BullMQService],
  exports: [ConditionService],
})
export class ConditionModule {}
