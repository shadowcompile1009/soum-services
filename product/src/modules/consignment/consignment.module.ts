import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import awsConfig from '@src/config/aws.config';
import { SmsaService } from '@src/utils/couriers/SmsaService';
import { TorodService } from '@src/utils/couriers/TorodService';
import { redisStore } from 'cache-manager-redis-yet';
import { FreshChatService } from '../../utils/freshchat/freshchat.service';
import { CategoryModule } from '../category/category.module';
import { LerModule } from '../ler/ler.module';
import { PaymentModule } from '../payment/payment.module';
import { ProductModule } from '../product/product.module';
import { V2Module } from '../v2/v2.module';
import { AdmConsignmentController } from './adm.consignment.controller';
import { AppConsignmentController } from './app.consignment.controller';
import { ConsignmentService } from './consignment.service';
import { Consignment } from './entity/consignment.entity';
import { TradeInRecoService } from './utils/trade-in-reco.util';
import { BullModule } from '@nestjs/bullmq';
import { BullMqProcessor } from './bullmq.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
    }),
    MikroOrmModule.forFeature({
      entities: [Consignment],
    }),
    HttpModule,
    ProductModule,
    CategoryModule,
    V2Module,
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          url: process.env.REDIS_URL,
        });

        return {
          store: store as unknown as CacheStore,
          ttl: 60 * 60 * 1000,
        };
      },
    }),
    PaymentModule,
    LerModule,
    BullModule.registerQueue({
      name: process.env.CONSIGNMENT_QUEUE_NAME,
      prefix: 'bull:consignment',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
  ],
  providers: [
    ConsignmentService,
    TradeInRecoService,
    FreshChatService,
    TorodService,
    SmsaService,
    BullMqProcessor,
  ],
  controllers: [AppConsignmentController, AdmConsignmentController],
  exports: [ConsignmentService],
})
export class ConsignmentModule {}
