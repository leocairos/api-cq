/* eslint-disable no-case-declarations */
import 'reflect-metadata';
import 'express-async-errors';
import 'dotenv/config';
import cors from 'cors';

import helmet from 'helmet';
import logger from '@config/logger';

import createConnection from '@shared/infra/typeorm';
import { CronJob } from 'cron';

import express from 'express';

import SamplesControllerv2 from '@modules/samples/infra/controller/SamplesControllerv2';
import apiMYLIMS from '@shared/services/apiMYLIMS';
import AuxiliariesControllerv2 from '@modules/samples/infra/controller/AuxiliariesControllerv2';
import runMode from '@config/runMode';

// import apiPowerBI from '@shared/services/apiPowerBI';
import routes from './routes';

createConnection();

const app = express();

app.use(cors());
app.use(express.json());

app.use(helmet());
app.disable('x-powered-by');

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

/* const refreshPowerBI = async (): Promise<void> => {
  await apiPowerBI
    .post('')
    .then(res =>
      logger.info(`PBI >>>> Refresh Power BI Dataset: ${res.statusText}`),
    )
    .catch(error =>
      logger.error(`ErrorPBI >>>>  while update Power BI: ${error}`),
    );
}; */

let appPort = Number(process.env.APP_PORT || 3039);

switch (runMode()) {
  case 'importAll':
    appPort += 0;
    break;
  case 'sync':
    appPort += 1;
    break;
  case 'api':
    appPort += 2;
    break;
  default:
    logger.warn('Sorry, that is not something I know how to do.');
    process.exit(1);
}

app.get('/serviceStatus', async (request, response) => {
  logger.info(`GET in serviceStatus`);

  const myLIMsResponse = await apiMYLIMS.get('/checkConnection');

  const connectedMyLIMS = myLIMsResponse.data === true;

  return response.json({ connectedMyLIMS });
});

app.use(routes);

app.listen(appPort, () => {
  logger.info(
    `\n${'#'.repeat(100)}\n#${' '.repeat(
      31,
    )} Service now running on port '${appPort}' ${' '.repeat(
      31,
    )}# \n${'#'.repeat(100)}\n`,
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
