import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OrdersService } from '@src/modules/orders/orders.service';

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
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
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

  public addJob(data: any, options: any, queueName: Queues = Queues.DM_ORDERS) {
    const queue = BullMQService.instance.getQueue(queueName);
    return queue.add('jobs', { ...data }, options);
  }

  async handleJob(data: any, jobName: Queues) {
    try {
      if (Queues.DM_ORDERS === jobName) {
        if (data?.retryCount < 4) {
          await this.ordersService.create(data?.id, data?.retryCount);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export enum Queues {
  DM_ORDERS = 'dmOrders',
}
