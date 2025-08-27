import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.service';
import { ProductProducerService } from './product.producer';

@Module({
  providers: [ProducerService, ConsumerService, ProductProducerService],
  exports: [ProducerService, ConsumerService, ProductProducerService],
})
export class KafkaModule {}
