import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from '@src/config/database.config';
import { V2Module } from '@src/modules/v2/v2.module';
import { GrpcModule } from './modules/grpc/grpc.module';
import { PenaltySettingsModule } from './modules/penalty-settings/penalty-settings.module';
import { PenaltyModule } from './modules/penalty/penalty.module';
import { CancellationFeeSettingsModule } from './modules/cancellation-fee-settings/cancellation-fee-settings.module';
import { AppController } from './app.controller';
import { OrdersModule } from './modules/orders/orders.module';
import { StatusesModule } from './modules/statuses/statuses.module';
import { CommissionModule } from './modules/commission/commission.module';
import { CategoryModule } from './modules/category/category.module';
import { BullMqModule } from './modules/bull-mq/bull-mq.module';

// Allow override of environment variables
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.URI'),
      }),
    }),
    OrdersModule,
    StatusesModule,
    PenaltySettingsModule,
    PenaltyModule,
    CancellationFeeSettingsModule,
    V2Module,
    CommissionModule,
    CategoryModule,
    GrpcModule,
    BullMqModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
