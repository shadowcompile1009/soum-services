import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PromoCode,
  PromoCodeGenerationTask,
  PromoCodeGenerationTaskSchema,
  PromoCodeSchema,
} from '@modules/promo-code/schemas';
import { PromoCodeController } from '@modules/promo-code/promo-code.controller';
import { PromoCodeService } from '@modules/promo-code/promo-code.service';
import { V2Module } from '../v2/v2.module';
import { BullModule } from '@nestjs/bullmq';
import constants from '@src/constant';
import { PromoCodeGenerationTaskService } from './promo-code-generation-task.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromoCode.name, schema: PromoCodeSchema },
      {
        name: PromoCodeGenerationTask.name,
        schema: PromoCodeGenerationTaskSchema,
      },
    ]),
    V2Module,
    BullModule.registerQueue({
      name: constants.BULL_MQ_QUEUE_NAMES.PROMO_CODE_QUEUE,
    }),
  ],
  providers: [PromoCodeService, PromoCodeGenerationTaskService],
  exports: [PromoCodeService, PromoCodeGenerationTaskService],
  controllers: [PromoCodeController],
})
export class PromoCodeModule {}
