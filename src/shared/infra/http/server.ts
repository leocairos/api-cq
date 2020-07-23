import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import helmet from 'helmet';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import routes from './routes';
import rateLimiter from './middlewares/rateLimiter';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());

app.use(helmet());
app.disable('x-powered-by');

// app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use('/files-default', express.static(uploadConfig.defaultAssetsFolder));

app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  console.error(
    '\n******************************************************************\n',
    'ERROR:',
    err.name,
    err.message,
    '\n******************************************************************\n',
    err,
  );

  return response.status(500).json({
    status: 'error',
    message: `Internal server error! ${err.name}: ${err.message} `,
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log('API Server started on port', process.env.APP_PORT);
});
