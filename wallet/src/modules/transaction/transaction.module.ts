import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TransactionService } from '@modules/transaction/transaction.service';
import { TransactionController } from '@modules/transaction/transaction.controller';
import {
  Transaction,
  TransactionSchema,
} from '@modules/transaction/schemas/transaction.schema';
import { AuthModule } from '@src/auth/auth.module';
import { HyperpayModule } from '@modules/hyperpay/hyperpay.module';
import { WalletModule } from '@modules/wallet/wallet.module';
import { V2Module } from '@modules/v2/v2.module';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import redisConfig from '@src/config/redis.config';
import hyperpayConfig from '@src/config/hyperpay.config';
import { WalletSettingsModule } from '@modules/wallet-settings/wallet-settings.module';
import { AuthzModule } from '../authz/authz.module';

@Module({
  providers: [TransactionService],
  controllers: [TransactionController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig, hyperpayConfig],
    }),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    AuthModule,
    HyperpayModule,
    forwardRef(() => WalletModule),
    V2Module,
    AuthzModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: String(configService.get('redis.URL'))
            .split('redis://')
            .pop()
            .split(':')
            .shift(),
          port: String(configService.get('redis.URL'))
            .split('redis://')
            .pop()
            .split(':')
            .pop(),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'hyperpay-transactions',
    }),
    WalletSettingsModule,
  ],
  exports: [TransactionService],
})
export class TransactionsModule {}
