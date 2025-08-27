import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { V2Module } from '../v2/v2.module';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [V2Module],
})
export class OrderModule {}
