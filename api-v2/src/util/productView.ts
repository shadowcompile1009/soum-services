import config from 'config';
import crypto from 'crypto';
import { Kafka, Producer, RecordMetadata } from 'kafkajs';
import { ProductViewDto } from '../dto/product/ProductViewDto';
import { _get } from './common';
const product: { [key: string]: string } = config.get('product');

export async function productView(
  action: string,
  productViewData: ProductViewDto
): Promise<[boolean, RecordMetadata[]]> {
  const prefix = config.has('product.prefix')
    ? _get(product, 'prefix', '')
    : '';
  const kafka = new Kafka({
    brokers: product.kafka_brokers.split(','),
  });
  const producer: Producer = kafka.producer();
  await producer.connect();
  try {
    const syncRes = await producer.send({
      topic: prefix + process.env.TOPIC_PRODUCT_VIEW,
      acks: 1,
      messages: [
        {
          key: crypto.randomUUID(),
          value: JSON.stringify({ action, productViewData: productViewData }),
        },
      ],
    });
    await producer.disconnect();

    return [false, syncRes];
  } catch (err) {
    console.log(err);
    await producer.disconnect();
    return [true, []];
  }
}
