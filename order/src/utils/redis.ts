import {
  createClient,
  createCluster,
  RedisClientType,
  RedisClusterType,
} from 'redis';
import crypto from 'crypto';
import stringify from 'fast-safe-stringify';
import { Logger } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
export class RedisClient {
  static redisInstance: any;

  static async getRedisInstance() {
    let isRedisConnected = false;
    try {
      await RedisClient.redisInstance.get('TestKey');
      isRedisConnected = true;
    } catch (error) {
      isRedisConnected = false;
    }
    if (RedisClient.redisInstance && isRedisConnected) {
      return RedisClient.redisInstance;
    }

    const redisUrl: string = process.env.REDIS_URL;

    if (process.env.REDIS_CLIENT !== 'cluster') {
      RedisClient.redisInstance = createClient({
        url: redisUrl,
      });

      RedisClient.redisInstance.on('error', (err: any) =>
        console.log('Redis Client Error', err),
      );
      await RedisClient.redisInstance.connect();
    } else {
      RedisClient.redisInstance = createCluster({
        rootNodes: [
          {
            url: redisUrl,
          },
        ],
      });

      RedisClient.redisInstance.on('error', (err: any) =>
        console.log('Redis Cluster Error', err),
      );
      await RedisClient.redisInstance.connect();
    }

    return RedisClient.redisInstance;
  }

  async createClient(): Promise<any> {}

  static async setCache(key: string, value: any, timeout = 60 * 60) {
    const redisInstance = await this.getRedisInstance();
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
  }

  static async getCache<T>(key: string): Promise<T | string> {
    const redisInstance = await this.getRedisInstance();

    const value = await redisInstance.get(key);
    try {
      return JSON.parse(value);
    } catch (ex) {
      return value as unknown as T;
    }
  }

  static async deleteCache(keys: string[]): Promise<number> {
    const redisInstance = await this.getRedisInstance();

    return redisInstance.del(keys);
  }

  static async unlinkKeyByPattern(key: string, pattern: string) {
    const redisInstance = await this.getRedisInstance();

    if (new RegExp(pattern).test(key)) {
      redisInstance.unlink(key);
    }
  }

  static async deleteWithPattern(pattern: string) {
    const redisInstance = await this.getRedisInstance();

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
          this.unlinkKeyByPattern(key, pattern);
        }
      }
    } else {
      for await (const key of redisInstance.scanIterator(iteratorParams)) {
        this.unlinkKeyByPattern(key, pattern);
      }
    }
  }

  static async flushAll() {
    const redisInstance = await this.getRedisInstance();

    if (process.env.REDIS_CLIENT === 'cluster') {
      const clusterNodes = (redisInstance as RedisClusterType).masters;
      for (const node of clusterNodes) {
        (node.client as RedisClientType).flushAll();
      }
    } else {
      await (redisInstance as RedisClientType).flushAll();
    }
  }

  static async createUniqueCacheKey(req: any) {
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
  }

  static async createKey(identifier: string, keys: string[]) {
    const _key = keys.join('_');
    const key = _key.replace(/[ ,.]/g, '_');
    const hashKey: string = crypto
      .createHash('sha256')
      .update(`${key}`)
      .digest('base64');
    return identifier + '_' + hashKey;
  }
}
