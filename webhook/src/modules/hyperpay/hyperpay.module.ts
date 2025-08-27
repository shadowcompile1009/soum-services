import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HyperpayController } from './hyperpay.controller';
import { HyperpayService } from './hyperpay.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [HyperpayController],
  providers: [HyperpayService],
})
export class HyperpayModule {}
