import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { ConsumerService } from './kafka/consumer.service';
import { ProducerService } from './kafka/producer.service';
import { ProductViewService } from './modules/product-views/product-views.service';
import { ProductViewDto } from './modules/product-views/dto/product-views.dto';
@Injectable()
export class ProductViewsConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly producerService: ProducerService,
    private readonly productViewService: ProductViewService,
    private configService: ConfigService,
  ) {}
  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: [
          this.configService.get('kafka.PREFIX') +
            this.configService.get('kafka.TOPIC_PRODUCT_VIEW'),
        ],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const _data: any = JSON.parse(message.value.toString());
          try {
            return await this.logProductView(_data?.productViewData);
          } catch (error) {
            console.log('topic err', error);
            await this.producerService.produce({
              topic: topic,
              acks: -1,
              messages: [
                {
                  key: uuidv4(),
                  value: _data,
                },
              ],
            });
          }
        },
      },
      this.configService.get('kafka.PRODUCT_GROUP_ID'),
    );
  }
  async logProductView(productViewReq: ProductViewDto) {
    const res = await this.productViewService.logProductView({
      userId: productViewReq.userId,
      productId: productViewReq.productId,
      grandTotal: productViewReq.grandTotal,
      viewedAt: productViewReq.viewedAt,
    } as ProductViewDto);
    return res;
  }
}
