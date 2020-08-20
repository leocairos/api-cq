import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import logger from '@config/logger';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import helmet from 'helmet';

import AppError from '@shared/errors/AppError';

import schedule from '@shared/services/schedule';
import SyncMyLIMS from '@shared/services/SyncMyLIMS';

import SamplesController from '@modules/samples/infra/controller/SamplesControllerSched';
// import updAuxiliaries from '@modules/samples/infra/controller/AuxiliariesController';
import apiMYLIMS from '@shared/services/apiMYLIMS';

import routes from './routes';
import rateLimiter from './middlewares/rateLimiter';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());

app.use(helmet());
app.disable('x-powered-by');

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
  logger.error(
    // console.error(
    `\n******************************************************************\n
    ERROR: ${err.name} ${err.message}
    \n******************************************************************\n
    ${err}`,
  );

  return response.status(500).json({
    status: 'error',
    message: `Internal server error! ${err.name}: ${err.message} `,
  });
});

const importAll = async (): Promise<void> => {
  const samples = await apiMYLIMS.get('/samples?$inlinecount=allpages&$top=5');
  const totalCount = samples.data.TotalCount as number;
  const samplesController = new SamplesController();

  // await updAuxiliaries();
  // const skip = 0;
  const top = Number(process.env.COUNT_SINC_AT_TIME);
  const skipEnv = process.env.INTERVAL_SINC_MYLIMS_SKIP || 0;
  let skip = skipEnv as number;
  const filter = '';
  while (skip < totalCount) {
    // eslint-disable-next-line no-await-in-loop
    await samplesController.list(skip, top, filter);
    skip += top;
    // console.log('\n\nSkip ', skip, '\n\n');
    logger.info(`Skip ${skip}`);
  }
};

const appPort = process.env.APP_PORT || 3039;
let appPortChange = appPort as number;
try {
  switch (process.argv[2].toUpperCase()) {
    case 'IMPORTALL':
      appPortChange += 0;
      break;
    case 'SYNC':
      appPortChange += 1;
      break;
    default:
      logger.warn('Sorry, that is not something I know how to do.');
      process.exit(1);
  }
} catch {
  logger.error('Expected at least one argument!');
  process.exit(1);
}

// app.listen(process.env.APP_PORT, () => {
app.listen(appPortChange, () => {
  logger.info(
    `\n${'#'.repeat(80)}\n#${' '.repeat(21)} Service now running on port '${
      process.env.APP_PORT
    }' ${' '.repeat(21)}# \n${'#'.repeat(80)}\n`,
  );

  try {
    switch (process.argv[2].toUpperCase()) {
      case 'IMPORTALL':
        logger.info(process.argv[2]);
        importAll();
        break;
      case 'SYNC':
        logger.info(process.argv[2]);
        schedule(SyncMyLIMS);
        break;
      default:
        logger.warn('Sorry, that is not something I know how to do.');
        process.exit(1);
    }
  } catch {
    logger.error('Expected at least one argument!');
    process.exit(1);
  }
});
