import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import notificationLogConfig from '@src/config/notification.config';
import { NotificationService } from '@src/modules/notification/notification.service';
import { NotificationController } from './notification.controller';

@Module({
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
  imports: [
    ConfigModule.forRoot({
      load: [notificationLogConfig],
    })
  ],
})
export class NotificationModule {}
