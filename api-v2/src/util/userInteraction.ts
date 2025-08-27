import config from 'config';
import crypto from 'crypto';
import { Kafka, Producer, RecordMetadata } from 'kafkajs';
import { _get } from './common';

const gtmEvent: { [key: string]: string } = config.get('gtmEvent');
export async function createGTMEvent(data: {
  [key: string]: any;
}): Promise<[boolean, RecordMetadata[]]> {
  const prefix = config.has('gtmEvent.prefix')
    ? _get(gtmEvent, 'prefix', '')
    : '';
  const kafka = new Kafka({
    brokers: gtmEvent.kafka_brokers.split(','),
  });
  const producer: Producer = kafka.producer();
  await producer.connect();
  try {
    const syncRes = await producer.send({
      topic: prefix + process.env.KAFKA_TOPIC_TO_CREATE_GOOGLE_GTM_EVENT,
      acks: 1,
      messages: [
        {
          key: crypto.randomUUID(),
          value: JSON.stringify({ data }),
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
