import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CancellationFeeSettingsController } from './cancellation-fee-settings.controller';
import { CancellationFeeSettingsService } from './cancellation-fee-settings.service';
import cancellationFeeSettingsConfig from '@src/config/cancellationFeeSettings.config';
import {
  CancellationFeeSettings,
  CancellationFeeSettingsSchema,
} from './schemas/cancellation-fee-settings.schema';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  controllers: [CancellationFeeSettingsController],
  providers: [CancellationFeeSettingsService],
  imports: [
    ConfigModule.forRoot({
      load: [cancellationFeeSettingsConfig],
    }),
    MongooseModule.forFeature([
      {
        name: CancellationFeeSettings.name,
        schema: CancellationFeeSettingsSchema,
      },
    ]),
    AuthModule,
  ],
  exports: [CancellationFeeSettingsService],
})
export class CancellationFeeSettingsModule {}
