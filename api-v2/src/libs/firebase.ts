import admin, { AppOptions } from 'firebase-admin';
import {
  BatchResponse,
  getMessaging,
  Message,
  MulticastMessage,
} from 'firebase-admin/messaging';
import { isEmpty, isString } from 'lodash';
import logger from '../util/logger';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../../config/soummobileapp-firebase-adminsdk.json');

const PushNotifier = (): admin.app.App => {
  const defaultAppConfig: AppOptions = {
    credential: admin.credential.cert(serviceAccount),
  };

  // Initialize app
  return admin.initializeApp(defaultAppConfig);
};

export interface PushNotificationMessageInput {
  fcmTokens?: string[];
  fcmToken?: string;
  title: string;
  body: string;
  screenPage: string;
}

export const sendMulticastToDevices = async (
  pushMessageInput: PushNotificationMessageInput,
  data?: { [key: string]: string }
): Promise<any> => {
  const message: MulticastMessage = composeMulticastMessage(
    pushMessageInput,
    data
  );
  // Send a message to the device corresponding to the provided
  // registration token.
  if (isEmpty(message)) {
    return Promise.resolve([
      true,
      {
        message: 'The data object must only contain string values',
        response: null,
      },
    ]);
  }
  return await getMessaging()
    .sendMulticast(message)
    .then(response => {
      // Response is a message ID string.
      logger.info('Successfully send push message');
      logger.info(response);
      return [false, { message: message, response: response }];
    })
    .catch(error => {
      logger.error(error);
      return [true, error];
    });
};

export const sendMessageInBatchToDevices = async (
  messages: Message[]
): Promise<BatchResponse> => {
  return getMessaging().sendAll(messages);
};

const validateData = (data: { [key: string]: string }): boolean => {
  let isValid = true;
  Object.values(data).forEach(item => {
    if (!isString(item)) isValid = false;
  });

  return isValid;
};

export const composeMessage = (
  pushMessageInput: PushNotificationMessageInput,
  data?: { [key: string]: string }
): Message => {
  if (validateData(data) && pushMessageInput.fcmToken) {
    const message: Message = {
      android: {
        priority: 'high',
        ttl: 360000,
        notification: {
          body: pushMessageInput.body,
          title: pushMessageInput.title,
        },
      },
      data: data,
      apns: {
        headers: {
          'apns-priority': '5',
        },
      },
      notification: {
        body: pushMessageInput.body,
        title: pushMessageInput.title,
      },
      token: pushMessageInput.fcmToken,
    };

    return message;
  }

  return null;
};

export const composeMulticastMessage = (
  pushMessageInput: PushNotificationMessageInput,
  data?: { [key: string]: string }
) => {
  if (validateData(data)) {
    const message: MulticastMessage = {
      android: {
        priority: 'high',
        ttl: 360000,
        data: data,
        notification: {
          body: pushMessageInput.body,
          title: pushMessageInput.title,
        },
      },
      data: data,
      apns: {
        headers: {
          'apns-priority': '5',
        },
      },
      notification: {
        body: pushMessageInput.body,
        title: pushMessageInput.title,
      },
      tokens: pushMessageInput.fcmTokens,
    };

    return message;
  }

  return null;
};

export default PushNotifier;
