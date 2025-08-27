import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rate, RateSchema } from './schemas/rate.schema';
import { ConfigModule } from '@nestjs/config';
import rateConfig from '@src/config/rate.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [rateConfig],
    }),
    MongooseModule.forFeature([{ name: Rate.name, schema: RateSchema }]),
  ],
  providers: [RateService],
  controllers: [RateController],
  exports: [RateService],
})
export class RateModule {}
