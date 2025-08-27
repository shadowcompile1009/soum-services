/* eslint-disable @typescript-eslint/no-unused-vars */
import * as crypto from 'crypto';
import stringify from 'fast-safe-stringify';
import { Logger } from '@nestjs/common';
import {
  createClient,
  createCluster,
  RedisClientType,
  RedisClusterType,
} from 'redis';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const redisUrl: string = process.env.REDIS_URL;
let redisInstance: any;
(async (): Promise<any> => {
  if (process.env.REDIS_CLIENT !== 'cluster') {
    redisInstance = createClient({
      url: redisUrl,
    });

    redisInstance.on('error', (err: any) =>
      console.log('Redis Client Error', err),
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
      console.log('Redis Cluster Error', err),
    );
    await redisInstance.connect();
  }

  return redisInstance;
})();

const setCache = async (key: string, value: any, timeout = 60 * 60) => {
  if (typeof value === 'object') {
    value = stringify(value);
  }

  await redisInstance.set(key, value, (err: any, reply: any) => {
    if (err) {
      Logger.error(err);
    }
    Logger.log(reply);
  });

  return redisInstance.expire(key, timeout);
};

const getCache = async <T>(key: string): Promise<T | string> => {
  const value = await redisInstance.get(key);
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
  const iteratorParams = {
    MATCH: pattern,
    COUNT: 300,
  };
  if (process.env.REDIS_CLIENT === 'cluster') {
    const clusterNodes = (redisInstance as RedisClusterType).masters;
    for (const node of clusterNodes) {
      for await (const key of (node.client as RedisClientType).scanIterator(
        iteratorParams,
      )) {
        unlinkKeyByPattern(key, pattern);
      }
    }
  } else {
    for await (const key of redisInstance.scanIterator(iteratorParams)) {
      unlinkKeyByPattern(key, pattern);
    }
  }
};

const flushAll = async () => {
  if (process.env.REDIS_CLIENT === 'cluster') {
    const clusterNodes = (redisInstance as RedisClusterType).masters;
    for (const node of clusterNodes) {
      (node.client as RedisClientType).flushAll();
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
  setCache,
  getCache,
  deleteCache,
  deleteWithPattern,
  flushAll,
  createUniqueCacheKey,
  createKey,
};
