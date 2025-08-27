import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
export enum JobTypes {
  CONFIRMATION = 'confirmation',
  NOT_SHIPPED = 'not-shipped',
  NOT_PICKED = 'not-picked',
  CONFIRMED_AVAILABILITY = 'confirmed-availability',
  IN_TRANSIT = 'in-transit',
  SELLER_DELETION_NUDGE = 'seller_detection_nudge',
  SELLER_UNRESPONSIVE_NUDGE = 'deletion_nudge_unresponsiveness_deactivation',
  SEND_PRODUCT_APPROVED_MESSAGE = 'send_product_approved_message',
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const redisUrl: string = process.env.REDIS_URL;
@Injectable()
export class BullMQService {
  private queues: Record<string, Queue>;
  private defaultQueue: Queue;
  private static conection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
  });

  constructor() {
    this.queues = {};

    this.instantiateQueues();
  }

  async instantiateQueues() {
    this.defaultQueue = new Queue(Queues.DEFAULT, {
      connection: BullMQService.conection,
    });
    this.queues[Queues.DEFAULT] = this.defaultQueue;
  }
  getQueue(name: Queues) {
    return this.queues[name];
  }

  addJob(data: any, options: any) {
    const queue = new BullMQService().getQueue(Queues.DEFAULT);
    return queue.add('jobs', { ...data }, options);
  }
}

enum Queues {
  DEFAULT = 'default',
}
