import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@src/auth/auth.module';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { Bid, BidSchema } from './schemas/bid.schema';
import { StatusModule } from '../status/status.module';
import { PaymentModule } from '../payment/payment.module';
import { V2Module } from '../v2/v2.module';
import { BidSettingsModule } from '../bid-settings/bid-settings.module';
import { CategoryModule } from '../category/category.module';

@Module({
  providers: [BidService],
  controllers: [BidController],
  imports: [
    MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }]),
    AuthModule,
    StatusModule,
    PaymentModule,
    V2Module,
    CategoryModule,
    BidSettingsModule,
  ],
  exports: [BidService],
})
export class BidModule {}
