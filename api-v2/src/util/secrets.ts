import dotenv from 'dotenv';
import fs from 'fs';
import logger from './logger';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
}

export const ENVIRONMENT = process.env.NODE_ENV;

export const SESSION_SECRET = process.env['SESSION_SECRET'];

const getDbConnection = () => {
  switch (ENVIRONMENT) {
    case 'test':
      return process.env['MONGODB_URI_TEST'];
    default:
      return process.env['MONGODB_URI'];
  }
};

export const MONGODB_URI = getDbConnection();

if (!SESSION_SECRET) {
  logger.error('No client secret. Set SESSION_SECRET environment variable.');
  process.exit(1);
}

if (!MONGODB_URI) {
  // eslint-disable-next-line max-len
  logger.error(
    'No mongo connection string. Set environment variable: MONGODB_URI for production, MONGODB_URI_LOCAL for dev'
  );
  process.exit(1);
}
