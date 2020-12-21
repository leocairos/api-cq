import { CronJob } from 'cron';
import { Request, Response } from 'express';

import SamplesControllerv2 from '@modules/samples/infra/controller/SamplesControllerv2';
import apiMYLIMS from '@shared/services/apiMYLIMS';
import AuxiliariesControllerv2 from '@modules/samples/infra/controller/AuxiliariesControllerv2';
import { runMode, appPort } from '@config/runMode';
import logger from '@config/logger';
import { remoteIp } from '@shared/services/util';

const serviceStatus = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.info(`GET in serviceStatus (from ${remoteIp(request)})...`);
  const myLIMsResponse = await apiMYLIMS.get('/checkConnection');
  const connectedMyLIMS = myLIMsResponse.data === true;

  return response.status(200).json({ connectedMyLIMS });
};

const checkTasks = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.info(`GET in checkTasks (from ${remoteIp(request)})...`);
  let tasksUrl = '/tasks/9/Histories?$inlinecount=allpages&$top=50&';
  tasksUrl += '$filter=Success eq false&$orderby=CreateDateTime';
  const myLIMsResponse = await apiMYLIMS.get(tasksUrl);

  const tasksWithError = myLIMsResponse.data.TotalCount;

  return response.status(200).json({ tasksWithError });
};

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

const serverListen = (): void => {
  logger.info(
    `\n${'#'.repeat(100)}\n${' '.repeat(
      26,
    )} Service now running on port '${appPort()}' (${process.env.NODE_ENV
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

      // eslint-disable-next-line no-case-declarations
      let isRunning = false;
      // eslint-disable-next-line no-case-declarations
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
};

export { serverListen, serviceStatus, checkTasks };
