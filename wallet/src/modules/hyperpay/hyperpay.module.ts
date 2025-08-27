import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import hyperpayConfig from '@src/config/hyperpay.config';
import { HyperpayService } from '@modules/hyperpay/hyperpay.service';

@Module({
  providers: [HyperpayService],
  exports: [HyperpayService],
  imports: [
    ConfigModule.forRoot({
      load: [hyperpayConfig],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('hyperpay.httpTimeout'),
        baseURL: configService.get('hyperpay.splitUrl'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class HyperpayModule {}
