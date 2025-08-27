import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { KafkaModule } from 'src/kafka/kafka.module';
import { Notification } from './entities/notification.entity';
import { NotificationConsumer } from './notification.consumer';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationWebEngegeConsumer } from './webEngege.consumer';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Notification] }),
    KafkaModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationConsumer,
    NotificationWebEngegeConsumer,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
