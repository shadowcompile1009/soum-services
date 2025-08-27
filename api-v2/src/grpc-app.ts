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
import { responseWrapper } from './middleware/responseWrapper';
import { routes } from './routes/v1/api';
import logger from './util/logger';
import { MONGODB_URI, SESSION_SECRET } from './util/secrets';
// const listRoutes = require('express-list-routes');

// Allow override of environment variables
dotenv.config();
process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '../config');
// Create Express server
const app = express();
const mongoUrl = MONGODB_URI;

// eslint-disable-next-line max-len
global.BASE_URL = `${process.env.API_HOST ?? 'http://localhost'}${
  process.env.API_PORT ? ':' + process.env.API_PORT : ''
}`;
global.Locale = 'en';
// Set up cors
app.use(cors({ origin: '*' }));

app.use(requestIp.mw());

// To remove data, use:
app.use(mongoSanitize());

// Express configuration
app.set('port', 4354);
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

//-------------------------------------------------------------------
// Set up middlewares
//------------------------------------------------------
app.use(responseWrapper);

// Morgan middleware
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

routes(app);
// Optional fallthrough error handler
app.use(function onError(_err: any, _req: any, res: any, _next: any) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + '\n');
});

// Connect to MongoDB
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
  console.log(`Connected to the ${mongoUrl}`);
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
