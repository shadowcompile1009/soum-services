const Redis = require('ioredis');
const { Queue } = require('bullmq');
class BullMQService {
  defaultQueue;
  queues;
  static instance;
  static conection = new Redis(process.env.REDIS_URL);

  constructor() {
    if (BullMQService.instance instanceof BullMQService) {
      return BullMQService.instance;
    }

    this.queues = {};
    BullMQService.instance = this;

    this.instantiateQueues();
  }

  async instantiateQueues() {
    this.queues['dmOrders'] = new Queue('dmOrders', {
      connection: BullMQService.conection,
    });

    this.queues['default'] = new Queue('default', {
      connection: BullMQService.conection,
    });
  }

  getQueue(name) {
    return this.queues[name];
  }
}

async function createDMOrderJob(
  orderId,
  service,
) {
  const queue = new BullMQService().getQueue('dmOrders');
  return queue.add('dmOrderJobs', { id: orderId, type: 'createDmOrder', retryCount : 0, service }, {delay: 20000});
}

async function validatePromoCodeUsage(
  orderId,
  service,
) {
  console.log("enqueued");
  const queue = new BullMQService().getQueue('default');
  return queue.add('default', { id: orderId, type: 'validatePromoCodeUsage', retryCount : 0, service }, {delay: 45*60*1000});
}

module.exports = {
  createDMOrderJob,
  validatePromoCodeUsage,
};
