import { Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller';
import { BidSettingsModule } from 'src/modules/bid-settings/bid-settings.module';
import { BidModule } from '../bid/bid.module';
import { OfferModule } from '../offer/offer.module';

@Module({
  controllers: [GrpcController],
  imports: [BidSettingsModule, BidModule, OfferModule],
})
export class GrpcModule {}
