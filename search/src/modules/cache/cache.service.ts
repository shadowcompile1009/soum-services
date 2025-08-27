import { Injectable, OnModuleInit } from '@nestjs/common';
import { CacheInterface } from './interface/cache.interface';
import Redis from 'ioredis';
import { GetCachedDataRequest, PutCachedDataRequest } from './type/cache.type';

@Injectable()
export class CacheService implements OnModuleInit, CacheInterface {
  constructor(private readonly client: Redis) {}

  onModuleInit() {
    this.client.connect();
  }

  async getData<Schema>({
    keys,
  }: GetCachedDataRequest): Promise<Array<Schema | null>> {
    const results = await Promise.all(
      keys.map(
        (key) =>
          new Promise<string | null>((resolve, reject) => {
            this.client.get(key, (error, data) => {
              if (error) {
                return reject(error);
              }

              return resolve(data ?? null);
            });
          }),
      ),
    );

    return results.map((result) => {
      try {
        if (!result) {
          return null;
        }

        return JSON.parse(result) as Schema | null;
      } catch (_) {
        return null;
      }
    });
  }

  async putData<Schema>({
    data,
    key,
    expiration,
  }: PutCachedDataRequest<Schema>): Promise<void> {
    if (expiration) {
      await this.client.set(key, JSON.stringify(data), 'EX', expiration);

      return;
    }

    await this.client.set(key, JSON.stringify(data));
  }
}
