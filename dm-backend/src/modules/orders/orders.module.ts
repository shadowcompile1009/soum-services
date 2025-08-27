import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@src/auth/auth.module';
import { BullMqModule } from '../bull-mq/bull-mq.module';
import { CategoryModule } from '../category/category.module';
import { CommissionModule } from '../commission/commission.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { LerModule } from '../ler/ler.module';
import { PenaltyModule } from '../penalty/penalty.module';
import { StatusesModule } from '../statuses/statuses.module';
import { V2Module } from '../v2/v2.module';
import { WalletModule } from '../wallet/wallet.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    AuthModule,
    PenaltyModule,
    V2Module,
    CategoryModule,
    CommissionModule,
    LerModule,
    StatusesModule,
    WalletModule,
    InvoiceModule,
    ProductModule,
    forwardRef(() => BullMqModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
