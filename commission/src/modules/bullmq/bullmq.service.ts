import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import constants from '@src/constant';
import { PromoCodeGenerationTaskService } from '@modules/promo-code/promo-code-generation-task.service';

@Processor(constants.BULL_MQ_QUEUE_NAMES.PROMO_CODE_QUEUE)
export class BullMqProcessor extends WorkerHost {
  constructor(private readonly service: PromoCodeGenerationTaskService) {
    super();
  }
  async process(job: Job<any>) {
    if (job.name === constants.BULL_MQ_TASK_NAMES.BULK_GENERATE_PROMO_CODES) {
      await this.service.handleBulkPromoCreation(job.data);
    }
  }
}
