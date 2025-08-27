import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { WebEngage } from 'src/utils/webengage.util';
import { CreateNotificationDto } from './dto/notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  @InjectRepository(Notification)
  private readonly notificationRepository: EntityRepository<Notification>;

  public async create(body: CreateNotificationDto): Promise<Notification> {
    return new Promise(async (resolve, reject) => {
      try {
        const notification: Notification = new Notification(
          body.userId,
          body.eventType,
          body.platform,
          body.messageTitle,
          body.messageBody,
          body.isRead,
          body.service,
        );
        const weData = await WebEngage.sendWETransactionalCampaignMessage(
          body.userId,
        );
        notification.weTransactionId = weData?.response?.data?.txnId;
        notification.overrideData = body.overrideData;
        await this.notificationRepository.persistAndFlush(notification);
        resolve(notification);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async find(): Promise<Notification[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const newNotifications = await this.notificationRepository.findAll();
        resolve(newNotifications);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async sendEventData(data: {
    userId: string;
    eventName: string;
    eventTime: string;
    eventData: any;
  }) {
    return WebEngage.sendEventData(data);
  }
}
