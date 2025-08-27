import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';

export interface EventLogRequest {
  eventType: string;
  userId: string;
  username: string;
  orderId?: string;
  orderNumber?: string;
  value: string;
  module: string;
}
export interface EventLogTemplateRequest {
  eventType: string;
  userId?: string;
  username?: string;
  setting?: string;
  settingValue?: string;
  orderNumber?: string;
  walletId?: string;
}
export async function getTemplateMsgToCreateEventLog(
  msgTemplateInput: EventLogTemplateRequest,
): Promise<string> {
  let bodyHtml = '';
  switch (msgTemplateInput.eventType) {
    case 'sellerWalletPayout':
    case 'walletToggle':
    case 'sellerDepositList':
      bodyHtml = 'Toggled $$SETTING$$ $$VALUE_SETTING$$';
      break;
    case 'refundToWallet':
      bodyHtml = 'Refund to wallet - $$ORDER_ID$$';
      break;
    case 'releasedToWallet':
      bodyHtml = 'Released to wallet - $$ORDER_ID$$';
      break;
    case 'transferredWithdrawal':
      bodyHtml = 'Transferred Withdrawal for - $$WALLET_ID$$';
      break;
    default:
      break;
  }
  bodyHtml = bodyHtml.replace(
    '$$SETTING$$',
    !msgTemplateInput.setting ? '' : msgTemplateInput.setting,
  );
  bodyHtml = bodyHtml.replace(
    '$$VALUE_SETTING$$',
    !msgTemplateInput.settingValue ? '' : msgTemplateInput.settingValue,
  );
  bodyHtml = bodyHtml.replace(
    '$$ORDER_ID$$',
    !msgTemplateInput.orderNumber ? '' : msgTemplateInput.orderNumber,
  );
  bodyHtml = bodyHtml.replace(
    '$$WALLET_ID$$',
    !msgTemplateInput.walletId ? '' : msgTemplateInput.walletId,
  );
  return bodyHtml;
}
export async function createEventLog(eventLog: EventLogRequest): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const prefix = configService.get('activitylog.prefix');
  const kafka = new Kafka({
    brokers: configService.get('activitylog.kafka_brokers').split(','),
  });
  const producer: Producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: prefix + 'create-activity-log',
    acks: 1,
    messages: [
      {
        key: eventLog.userId.toString(),
        value: JSON.stringify(eventLog),
      },
    ],
  });
  await producer.disconnect();
}
