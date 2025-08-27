import { forwardRef, Module } from '@nestjs/common';
import { BullMQService } from './bull-mq.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [forwardRef(() => OrdersModule)],
  providers: [BullMQService],
  exports: [BullMQService],
})
export class BullMqModule {}
