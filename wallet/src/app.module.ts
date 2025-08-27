import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppService } from '@src/app.service';
import { WalletModule } from '@modules/wallet/wallet.module';
import { HyperpayModule } from '@modules/hyperpay/hyperpay.module';
import { TransactionsModule } from '@modules/transaction/transaction.module';
import { WalletSettingsModule } from '@modules/wallet-settings/wallet-settings.module';
import databaseConfig from '@src/config/database.config';
import notificationConfig from '@src/config/notification.config';
import { GrpcModule } from '@modules/grpc/grpc.module';
import { V2Module } from '@modules/v2/v2.module';
import { HyperpayQueueConsumer } from '@modules/transaction/queue/hyperpay.queue.consumer';
import { BullModule } from '@nestjs/bull';
import { NotificationModule } from '@modules/notification/notification.module';
import activitylogsConfig from '@src/config/activitylogs.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, notificationConfig, activitylogsConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.URI'),
      }),
    }),
    WalletSettingsModule,
    TransactionsModule,
    NotificationModule,
    HyperpayModule,
    GrpcModule,
    WalletModule,
    V2Module,
    BullModule.registerQueue({
      name: 'hyperpay-transactions',
    }),
  ],
  providers: [AppService, HyperpayQueueConsumer],
})
export class AppModule {}
