import stringify from 'fast-safe-stringify';
import winston, { format, transports } from 'winston';

const customFormat = format.printf(
  ({ level, message, label, timestamp, stack }) => {
    return `${timestamp} [${label}] ${level}: ${
      message ? stringify(message) : ''
    } - ${stack ? stringify(stack) : ''}`;
  }
);
const consoleFormat =
  process.env.NODE_ENV === 'production'
    ? format.combine(
        format.label({ label: 'SOUM-PROD' }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        customFormat
      )
    : format.combine(
        format.label({ label: 'SOUM-DEV' }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.colorize(),
        customFormat
      );

const options: winston.LoggerOptions = {
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    customFormat,
    format.json()
  ),
  defaultMeta: { service: 'soum-api-v2' },
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
      format: consoleFormat,
      handleExceptions: true,
    }),
    new transports.File({
      filename: './logs/error-log.log',
      level: 'error',
      handleExceptions: true,
      maxsize: 5242880,
      maxFiles: 10,
    }),
    new transports.File({
      filename: './logs/combined-log.log',
      handleExceptions: true,
      maxsize: 5242880,
      maxFiles: 10,
    }),
  ],
  exitOnError: false,
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export default logger;
