import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheService } from './cache.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: Redis,
      useFactory: (configService: ConfigService) => {
        return new Redis(`${configService.get('redis.REDIS_URL')}/1`, {
          lazyConnect: true,
        });
      },
      inject: [ConfigService],
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
