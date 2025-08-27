import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateNotificationRequest } from './modules/notification/dto/createNotificationRequest.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('notifications')
  createNotificationLog(
    @Body() createNotificationReq: CreateNotificationRequest,
  ) {
    return this.appService.createNotification(createNotificationReq);
  }

  @Get('/status')
  async getStatus() {
    return { statu: 'OK' };
  }
}
