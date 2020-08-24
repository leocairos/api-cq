/* eslint-disable no-case-declarations */
import 'dotenv/config';
import logger from '@config/logger';

import createConnection from '@shared/infra/typeorm';
import { CronJob } from 'cron';

import express from 'express';

import SamplesControllerv2 from '@modules/samples/infra/controller/SamplesControllerv2';
import apiMYLIMS from '@shared/services/apiMYLIMS';
import AuxiliariesControllerv2 from '@modules/samples/infra/controller/AuxiliariesControllerv2';
import runMode from '@config/runMode';

createConnection();

const app = express();

const importAllSamples = async (): Promise<void> => {
  const samples = await apiMYLIMS.get('/samples?$inlinecount=allpages&$top=5');
  const totalCount = samples.data.TotalCount as number;
  const samplesController = new SamplesControllerv2();

  const top = Number(process.env.COUNT_SINC_AT_TIME);
  let skip = Number(process.env.INTERVAL_SINC_MYLIMS_SKIP || 0);
  let recordsProcesseds = 0;
  const filter = '';
  while (skip < totalCount) {
    // eslint-disable-next-line no-await-in-loop
    const recordsProcNow = await samplesController.update(skip, top, filter);
    skip += top;
    recordsProcesseds += recordsProcNow;
    logger.info(`${recordsProcesseds} records imported (of ${totalCount})`);
  }
  logger.info(`Finished with ${totalCount} imported records`);
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

  const samples = await apiMYLIMS.get(`${baseURL}&$filter=${filter}`);

  const totalCount = samples.data.TotalCount as number;

  logger.info(`${totalCount} records until ${formatedDate}`);

  const top = Number(process.env.COUNT_SINC_AT_TIME);
  let skip = 0;
  let recordsProcesseds = 0;
  while (skip < totalCount) {
    // eslint-disable-next-line no-await-in-loop
    const recordsProcNow = await samplesController.update(skip, top, filter);
    skip += top;
    recordsProcesseds += recordsProcNow;
    logger.info(`${recordsProcesseds} records imported (of ${totalCount})`);
  }
  logger.info(`Finished with ${totalCount} imported records`);
};

const appPort = process.env.APP_PORT || 3039;
let appPortChange = appPort as number;

switch (runMode()) {
  case 'importAll':
    appPortChange += 0;
    break;
  case 'sync':
    appPortChange += 1;
    break;
  default:
    logger.warn('Sorry, that is not something I know how to do.');
    process.exit(1);
}

app.listen(appPortChange, () => {
  logger.info(
    `\n${'#'.repeat(80)}\n#${' '.repeat(21)} Service now running on port '${
      process.env.APP_PORT
    }' ${' '.repeat(21)}# \n${'#'.repeat(80)}\n`,
  );

  switch (runMode()) {
    case 'importAll':
      logger.info('Import All records');

      setTimeout(async () => {
        await AuxiliariesControllerv2();
        await importAllSamples();
      }, 3000);

      break;

    case 'sync':
      logger.info(process.argv[2]);

      let isRunning = false;
      const job = new CronJob('* * * * * *', () => {
        if (!isRunning) {
          isRunning = true;
          setTimeout(async () => {
            await AuxiliariesControllerv2();
            await importNews();
            isRunning = false;
          }, 3000);
        }
      });
      job.start();

      break;

    default:
      logger.warn('Sorry, that is not something I know how to do.');
      process.exit(1);
  }
});
