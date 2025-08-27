import { Module } from '@nestjs/common';
import { BullMqProcessor } from './bullmq.service';
import { PromoCodeModule } from '@modules/promo-code/promo-code.module';

@Module({
  imports: [PromoCodeModule],
  providers: [BullMqProcessor],
})
export class BullMqModule {}
