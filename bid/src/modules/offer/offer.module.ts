import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@src/auth/auth.module';
import { V2Module } from '../v2/v2.module';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { Offer, OfferSchema } from './schema/offer.schema';

@Module({
  providers: [OfferService],
  controllers: [OfferController],
  imports: [
    MongooseModule.forFeature([{ name: Offer.name, schema: OfferSchema }]),
    AuthModule,
    V2Module,
  ],
  exports: [OfferService],
})
export class OfferModule {}
