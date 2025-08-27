import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';

@Controller('notification')
export class NotificationController {
  @Inject(NotificationService)
  private readonly notificationService: NotificationService;

  @Post()
  public create(@Body() body: CreateNotificationDto): Promise<Notification> {
    return this.notificationService.create(body);
  }

  @Get()
  public find(): Promise<Notification[]> {
    return this.notificationService.find();
  }
}
