import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import Container, { Service } from 'typedi';
import { DMSecurityFeeService } from '../services/dmSecurityFeeService';
@Service()
export class BullMQService {
  public dmSecurityFeeService: DMSecurityFeeService;

  private queues: Record<string, Queue>;
  private defaultQueue: Queue;
  private dmOrdersQueue: Queue;
  private expireFeedsQueue: Queue;
  private defaultQueueWorker: Worker;
  private expireFeedsQueueWorker: Worker;
  private static instance: BullMQService;
  private static conection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
  });

  constructor() {
    this.dmSecurityFeeService = Container.get(DMSecurityFeeService);

    if (BullMQService.instance instanceof BullMQService) {
      return BullMQService.instance;
    }

    this.queues = {};
    BullMQService.instance = this;

    this.instantiateQueues();
    this.instantiateWorkers();
  }

  async instantiateQueues() {
    this.defaultQueue = new Queue(Queues.DEFAULT, {
      connection: BullMQService.conection,
    });
    this.dmOrdersQueue = new Queue(Queues.DM_ORDERS, {
      connection: BullMQService.conection,
    });
    this.expireFeedsQueue = new Queue(Queues.EXPIRE_OFFER_FEED, {
      connection: BullMQService.conection,
    });
    this.queues[Queues.DEFAULT] = this.defaultQueue;
    this.queues[Queues.DM_ORDERS] = this.dmOrdersQueue;
    this.queues[Queues.EXPIRE_OFFER_FEED] = this.expireFeedsQueue;
  }

  async instantiateWorkers() {
    this.defaultQueueWorker = new Worker(
      Queues.DEFAULT,
      async (job: any) => {
        await this.dmSecurityFeeService.handleBullJobs(
          job?.data?.id,
          job?.data?.type,
          job?.data?.sellerPhone,
          job?.data?.questions
        );
      },
      {
        connection: BullMQService.conection,
      }
    );

    this.expireFeedsQueueWorker = new Worker(
      Queues.EXPIRE_OFFER_FEED,
      async (job: any) => {
        await this.dmSecurityFeeService.handleBullJobs(
          job?.data?.id,
          job?.data?.type,
          job?.data?.sellerPhone,
          job?.data?.questions
        );
      },
      {
        connection: BullMQService.conection,
      }
    );
    this.defaultQueueWorker.on('failed', (job: any, value) => {
      console.log(
        `[DEFAULT QUEUE] Failed job with data\n
          Data: ${job.asJSON().data}\n
          ID: ${job?.id}\n
          Value: ${value}
        `
      );
    });
    this.expireFeedsQueueWorker.on('failed', (job: any, value) => {
      console.log(
        `[expireFeeds QUEUE] Failed job with data\n
          Data: ${job.asJSON().data}\n
          ID: ${job?.id}\n
          Value: ${value}
        `
      );
    });
  }

  getQueue(name: Queues) {
    return this.queues[name];
  }

  addJob(data: any, options: any, queueName: Queues = Queues.DEFAULT) {
    const queue = new BullMQService().getQueue(queueName);
    return queue.add('jobs', { ...data }, options);
  }

  createDMOrderJob(
    data: any,
    options: any,
    queueName: Queues = Queues.DM_ORDERS
  ) {
    const queue = new BullMQService().getQueue(queueName);
    return queue.add('jobs', { ...data }, options);
  }
}

export enum Queues {
  DEFAULT = 'default',
  DM_ORDERS = 'dmOrders',
  EXPIRE_OFFER_FEED = 'expireOfferFeed',
}
