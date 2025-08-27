/* eslint-disable @typescript-eslint/no-unused-vars */
import BeeQueue from 'bee-queue';
import crypto from 'crypto';
import dotenv from 'dotenv';
import stringify from 'fast-safe-stringify';
import {
  createClient,
  createCluster,
  RedisClientType,
  RedisClusterType,
} from 'redis';
import { Constants } from '../constants/constant';
import logger from '../util/logger';

dotenv.config();

const redisUrl: string = process.env.REDIS_URL;

const matches = [
  ...redisUrl.matchAll(Constants.BEE_QUEUE.REGEX_REDIS_HOST_URL),
];

let redisInstance: any;
(async (): Promise<any> => {
  if (process.env.REDIS_CLIENT !== 'cluster') {
    redisInstance = createClient({
      url: redisUrl,
    });

    redisInstance.on('error', (err: any) =>
      console.log('Redis Client Error', err)
    );
    await redisInstance.connect();
  } else {
    redisInstance = createCluster({
      rootNodes: [
        {
          url: redisUrl,
        },
      ],
    });

    redisInstance.on('error', (err: any) =>
      console.log('Redis Cluster Error', err)
    );
    await redisInstance.connect();
  }
  return redisInstance;
})();
interface IQueueFunc {
  (job: BeeQueue.Job<any>): Promise<any>;
}

/**
 * Create a queue for long running jobs.
 * @param queueName Name of the queue
 * @param processFn The function used to proceed job added to queue
 * @returns BeeQueue instance.
 */
const addQueue = (queueName: string, processFn: IQueueFunc): BeeQueue => {
  const newQueue = new BeeQueue(queueName, {
    prefix: 'bq',
    stallInterval: 5000,
    nearTermWindow: 1200000,
    delayedDebounce: 1000,
    redis: {
      host: matches[0][1] ? matches[0][1] : 'localhost',
      port: matches[0][2] ? matches[0][2] : 6379,
      db: 0,
      options: {},
    },
    isWorker: true,
    getEvents: true,
    sendEvents: true,
    storeJobs: true,
    ensureScripts: true,
    activateDelayedJobs: false,
    removeOnSuccess: false,
    removeOnFailure: false,
    redisScanCount: 100,
  });

  newQueue.process(processFn);

  return newQueue;
};

const setCache = async (key: string, value: any, timeout = 60 * 60) => {
  if (typeof value === 'object') {
    value = stringify(value);
  }

  await redisInstance.set(key, value, (err: any, reply: any) => {
    if (err) {
      logger.error(err);
    }
    logger.info(reply);
  });

  return redisInstance.expire(`api-v2:${key}`, timeout);
};

const getCache = async <T>(key: string): Promise<T | string> => {
  let value = await redisInstance.get(`api-v2:${key}`);
  if (!value) {
    value = await redisInstance.get(key);
  }
  try {
    return JSON.parse(value);
  } catch (ex) {
    return value as unknown as T;
  }
};

const deleteCache = async (keys: string[]): Promise<number> => {
  return redisInstance.del(keys);
};

const unlinkKeyByPattern = (key: string, pattern: string) => {
  if (new RegExp(pattern).test(key)) {
    redisInstance.unlink(key);
  }
};

const deleteWithPattern = async (pattern: string) => {
  try {
    const iteratorParams = {
      MATCH: pattern,
      COUNT: 300,
    };
    if (process.env.REDIS_CLIENT === 'cluster') {
      const clusterNodes = (redisInstance as RedisClusterType).getMasters();
      for (const node of clusterNodes) {
        for await (const key of node.client.scanIterator(iteratorParams)) {
          unlinkKeyByPattern(key, pattern);
        }
      }
    } else {
      for await (const key of redisInstance.scanIterator(iteratorParams)) {
        unlinkKeyByPattern(key, pattern);
      }
    }
  } catch (error) {
    console.log(`deleteWithPattern: ${error}`);
  }
};

const flushAll = async () => {
  if (process.env.REDIS_CLIENT === 'cluster') {
    const clusterNodes = (redisInstance as RedisClusterType).getMasters();
    for (const node of clusterNodes) {
      node.client.flushAll();
    }
  } else {
    await (redisInstance as RedisClientType).flushAll();
  }
};

const createUniqueCacheKey = (req: any): string => {
  let paramsString = '';
  let queryString = '';
  Object.keys(req.params).forEach(function (key) {
    paramsString = paramsString + req.params[key];
  });
  Object.keys(req.query).forEach(function (key) {
    queryString = queryString + req.query[key];
  });
  const hashKey: string = crypto
    .createHash('sha256')
    .update(`${paramsString} ${queryString}`)
    .digest('base64');

  return `${process.env.REDIS_ENV}_${req.baseUrl}_${hashKey}`;
};

const createKey = (identifier: string, keys: string[]): string => {
  const _key = keys.join('_');
  const key = _key.replace(/[ ,.]/g, '_');
  const hashKey: string = crypto
    .createHash('sha256')
    .update(`${key}`)
    .digest('base64');
  return identifier + '_' + hashKey;
};

export {
  addQueue,
  createKey,
  createUniqueCacheKey,
  deleteCache,
  deleteWithPattern,
  flushAll,
  getCache,
  setCache,
};
