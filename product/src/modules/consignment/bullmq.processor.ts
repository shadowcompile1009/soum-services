import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ConsignmentJob } from './enum';
import { ConsignmentService } from './consignment.service';

@Processor(process.env.CONSIGNMENT_QUEUE_NAME)
export class BullMqProcessor extends WorkerHost {
  constructor(private readonly service: ConsignmentService) {
    super();
  }

  async process(job: Job<any>) {
    const data = job.data;
    if (job.name === ConsignmentJob.ADJUST_CONSIGNMENT_SELL_PRICE) {
      await this.service.processAdjustConsignmentSellPriceBullMqJob(
        data.id,
        data.productId,
      );
    }
  }
}
