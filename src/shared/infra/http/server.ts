/* eslint-disable no-case-declarations */
import 'reflect-metadata';
import 'express-async-errors';
import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';

import helmet from 'helmet';
import { errors } from 'celebrate';
import logger from '@config/logger';

import createConnection from '@shared/infra/typeorm';
import express, { Request, Response, NextFunction } from 'express';

import { appPort } from '@config/runMode';
import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';
import '@shared/container';
import { serverListen } from './controller/ServerController';

require('events').EventEmitter.defaultMaxListeners = 12;

createConnection();

const app = express();

app.use(cors());
app.use(express.json());

app.use(helmet());
app.disable('x-powered-by');

app.use(
  morgan(
    ':method :url :remote-addr - :remote-user :status :res[content-length] B :response-time ms',
    { stream: logger.stream },
  ),
);

app.use(compression());
app.use(rateLimiter);

app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  logger.warn(`***ERROR***${err.name}: ${err.message}`);

  return response.status(500).json({
    status: 'error',
    message: `Internal server error! ${err.name}: ${err.message} `,
  });
});

app.listen(appPort(), () => {
  serverListen();
});
