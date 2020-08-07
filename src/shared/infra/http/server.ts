import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import helmet from 'helmet';

import AppError from '@shared/errors/AppError';

import schedule from '@shared/services/schedule';
import SyncMyLIMS from '@shared/services/SyncMyLIMS';

import SamplesController from '@modules/samples/infra/controller/SamplesControllerSched';
import updAuxiliaries from '@modules/samples/infra/controller/AuxiliariesController';
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

const importAll = async (): Promise<void> => {
  const samples = await apiMYLIMS.get('/samples?$inlinecount=allpages&$top=5');
  const totalCount = samples.data.TotalCount as number;
  const samplesController = new SamplesController();

  // await updAuxiliaries();
  // const skip = 0;
  const top = Number(process.env.COUNT_SINC_AT_TIME);
  let skip = 0;
  const filter = '';
  while (skip < totalCount) {
    await samplesController.list(skip, top, filter);
    skip += top;
  }
};

/* const importNews = async () => {

  const samples = await apiMYLIMS.get('/samples?$inlinecount=allpages&$orderby=Id desc&$top=50&$skip=0&$filter=TakenDateTime ge DATETIME'2020-08-07' or ReceivedTime ge DATETIME'2020-08-07' or FinalizedTime ge DATETIME'2020-08-07' or PublishedTime ge DATETIME'2020-08-07' or ReviewedTime ge DATETIME'2020-08-07' or TakenDateTime eq null');
  const totalCount = samples.data.TotalCount as number;
  const samplesController = new SamplesController();

  // await updAuxiliaries();
  // const skip = 0;
  const top = Number(process.env.COUNT_SINC_AT_TIME);
  let skip = 0;
  const filter = '';
  while (skip < totalCount) {
    await samplesController.list(skip, top, filter);
    skip += top;
  }
};
*/
app.listen(process.env.APP_PORT, () => {
  console.log(
    `\n${'#'.repeat(80)}` +
      `\n#${' '.repeat(21)} Service now running on port '${
        process.env.APP_PORT
      }' ${' '.repeat(21)}#` +
      `\n${'#'.repeat(80)}\n`,
  );

  schedule(SyncMyLIMS);
  importAll();
});
