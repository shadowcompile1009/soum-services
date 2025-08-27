import config from 'config';
import crypto from 'crypto';
import { Kafka, Producer, RecordMetadata } from 'kafkajs';
import { OrderSyncDto } from '../dto/order/dmOrderSyncDto';
import { SyncDataDto } from '../dto/search/syncDataDto';
import { TypesenseSyncedOrder } from '../models/Order';
import { _get } from './common';
const search: { [key: string]: string } = config.get('search');

export async function syncUnsyncObjectReq(
  action: string,
  searchData: SyncDataDto[] | string[]
): Promise<[boolean, RecordMetadata[]]> {
  const prefix = config.has('search.prefix') ? _get(search, 'prefix', '') : '';
  const kafka = new Kafka({
    brokers: search.kafka_brokers.split(','),
  });
  const producer: Producer = kafka.producer();
  await producer.connect();
  try {
    const syncRes = await producer.send({
      topic: prefix + process.env.TOPIC_SYNC_PRODUCTS,
      acks: 1,
      messages: [
        {
          key: crypto.randomUUID(),
          value: JSON.stringify({ action, syncData: searchData }),
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

export async function syncOrderRequest(
  action: string,
  requestData: OrderSyncDto | TypesenseSyncedOrder[]
): Promise<[boolean, RecordMetadata[]]> {
  const prefix = config.has('search.prefix') ? _get(search, 'prefix', '') : '';
  const kafka = new Kafka({
    brokers: search.kafka_brokers.split(','),
  });
  const producer: Producer = kafka.producer();
  await producer.connect();
  try {
    const syncRes = await producer.send({
      topic: prefix + process.env.TOPIC_ORDER,
      acks: 1,
      messages: [
        {
          key: crypto.randomUUID(),
          value: JSON.stringify({ action, syncData: requestData }),
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
