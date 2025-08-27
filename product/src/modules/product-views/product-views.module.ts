import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AuthModule } from '@src/auth/auth.module';
import { VaultInstance } from '@src/utils/vault.util';
import { redisStore } from 'cache-manager-redis-yet';
import { V2Module } from '../v2/v2.module';
import { ProductView } from './entities/product-views.entity';
import { ProductViewsController } from './product-views.controller';
import { ProductViewService } from './product-views.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [ProductView] }),
    AuthModule,
    V2Module,
    HttpModule,
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_URL,
    }),
  ],
  controllers: [ProductViewsController],
  providers: [ProductViewService, VaultInstance],
  exports: [ProductViewService],
})
export class ProductViewModule {}
