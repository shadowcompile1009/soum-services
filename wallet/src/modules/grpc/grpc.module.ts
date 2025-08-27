import { Module } from '@nestjs/common';

import { WalletModule } from '../wallet/wallet.module';
import { TransactionsModule } from '../transaction/transaction.module';
import { WalletSettingsModule } from '../wallet-settings/wallet-settings.module';

import { GRPCController } from './grpc.controller';

@Module({
  controllers: [GRPCController],
  imports: [WalletModule, TransactionsModule, WalletSettingsModule],
})
export class GrpcModule {}
