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
import { CronJob } from 'cron';
import express from 'express';

import SamplesControllerv2 from '@modules/samples/infra/controller/SamplesControllerv2';
import apiMYLIMS from '@shared/services/apiMYLIMS';
import AuxiliariesControllerv2 from '@modules/samples/infra/controller/AuxiliariesControllerv2';
import { runMode, appPort } from '@config/runMode';
import uploadConfig from '@config/upload';

import { remoteIp } from '@shared/services/util';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';
import '@shared/container';

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

const importAllSamples = async (): Promise<void> => {
  const samplesController = new SamplesControllerv2();
  await apiMYLIMS
    .get('/samples?$inlinecount=allpages&$top=5')
    .then(async samples => {
      const totalCount = Number(samples.data.TotalCount);

      const top = Number(process.env.COUNT_SINC_AT_TIME);
      let skip = Number(process.env.INTERVAL_SINC_MYLIMS_SKIP || 0);
      let recordsProcesseds = 0;
      const filter = '';
      while (skip < totalCount) {
        // eslint-disable-next-line no-await-in-loop
        const recordsProcNow = await samplesController.update(
          skip,
          top,
          filter,
        );
        skip += top;
        recordsProcesseds += recordsProcNow;
        logger.info(`${recordsProcesseds} records imported (of ${totalCount})`);
      }
      logger.info(`Finished with ${totalCount} imported records`);
    })
    .catch(error => {
      logger.error(`[importAllSamples Get] Aborted with error: ${error}`);
    });
};

const importNews = async (): Promise<void> => {
  const samplesController = new SamplesControllerv2();
  const lastDate = await samplesController.getLastEditionStored();
  lastDate.setHours(
    lastDate.getHours() - Number(process.env.HOUR_TO_RETROCED_IMPORT || 12),
  );
  const formatedDate = lastDate.toISOString();
  const baseURL = '/samples?$inlinecount=allpages&$top=5&$skip=0';
  const filter = `CurrentStatus/EditionDateTime ge DATETIME'${formatedDate}'`;

  await apiMYLIMS
    .get(`${baseURL}&$filter=${filter}`)
    .then(async samples => {
      const totalCount = Number(samples.data.TotalCount);

      logger.info(`${totalCount} records until ${formatedDate}`);

      const top = Number(process.env.COUNT_SINC_AT_TIME);
      let skip = 0;
      let recordsProcesseds = 0;
      while (skip < totalCount) {
        // eslint-disable-next-line no-await-in-loop
        const recordsProcNow = await samplesController.update(
          skip,
          top,
          filter,
        );
        skip += top;
        recordsProcesseds += recordsProcNow;
        logger.info(`${recordsProcesseds} records imported (of ${totalCount})`);
      }
      logger.info(`Finished with ${totalCount} imported records`);
      logger.info(`Waiting next synchronization..`);
    })
    .catch(error => {
      logger.error(`[importNews Get] Aborted with error: ${error}`);
    });
};

app.get('/serviceStatus', async (request, response) => {
  logger.info(`GET in serviceStatus (from ${remoteIp(request)})...`);
  const myLIMsResponse = await apiMYLIMS.get('/checkConnection');
  const connectedMyLIMS = myLIMsResponse.data === true;

  return response.json({ connectedMyLIMS });
});

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

app.listen(appPort(), () => {
  logger.info(
    `\n${'#'.repeat(100)}\n${' '.repeat(
      26,
    )} Service now running on port '${appPort()}' (${
      process.env.NODE_ENV
    }) ${' '.repeat(26)} \n${'#'.repeat(100)}\n`,
  );

  switch (runMode()) {
    case 'importAll':
      logger.info('Import All records');

      try {
        setTimeout(async () => {
          await AuxiliariesControllerv2();
          await importAllSamples();
          process.exit(0);
        }, 3000);
      } catch (err) {
        logger.error(`Finished with error: ${err}`);
        process.exit(1);
      }
      break;

    case 'sync':
      logger.info(
        `Every ${process.env.INTERVAL_TO_IMPORT} seconds importing updated records in the last ${process.env.HOUR_TO_RETROCED_IMPORT} hours`,
      );

      let isRunning = false;
      let countUpdAux = 0;
      try {
        const job = new CronJob(
          `*/${process.env.INTERVAL_TO_IMPORT} * * * * *`,
          () => {
            if (!isRunning) {
              isRunning = true;
              setTimeout(async () => {
                if (countUpdAux % 50 === 0) {
                  await AuxiliariesControllerv2();
                  countUpdAux = 0;
                }
                countUpdAux += 1;

                await importNews();
                // await refreshPowerBI();
                isRunning = false;
              }, 3000);
            }
          },
        );
        job.start();
      } catch (err) {
        logger.error(`Finished with error: ${err}`);
        isRunning = false;
      }
      break;

    case 'api':
      logger.info('API mode');

      break;

    default:
      logger.warn('Sorry, that is not something I know how to do.');
      process.exit(1);
  }
});
