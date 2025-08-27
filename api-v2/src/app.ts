/* eslint-disable @typescript-eslint/no-var-requires */

import bluebird from 'bluebird';
import compression from 'compression'; // compresses requests
import MongoStore from 'connect-mongo';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import flash from 'express-flash';
import mongoSanitize from 'express-mongo-sanitize';
import session from 'express-session';
import fs from 'fs';
import lusca from 'lusca';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import process from 'process';
import 'reflect-metadata';
import requestIp from 'request-ip';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { Constants } from './constants/constant';
import PushNotifier from './libs/firebase';
import { vaultConnection } from './libs/vault';
import { responseWrapper } from './middleware/responseWrapper';
import { routes } from './routes/v1/api';
import logger from './util/logger';
import { MONGODB_URI, SESSION_SECRET } from './util/secrets';

// const listRoutes = require('express-list-routes');

// Allow override of environment variables
dotenv.config();
process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '../config');
// if (
//   process.env.ENVIRONMENT === 'production' ||
//   process.env.ENVIRONMENT === 'qa'
// ) {
//   require('newrelic');
// }
if (process.env.ENVIRONMENT === 'production') {
  require('newrelic');
}
// Create Express server
const app = express();
const mongoUrl = MONGODB_URI;

// eslint-disable-next-line max-len
global.BASE_URL = `${process.env.API_HOST ?? 'http://localhost'}${
  process.env.API_PORT ? ':' + process.env.API_PORT : ''
}`;
global.Locale = 'en';

const options: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RESTful API Specification',
      version: '1.0.0',
      description: 'RESTful API Library',
      termsOfService: 'http://soum.sa/terms/',
      contact: {
        name: 'API Support',
        url: 'http://soum.sa/support',
        email: 'support@soum.sa',
      },
    },

    servers: [
      {
        url: global.BASE_URL + Constants.ROUTE_PREFIX,
        description: 'SOUM RESTful API Documentation',
      },
    ],
  },
  apis: ['./src/swagger/*.yaml', './src/controllers/**/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(cors({ origin: '*' }));
app.use(requestIp.mw());

app.use(function (_req, res, next) {
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true as any);
  next();
});

app.use(mongoSanitize());

app.set('port', 4353);
app.use(compression());
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

if (process.env.ENVIRONMENT !== 'production') {
  app.use(
    Constants.ROUTE_PREFIX + 'swagger',
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec)
  );
}

app.use(responseWrapper);

app.use(morgan('dev'));
morgan.format(
  'custom',
  // eslint-disable-next-line max-len
  ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status - :res[content-length] - :response-time ms  ":referrer" ":user-agent"'
);

app.use(
  morgan('custom', {
    stream: fs.createWriteStream(
      path.join(__dirname, '../logs/access-request.log'),
      { flags: 'a' }
    ),
    skip: (_req: any, res: any) => {
      return res.statusCode >= 400;
    },
  })
);

app.use(
  morgan('custom', {
    stream: fs.createWriteStream(
      path.join(__dirname, '../logs/error-request.log'),
      { flags: 'a' }
    ),
    skip: (_req: any, res: any) => {
      return res.statusCode < 400;
    },
  })
);
try {
  const Ui = require('bull-ui/app')({
    redis: {
      url: process.env.REDIS_URL,
    },
  });
  Ui.listen(3000, function () {
    console.log('bull-ui started listening on port', this.address().port);
  });
} catch (err) {
  console.log(err);
}

app.get('/status', (req, res) => {
  res.statusCode = 200;
  res.json({ status: 'OK' });
});

routes(app);
app.use(function onError(_err: any, _req: any, res: any, _next: any) {
  res.statusCode = 500;
  res.end(res.sentry + '\n');
});

PushNotifier();
//Vault
vaultConnection();

mongoose.Promise = bluebird;

const connectDB = () =>
  mongoose
    .connect(mongoUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: false,
      useFindAndModify: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000,
    })
    .catch(err => {
      setInterval(() => {
        connectDB();
      }, 5000);
      logger.error(
        `🚨 MongoDB connection error. Please make sure MongoDB is running. ${err}`
      );
    });
connectDB();

mongoose.connection.on('error', err => {
  console.log('🚨 Connection Error: ', err);
});

mongoose.connection.on('connected', () => {
  console.log(`🌈 Connected to the database URI ${mongoUrl}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('🚧 Try to re-connect every 5 sec');
  setInterval(() => {
    connectDB();
  }, 5000);
});

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      mongoUrl,
      mongoOptions: {
        autoReconnect: true,
        connectTimeoutMS: 5000,
      },
    }),
  })
);
export default app;
