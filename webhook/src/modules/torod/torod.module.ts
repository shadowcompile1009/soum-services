import { Module } from '@nestjs/common';
import { TorodController } from './torod.controller';
import { TorodService } from './torod.service';
import { ConfigModule } from '@nestjs/config';
import kafkaConfig from '../../config/kafka.config';
import { TorodProducerService } from 'src/kafka/product.producer';

@Module({
  controllers: [TorodController],
  providers: [TorodService, TorodProducerService],

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [kafkaConfig],
    }),
  ],
})
export class TorodModule {}
