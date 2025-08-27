import dotenv from 'dotenv';
import fs from 'fs';
import logger from './logger';
import axios from 'axios';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
}

export const smsDSNWebHook = async (response: any) => {
  const webEngageAPIKey =
    process.env.WEB_ENGAGE_API_KEY || 'f1352231-143c-4f09-8910-102e1698ba90';
  await axios
    .post('https://st.in.webengage.com/tracking/privatessp-events', response, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${webEngageAPIKey}`,
      },
    })
    .catch(error => logger.error(error));
};

export const sendEventData = async (
  userId: string,
  eventName: string,
  eventTime: string,
  eventData: any
) => {
  // Used for FB -> Delete when merge and release
  const webEngageBase =
    process.env.WEB_ENGAGE_BASE || 'https://api.in.webengage.com';
  const license_code = process.env.WEB_ENGAGE_LICENCE_CODE || 'in~76aa301';
  const webEngageAPIKey =
    process.env.WEB_ENGAGE_API_KEY || 'f1352231-143c-4f09-8910-102e1698ba90';
  await axios
    .post(
      `${webEngageBase}/v1/accounts/${license_code}/events`,
      {
        userId: userId,
        eventName: eventName,
        eventTime: eventTime.toString(),
        eventData: eventData,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${webEngageAPIKey}`,
        },
      }
    )
    .catch(error => logger.error(error));
};
