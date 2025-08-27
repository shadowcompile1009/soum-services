import { Injectable } from '@nestjs/common';
import { Ctx, RedisContext } from '@nestjs/microservices';
import { CategoryConditionService } from '@src/modules/category-condition/category-condition.service';
import { CategoryConditionForCSV } from '@src/modules/category-condition/dto/category-condition.dto';
import { UpdateCategoryConditionDto } from '@src/modules/category-condition/dto/update-category-condition.dto';
import { PriceQualityNames } from '@src/modules/category-condition/entities/category-condition';
import { ConditionService } from '@src/modules/condition/condition.service';
import { Condition } from '@src/modules/condition/entities/condition';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const redisUrl: string = process.env.REDIS_URL;
@Injectable()
export class BullMQService {
  static instance: BullMQService;
  private queues: Record<string, Queue>;
  private queuesWorker: Record<string, Worker>;
  private static conection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
  });

  constructor(
    private categoryConditionService: CategoryConditionService,
    private conditionService: ConditionService,
  ) {
    if (BullMQService.instance instanceof BullMQService) {
      return BullMQService.instance;
    }
    this.queues = {};
    this.queuesWorker = {};
    BullMQService.instance = this;
    this.instantiateQueues();
    this.instantiateWorkers();
    return this;
  }

  async instantiateQueues() {
    Object.keys(Queues).forEach((elem) => {
      const queue = new Queue(Queues[elem], {
        connection: BullMQService.conection,
      });
      this.queues[Queues[elem]] = queue;
    });
  }

  async instantiateWorkers() {
    Object.keys(Queues).forEach((elem: Queues) => {
      const queueName = Queues[elem];
      const worker = new Worker(
        queueName,
        async (job: any) => {
          this.handleJob(job?.data, queueName);
        },
        {
          connection: BullMQService.conection,
        },
      );
      worker.on('failed', (job: any, value) => {
        console.log(
          `[DEFAULT ${queueName}] Failed job with data\n
            Data: ${job.asJSON().data}\n
            ID: ${job.id}\n
            Value: ${value}
          `,
        );
      });
      this.queuesWorker[queueName] = worker;
    });
  }

  getQueue(name: Queues) {
    return this.queues[name];
  }

  addJob(data: JobData, options: JobOptions, queueName: Queues) {
    const queue = BullMQService.instance.getQueue(queueName || Queues.DEFAULT);
    return queue.add('jobs', { ...data }, options);
  }

  async handleJob(data: JobData, jobName: Queues) {
    try {
      if (Queues.CATEGORY_CONDITION_UPDATE === jobName) {
        const condition = await this.conditionService.getByName(
          (data as CategoryConditionJobData).conditionName,
          (data as CategoryConditionJobData).categoryId,
        );

        if (condition) {
          this.categoryConditionService.migrateCategoryConditionsUpsert(
            condition as Condition,
            data as CategoryConditionJobData,
          );
        } else {
          console.log(
            'condition was not found',
            (data as CategoryConditionJobData).conditionName,
            (data as CategoryConditionJobData).categoryId,
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export enum Queues {
  DEFAULT = 'default',
  CATEGORY_CONDITION_UPDATE = 'categoryConditionUpdate',
}

export class JobData {}
export class CategoryConditionJobData
  implements JobData, CategoryConditionForCSV
{
  categoryId: string;
  variantId: string;
  conditionName: string;
  priceNudgeMin: number;
  priceNudgeMax: number;
  priceExcellent: number;
  TTSExcellent: number;
  priceFair: number;
  TTSFair: number;
  priceFairExpensive: number;
  TTSFairExpensive: number;
  priceAbove: number;
  TTSAbove: number;
  priceExpensive: number;
  TTSExpensive: number;
  priceExpensiveUpper: number;
  TTSExpensiveUpper: number;
}

export class JobOptions {
  delay: number;
  removeOnComplete: boolean;
}
