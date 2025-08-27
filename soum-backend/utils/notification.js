const { Kafka } = require('kafkajs');
async function createNotificationEvent({
  eventType,
  userId,
  service,
  messageTitle,
  messageBody,
  platform,
  isRead
}) {
  const prefix = ENV.PREFIX;
  const kafka = new Kafka({
    brokers: ENV.KAFKA_BROKERS.split(','),
  });
  console.log(prefix);
  console.log(ENV.KAFKA_BROKERS.split(','));
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: prefix + '-create-notification',
    acks: 1,
    messages: [
      {
        key: userId.toString(),
        value: JSON.stringify({
          eventType,
          userId,
          service,
          messageTitle,
          messageBody,
          platform,
          isRead
        }),
      },
    ],
  });
  await producer.disconnect();
}
module.exports = {
  createNotificationEvent
};
