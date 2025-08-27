import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from '@src/config/database.config';
import { BidSettingsModule } from '@modules/bid-settings/bid-settings.module';
import { BidModule } from './modules/bid/bid.module';
import { StatusModule } from './modules/status/status.module';
import { GrpcModule } from './modules/grpc/grpc.module';
import { PaymentModule } from './modules/payment/payment.module';
import { V2Module } from './modules/v2/v2.module';
import { OfferController } from './modules/offer/offer.controller';
import { OfferService } from './modules/offer/offer.service';
import { OfferModule } from './modules/offer/offer.module';
import { Offer, OfferSchema } from './modules/offer/schema/offer.schema';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: Offer.name, schema: OfferSchema }]),
    BidSettingsModule,
    StatusModule,
    GrpcModule,
    PaymentModule,
    V2Module,
    BidModule,
    OfferModule,
    CategoryModule,
  ],
  controllers: [OfferController],
  providers: [OfferService],
})
export class AppModule {}
