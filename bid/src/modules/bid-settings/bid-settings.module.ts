import { Module } from '@nestjs/common';
import { BidSettingsService } from './bid-settings.service';
import { BidSettingsController } from './bid-settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BidSettings, BidSettingsSchema } from './schemas/bid-settings.schema';
import { AuthModule } from '@src/auth/auth.module';
import bidSettingsConfig from '@src/config/bidSettings.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [BidSettingsService],
  controllers: [BidSettingsController],
  imports: [
    ConfigModule.forRoot({
      load: [bidSettingsConfig],
    }),
    MongooseModule.forFeature([
      { name: BidSettings.name, schema: BidSettingsSchema },
    ]),
    AuthModule,
  ],
  exports: [BidSettingsService],
})
export class BidSettingsModule {}
