// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import commissionActivityLog from './config/activitylogs.config';
import databaseConfig from './config/database.config';
import { CommissionModule } from './modules/commission/commission.module';

import { PromoCodeModule } from '@modules/promo-code/promo-code.module';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { BullMqModule } from './modules/bullmq/bullmq.module';
import { GrpcModule } from './modules/grpc/grpc.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ProductCommissionModule } from './modules/product-commission/product-commission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, commissionActivityLog],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.URI'),
      }),
    }),
    CommissionModule,
    ProductCommissionModule,
    GrpcModule,
    PaymentModule,
    PromoCodeModule,
    BullModule.forRoot({
      connection: { url: process.env.REDIS_URL },
    }),
    BullMqModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
