import { Injectable } from '@nestjs/common';
import { TorodKafkaMessage, TorodWebHookDto } from './dto/torod-web-hook.dto';
import { TorodProducerService } from 'src/kafka/product.producer';

@Injectable()
export class TorodService {
  constructor(private readonly torodProducerService: TorodProducerService) {}
  handelTorod(reqData: TorodWebHookDto) {
    this.torodProducerService.produce({
      orderId: reqData.order_id,
      trackingId: reqData.tracking_id,
      status: reqData.status,
      description: reqData.description,
      torodDescription: reqData.torod_description,
      torodDescriptionAr: reqData.torod_description_ar,
      dateTime: reqData.date_time,
    } as TorodKafkaMessage);
  }
}
