import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { WalletSettingsController } from '@modules/wallet-settings/wallet-settings.controller';
import { WalletSettingsService } from '@modules/wallet-settings/wallet-settings.service';
import { AuthModule } from '@src/auth/auth.module';
import {
  WalletSettings,
  WalletSettingsSchema,
} from '@src/modules/wallet-settings/schemas/wallet-settings.schema';
import {
  WalletSettingsConfig,
  WalletSettingsConfigSchema,
} from '@src/modules/wallet-settings/schemas/wallet-settings-config.schema';
import walletSettingsConfig from '@src/config/walletSettings.config';
import { AuthzModule } from '../authz/authz.module';
import { V2Module } from '@modules/v2/v2.module';
@Module({
  controllers: [WalletSettingsController],
  providers: [WalletSettingsService],
  imports: [
    ConfigModule.forRoot({
      load: [walletSettingsConfig],
    }),
    MongooseModule.forFeature([
      { name: WalletSettings.name, schema: WalletSettingsSchema },
      { name: WalletSettingsConfig.name, schema: WalletSettingsConfigSchema },
    ]),
    AuthModule,
    AuthzModule,
    V2Module
  ],
  exports: [WalletSettingsService],
})
export class WalletSettingsModule {}
