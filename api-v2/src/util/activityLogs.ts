import config from 'config';
import { Kafka, Producer } from 'kafkajs';
import { Constants } from '../constants/constant';
import { _get } from './common';
import axios from 'axios';
import logger from './logger';
const activityLogConfig: { [key: string]: string } = config.get('activitylog');
export interface EventLogRequest {
  eventType: string;
  userId: string;
  username?: string;
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
  orderId?: string;
  orderNumber?: string;
  currentStatus?: string;
  changedStatus?: string;
  transactionStatus?: string;
  isAddedUser?: boolean;
  isSignIn?: boolean;
}
export interface UserEventLogRequest {
  eventType: string;
  userId: string;
  value: string;
  module: string;
}
export async function getTemplateMsgToCreateEventLog(
  msgTemplateInput: EventLogTemplateRequest
): Promise<string> {
  let bodyHtml = '';
  switch (msgTemplateInput.eventType) {
    case Constants.activity_log_template.STATUS_CHANGE:
      bodyHtml =
        'Changed Order $$ORDER_ID$$ Status from $$CURRENT_STATUS$$ to $$CHANGED_STATUS$$';
      break;
    case Constants.activity_log_template.PAYOUT_SUBMITTED:
      bodyHtml =
        'Submitted Payout to Order $$ORDER_ID$$ - $$TRANSACTION_STATUS$$';
      break;
    case Constants.activity_log_template.REFUND_SUBMITTED:
      bodyHtml =
        'Submitted Refund to Order $$ORDER_ID$$ - $$TRANSACTION_STATUS$$';
      break;
    case Constants.activity_log_template.PRODUCT_RELISTING_SUBMITTED:
      bodyHtml = 'Submitted Product Relisting';
      break;
    case Constants.activity_log_template.REVERSAL_SUBMITTED:
      bodyHtml =
        'Submitted Reversal Refund to Order $$ORDER_ID$$ - $$TRANSACTION_STATUS$$';
      break;
    case Constants.activity_log_template.USER_MANAGEMENT:
      if (msgTemplateInput.isSignIn) {
        bodyHtml = 'Signed In';
      } else if (msgTemplateInput.isAddedUser) {
        bodyHtml = 'Added user $$USER_ID$$';
      } else {
        bodyHtml = 'Deleted user $$USER_ID$$';
      }
      break;
    case Constants.activity_log_template.SETTING_TOGGLE:
      bodyHtml = 'Toggled $$SETTING$$ $$VALUE_SETTING$$';
      break;
    default:
      break;
  }
  bodyHtml = bodyHtml.replace(
    Constants.variables.USER_ID,
    !msgTemplateInput.username ? '' : msgTemplateInput.username
  );
  bodyHtml = bodyHtml.replace(
    Constants.variables.ORDER_ID,
    !msgTemplateInput.orderNumber ? '' : msgTemplateInput.orderNumber
  );
  bodyHtml = bodyHtml.replace(
    Constants.variables.CURRENT_STATUS,
    !msgTemplateInput.currentStatus ? '' : msgTemplateInput.currentStatus
  );
  bodyHtml = bodyHtml.replace(
    Constants.variables.CHANGED_STATUS,
    !msgTemplateInput.changedStatus ? '' : msgTemplateInput.changedStatus
  );
  bodyHtml = bodyHtml.replace(
    Constants.variables.TRANSACTION_STATUS,
    !msgTemplateInput.transactionStatus
      ? ''
      : msgTemplateInput.transactionStatus
  );
  bodyHtml = bodyHtml.replace(
    Constants.variables.SETTING,
    !msgTemplateInput.setting ? '' : msgTemplateInput.setting
  );
  bodyHtml = bodyHtml.replace(
    Constants.variables.VALUE_SETTING,
    !msgTemplateInput.settingValue ? '' : msgTemplateInput.settingValue
  );
  return bodyHtml;
}

export async function createEventLog(
  eventLog: EventLogRequest | UserEventLogRequest
): Promise<void> {
  const prefix = config.has('activitylog.prefix')
    ? _get(activityLogConfig, 'prefix', '')
    : '';
  const kafka = new Kafka({
    brokers: activityLogConfig.kafka_brokers.split(','),
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

export async function getActivityLogByOrderNumber(
  orderNumber: string,
  token: string
): Promise<any> {
  return axios
    .get(`${process.env.ACTIVITY_LOG_BASE}/${orderNumber}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        token: token,
      },
    })
    .then(({ data }) => data.data)
    .catch(error => logger.error(error));
}
