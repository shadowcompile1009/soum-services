import { Module } from '@nestjs/common';
import { PenaltySettingsController } from './penalty-settings.controller';
import { PenaltySettingsService } from './penalty-settings.service';
import { ConfigModule } from '@nestjs/config';
import penaltySettingsConfig from '@src/config/penaltySettings.config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PenaltySettings,
  PenaltySettingsSchema,
} from './schemas/penalty-settings.schema';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  controllers: [PenaltySettingsController],
  providers: [PenaltySettingsService],
  imports: [
    ConfigModule.forRoot({
      load: [penaltySettingsConfig],
    }),
    MongooseModule.forFeature([
      { name: PenaltySettings.name, schema: PenaltySettingsSchema },
    ]),
    AuthModule,
  ],
  exports: [PenaltySettingsService],
})
export class PenaltySettingsModule {}
