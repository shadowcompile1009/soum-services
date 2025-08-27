import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WalletService } from '@modules/wallet/wallet.service';
import { WalletController } from '@modules/wallet/wallet.controller';
import { Wallet, WalletSchema } from '@modules/wallet/schemas/wallet.schema';
import { AuthModule } from '@src/auth/auth.module';
import { TransactionsModule } from '@modules/transaction/transaction.module';
import { WalletSettingsModule } from '@modules/wallet-settings/wallet-settings.module';
import { V2Module } from '@modules/v2/v2.module';

@Module({
  providers: [WalletService],
  controllers: [WalletController],
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    AuthModule,
    forwardRef(() => TransactionsModule),
    WalletSettingsModule,
    V2Module
  ],
  exports: [WalletService],
})
export class WalletModule {}
