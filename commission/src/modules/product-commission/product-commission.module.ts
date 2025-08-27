import { Module } from '@nestjs/common';
import { ProductCommissionService } from './product-commission.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Commission,
  CommissionSchema,
} from '../commission/schemas/commission.schema';
import { CommissionCalculationService } from './commission-calculation.service';
import {
  ProductCommission,
  ProductCommissionSchema,
} from './schemas/product-commission.schema';
import { ProductCommissionController } from './product-commission.controller';
import { PaymentModule } from '../payment/payment.module';
import { PCData, PCDataSchema } from './schemas/PC-Data.schema';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CommissionModule } from '../commission/commission.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MongooseModule.forFeature([
      { name: Commission.name, schema: CommissionSchema },
      { name: ProductCommission.name, schema: ProductCommissionSchema },
      { name: PCData.name, schema: PCDataSchema },
    ]),
    PaymentModule,
    HttpModule,
    CommissionModule,
  ],
  providers: [
    ProductCommissionService,
  ],
  exports: [ProductCommissionService],
  controllers: [ProductCommissionController],
})
export class ProductCommissionModule {}
